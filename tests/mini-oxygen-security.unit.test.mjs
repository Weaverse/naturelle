import assert from "node:assert/strict";
import { once } from "node:events";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { request } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { createServer } from "../vendor/mini-oxygen/dist/node/server.js";
import {
  buildAssetsUrl,
  createAssetsServer,
} from "../vendor/mini-oxygen/dist/worker/assets.js";

async function listen(server, t) {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(
    () =>
      new Promise((resolve) => {
        server.close(resolve);
        server.closeAllConnections();
      }),
  );
  return server.address().port;
}

async function get(port, pathname, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = request(
      {
        hostname: "127.0.0.1",
        port,
        path: pathname,
        method,
        headers: { Origin: "https://untrusted.example" },
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () =>
          resolve({ status: res.statusCode, headers: res.headers, body }),
        );
      },
    );
    req.on("error", reject);
    req.end();
  });
}

test("assets stay public without credentials and cannot escape the real root", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "naturelle-assets-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const root = path.join(directory, "public");
  await mkdir(root);
  await writeFile(path.join(root, "app.js"), "public asset");
  await writeFile(path.join(directory, "private.txt"), "private contents");
  await mkdir(path.join(root, "folder"));
  const port = await listen(createAssetsServer(root), t);
  const prefix = new URL(buildAssetsUrl(port)).pathname;
  const asset = await get(port, `${prefix}app.js`);
  assert.equal(asset.status, 200);
  assert.equal(asset.body, "public asset");
  const options = await get(port, `${prefix}app.js`, "OPTIONS");
  assert.equal(options.status, 204);
  assert.equal(options.headers["access-control-allow-origin"], "*");
  assert.equal(options.headers["access-control-allow-credentials"], undefined);
  for (const suffix of [
    "../private.txt",
    "%2e%2e/private.txt",
    "..%5cprivate.txt",
    "missing",
    "folder",
  ]) {
    const response = await get(port, `${prefix}${suffix}`);
    assert.equal(response.status, 404, suffix);
    assert.ok(!response.body.includes("private contents"));
  }
  await t.test("symlinks outside the asset root are rejected", async (st) => {
    try {
      await symlink(
        path.join(directory, "private.txt"),
        path.join(root, "link.txt"),
      );
    } catch (error) {
      if (error.code !== "EPERM") {
        throw error;
      }
      st.skip("Native host does not permit symlink creation");
      return;
    }
    assert.equal((await get(port, `${prefix}link.txt`)).status, 404);
    await writeFile(path.join(root, "payload"), "console.log('ok')");
    await symlink(path.join(root, "payload"), path.join(root, "bundle.js"));
    const linkedAsset = await get(port, `${prefix}bundle.js`);
    assert.equal(linkedAsset.status, 200);
    assert.match(linkedAsset.headers["content-type"], /javascript/);
    assert.equal(linkedAsset.body, "console.log('ok')");
  });
});

test("request failures preserve diagnostics without exposing the stack over HTTP", async (t) => {
  const failure = new Error("private /home/developer/source.ts");
  const diagnostics = [];
  const original = console.error;
  console.error = (error) => diagnostics.push(error);
  t.after(() => {
    console.error = original;
  });
  const port = await listen(
    createServer(
      {
        dispatchFetch: async () => {
          throw failure;
        },
      },
      {},
    ),
    t,
  );
  const response = await get(port, "/");
  assert.equal(response.status, 500);
  assert.equal(response.body, "Internal server error");
  assert.ok(diagnostics.includes(failure));
});

test("bundled stack formatter handles method names longer than function names", async () => {
  const source = await readFile(
    new URL("../vendor/mini-oxygen/dist/vite/worker-entry.js", import.meta.url),
    "utf8",
  );
  const formatter = source.slice(
    source.indexOf("function CallSiteToString()"),
    source.indexOf("function cloneCallSite("),
  );
  const format = new Function(`${formatter}; return CallSiteToString;`)();
  const frame = {
    isNative: () => false,
    getScriptNameOrSourceURL: () => "file.js",
    getLineNumber: () => 1,
    getColumnNumber: () => 1,
    getFunctionName: () => "f",
    isConstructor: () => false,
    isToplevel: () => false,
    getTypeName: () => "Object",
    getMethodName: () => "f",
  };
  assert.match(format.call(frame), /\[as f\]/);
  assert.doesNotMatch(
    format.call({ ...frame, getFunctionName: () => "Object.f" }),
    /\[as/,
  );
});

for (const lineEnding of ["\n", "\r\n"]) {
  test(`worker entry failures stay private with ${lineEnding === "\n" ? "LF" : "CRLF"} source`, async () => {
    const rawSource = await readFile(
      new URL(
        "../vendor/mini-oxygen/dist/vite/worker-entry.js",
        import.meta.url,
      ),
      "utf8",
    );
    const source = rawSource
      .replace(/\r?\n/g, lineEnding)
      .replace(/\r\n/g, "\n");
    const start = source.indexOf(
      "return runtime.import(env.__VITE_RUNTIME_EXECUTE_URL).catch",
    );
    const end = source.indexOf("\n}\nfunction isViteInvokePayload");
    assert.ok(
      start >= 0 && end > start,
      "Expected worker entry error handler boundaries",
    );
    const body = source.slice(start, end);
    const run = new Function("runtime", "env", "console", body);
    const failure = new Error("private /home/developer/source.ts");
    const diagnostics = [];
    const result = await run(
      { import: () => Promise.reject(failure) },
      {},
      { error: (error) => diagnostics.push(error) },
    );
    assert.equal(result.errorResponse.status, 503);
    assert.equal(
      await result.errorResponse.text(),
      "Unable to load Oxygen worker entry. Check the dev server logs.",
    );
    assert.deepEqual(diagnostics, [failure]);
  });
}
