import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { createWriteStream } from "node:fs";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, resolve as resolvePath } from "node:path";
import { finished } from "node:stream/promises";
import { setTimeout } from "node:timers/promises";
import { parseEnv } from "node:util";

// Exercise the real CLI, worker/SSR module graph and Vite optimizer.
// Storefront rendering and the Studio connection require separate checks.

const STARTUP_TIMEOUT_MS = 120_000;
const HTTP_TIMEOUT_MS = 60_000;
const FIRST_SSR_REQUEST_TIMEOUT_MS = 120_000;
const READINESS_POLL_INTERVAL_MS = 1000;
const SHUTDOWN_GRACE_MS = 10_000;
const CODEGEN_SETTLE_MS = 3000;
const STOREFRONT_ENV_KEY =
  /(?:TOKEN|SECRET|PASSWORD|API[_-]?KEY)|^(?:SHOP_ID|PUBLIC_(?:STORE|STOREFRONT|CHECKOUT|CUSTOMER_ACCOUNT)|WEAVERSE_|JUDGEME_|KLAVIYO_|PRODUCT_CUSTOM_DATA_METAFIELD|METAOBJECT_COLORS_TYPE)/i;

const credentialFreeEnv = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => !STOREFRONT_ENV_KEY.test(key)),
);

const runtimeReady = spawnSync(
  process.execPath,
  ["scripts/prepare-node22-runtime.mjs"],
  { stdio: "inherit" },
);
if (runtimeReady.status !== 0) {
  process.exit(runtimeReady.status ?? 1);
}

const listener = createServer();
listener.listen(0, "127.0.0.1");
await once(listener, "listening");
const { port } = listener.address();
await new Promise((closeListener) => listener.close(closeListener));

const logDirectory = await mkdtemp(join(tmpdir(), "naturelle-dev-runtime-"));
const logPath = join(logDirectory, "dev.raw.log");
const diagnosticsPath =
  process.env.NATURELLE_RUNTIME_LOG || join(logDirectory, "dev.log");
const envPath = join(logDirectory, "empty.env");
await writeFile(envPath, "", { mode: 0o600 });
const log = createWriteStream(logPath, { mode: 0o600 });
const child = spawn(
  process.execPath,
  [
    "node_modules/@shopify/cli/bin/run.js",
    "hydrogen",
    "dev",
    "--codegen",
    "--disable-version-check",
    "--entry",
    resolvePath("scripts/fixtures/runtime-worker.ts"),
    "--env-file",
    envPath,
    "--port",
    String(port),
  ],
  {
    detached: process.platform !== "win32",
    env: { ...credentialFreeEnv, SHOPIFY_CLI_NO_ANALYTICS: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
child.stdout.pipe(log, { end: false });
child.stderr.pipe(log, { end: false });
let spawnError;
child.on("error", (error) => {
  spawnError = error;
});

async function stopDevServer(devProcess) {
  if (
    !devProcess.pid ||
    devProcess.exitCode !== null ||
    devProcess.signalCode !== null
  ) {
    return;
  }
  const closed = once(devProcess, "close");
  if (process.platform === "win32") {
    const stop = spawn("taskkill", [
      "/pid",
      String(devProcess.pid),
      "/T",
      "/F",
    ]);
    await once(stop, "close");
    // taskkill can exit before the child's piped output has finished draining.
    await closed;
    return;
  }
  try {
    process.kill(-devProcess.pid, "SIGTERM");
  } catch (error) {
    if (error.code !== "ESRCH") {
      throw error;
    }
  }
  const result = await Promise.race([
    closed,
    setTimeout(SHUTDOWN_GRACE_MS, "timeout", { ref: false }),
  ]);
  if (result === "timeout") {
    process.kill(-devProcess.pid, "SIGKILL");
  }
  await closed;
}

/** Redact env-sourced secrets and strip query strings from saved diagnostics. */
async function writeSanitizedDiagnostics(sourceLogPath, outputDiagnosticsPath) {
  const secretKey = /token|secret|password|api[_-]?key/i;
  const secrets = Object.entries(process.env)
    .filter(([key, value]) => secretKey.test(key) && value)
    .map(([, value]) => value);
  const localEnv = await readFile(".env", "utf8").catch(() => "");
  for (const [key, value] of Object.entries(parseEnv(localEnv))) {
    if (secretKey.test(key) && value) {
      secrets.push(value);
    }
  }
  let diagnostics = await readFile(sourceLogPath, "utf8");
  for (const secret of secrets.sort((a, b) => b.length - a.length)) {
    diagnostics = diagnostics.replaceAll(secret, "[REDACTED]");
  }
  diagnostics = diagnostics.replace(
    /https?:\/\/[^\s"'<>]+/g,
    (url) => url.split("?")[0],
  );
  await mkdir(dirname(outputDiagnosticsPath), { recursive: true });
  await writeFile(outputDiagnosticsPath, diagnostics, { mode: 0o600 });
}

try {
  const base = `http://localhost:${port}`;
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;
  let ready = false;
  while (Date.now() < deadline) {
    if (spawnError) {
      throw spawnError;
    }
    assert.equal(child.exitCode, null, "Hydrogen dev exited before readiness");
    assert.equal(
      child.signalCode,
      null,
      "Hydrogen dev stopped before readiness",
    );
    try {
      const response = await fetch(`${base}/@vite/client`, {
        signal: AbortSignal.timeout(2000),
      });
      if (response.ok && (await response.text()).includes("createHotContext")) {
        ready = true;
        break;
      }
    } catch {
      // The listener is not ready yet; retry within the bounded startup window.
    }
    await setTimeout(READINESS_POLL_INTERVAL_MS);
  }
  assert.ok(ready, "Hydrogen dev did not serve the Vite client within 120s");

  const entry = await fetch(`${base}/app/entry.client.tsx`, {
    signal: AbortSignal.timeout(HTTP_TIMEOUT_MS),
  });
  assert.equal(entry.status, 200, "Client entry failed to transform");
  const code = await entry.text();
  assert.match(
    code,
    /hydrateRoot/,
    "Client entry did not contain the app bootstrap",
  );
  const optimizedImport = code.match(/["']([^"']*\/\.vite\/deps\/[^"']+)["']/);
  assert.ok(
    optimizedImport,
    "Client entry did not reference optimized dependencies",
  );
  const dependency = await fetch(new URL(optimizedImport[1], base), {
    signal: AbortSignal.timeout(HTTP_TIMEOUT_MS),
  });
  assert.equal(dependency.status, 200, "Optimized dependency failed to load");
  await dependency.arrayBuffer();

  // The first request compiles the full SSR graph, including on slower hosts.
  const worker = await fetch(`${base}/__naturelle_runtime_probe`, {
    signal: AbortSignal.timeout(FIRST_SSR_REQUEST_TIMEOUT_MS),
  });
  assert.equal(worker.status, 200, "Oxygen worker/SSR entry failed to execute");
  assert.deepEqual(await worker.json(), {
    serverConfigurationGuard: true,
    html: "<p>Naturelle runtime check</p>",
  });

  // The dev server can remain healthy even when its detached codegen watcher
  // exits. Give the watcher time to initialize, then make that hidden failure
  // part of this acceptance check.
  await setTimeout(CODEGEN_SETTLE_MS);
  const runtimeLog = await readFile(logPath, "utf8");
  assert.doesNotMatch(
    runtimeLog,
    /\[Codegen\].*failed|Codegen process exited with code/is,
    "Hydrogen dev's codegen watcher failed",
  );
  console.log(
    `${process.version}: Hydrogen codegen, worker/SSR, client transform and optimizer passed`,
  );
} catch (error) {
  console.error(`Dev runtime check failed. Diagnostics: ${diagnosticsPath}`);
  throw error;
} finally {
  await stopDevServer(child);
  log.end();
  await finished(log);
  await writeSanitizedDiagnostics(logPath, diagnosticsPath);
}
