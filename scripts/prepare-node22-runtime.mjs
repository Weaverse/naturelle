import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { extract } from "tar";

const CLI_VERSION = "4.6.1";
const STATIC_COMPILE_CACHE_IMPORT =
  "import {enableCompileCache} from 'node:module'";
const DYNAMIC_COMPILE_CACHE_IMPORT =
  "const {enableCompileCache} = await import('node:module')";
const CODEGEN_WATCHER_SPAWN =
  'let s=El(o,n,{stdio:["inherit","ignore","pipe"]});';
const NODE_ENV_SAFE_CODEGEN_WATCHER_SPAWN =
  'let s=El(o,n,{stdio:["inherit","ignore","pipe"],env:Object.fromEntries(Object.entries(process.env).filter(([a])=>a!=="NODE_ENV"))});';

// Published @shopify/cli@4.6.1 and rolldown@1.2.4 declare engines above the
// repository contract. npm still installs them when engine-strict is off.
// This script closes the four gaps that actually stop Node 22.0.0:
// the CLI's static enableCompileCache import, its leaked dev NODE_ENV in the
// codegen watcher, Rolldown's skipped binding, and GraphQL Codegen's CommonJS
// entry, which require()s ESM yargs.

export function assertSupportedNode(version = process.versions.node) {
  const [major] = version.split(".").map(Number);
  if (major < 22) {
    throw new Error(
      `Naturelle requires Node.js >=22.0.0. Current version is v${version}.`,
    );
  }
}

export function patchGraphqlCodegenManifest(manifest) {
  const entry = manifest.exports?.["."];
  const requireEntry = entry?.require;
  if (!requireEntry || typeof requireEntry.default !== "string") {
    throw new Error(
      "Could not patch @graphql-codegen/cli. Its package exports have changed.",
    );
  }
  if (requireEntry.default.endsWith("esm/index.js")) {
    return manifest;
  }
  if (!requireEntry.default.endsWith("cjs/index.js")) {
    throw new Error(
      `Could not patch @graphql-codegen/cli require entry ${requireEntry.default}.`,
    );
  }
  return {
    ...manifest,
    exports: {
      ...manifest.exports,
      ".": {
        ...entry,
        require: {
          ...requireEntry,
          default: "./esm/index.js",
        },
      },
    },
  };
}

export function patchShopifyCliSource(source) {
  const alreadyPatched =
    source.includes(DYNAMIC_COMPILE_CACHE_IMPORT) &&
    !source.includes(STATIC_COMPILE_CACHE_IMPORT);
  if (alreadyPatched) {
    return source;
  }
  if (!source.includes(STATIC_COMPILE_CACHE_IMPORT)) {
    throw new Error(
      "Could not patch @shopify/cli. bin/run.js does not match the 4.6.1 entrypoint.",
    );
  }
  return source.replace(
    STATIC_COMPILE_CACHE_IMPORT,
    [
      "// Node 22.0.0-22.7.x does not export enableCompileCache. A static",
      "// import crashes the CLI before this process can start.",
      DYNAMIC_COMPILE_CACHE_IMPORT,
    ].join("\n"),
  );
}

export function patchShopifyCliCodegenWatcherSource(source) {
  const alreadyPatched =
    source.includes(NODE_ENV_SAFE_CODEGEN_WATCHER_SPAWN) &&
    !source.includes(CODEGEN_WATCHER_SPAWN);
  if (alreadyPatched) {
    return source;
  }
  if (!source.includes(CODEGEN_WATCHER_SPAWN)) {
    throw new Error(
      "Could not patch @shopify/cli codegen watcher. Its 4.6.1 bundle has changed.",
    );
  }
  return source.replace(
    CODEGEN_WATCHER_SPAWN,
    NODE_ENV_SAFE_CODEGEN_WATCHER_SPAWN,
  );
}

export function rolldownBindingPackage(platform, arch, musl) {
  if (platform === "darwin" || platform === "freebsd") {
    return `@rolldown/binding-${platform}-${arch}`;
  }
  if (platform === "win32") {
    return `@rolldown/binding-win32-${arch}-msvc`;
  }
  if (platform === "linux") {
    if (arch === "arm") {
      return `@rolldown/binding-linux-arm-${musl ? "musleabihf" : "gnueabihf"}`;
    }
    if (arch === "ppc64" || arch === "s390x") {
      return `@rolldown/binding-linux-${arch}-gnu`;
    }
    return `@rolldown/binding-linux-${arch}-${musl ? "musl" : "gnu"}`;
  }
  throw new Error(
    `Rolldown has no supported native binding for ${platform}/${arch}.`,
  );
}

function isMusl() {
  if (process.platform !== "linux") {
    return false;
  }
  try {
    if (readFileSync("/usr/bin/ldd", "utf8").includes("musl")) {
      return true;
    }
  } catch {
    // ldd is not readable on every Linux image. Fall through.
  }
  try {
    const report = process.report?.getReport?.();
    if (report?.header?.glibcVersionRuntime) {
      return false;
    }
    if (
      Array.isArray(report?.sharedObjects) &&
      report.sharedObjects.some(
        (file) => file.includes("libc.musl-") || file.includes("ld-musl-"),
      )
    ) {
      return true;
    }
  } catch {
    // process.report can fail in restricted environments.
  }
  const result = spawnSync("ldd", ["--version"], { encoding: "utf8" });
  return `${result.stdout ?? ""}${result.stderr ?? ""}`
    .toLowerCase()
    .includes("musl");
}

function bindingLoads(root, packageName, version) {
  try {
    const require = createRequire(pathToFileURL(join(root, "package.json")));
    const installed = require(`${packageName}/package.json`).version;
    if (installed !== version) {
      return false;
    }
    require(packageName);
    return true;
  } catch {
    return false;
  }
}

function lockfileEntry(root, packageName) {
  const lockPath = join(root, "package-lock.json");
  if (!existsSync(lockPath)) {
    return undefined;
  }
  const lockfile = JSON.parse(readFileSync(lockPath, "utf8"));
  return lockfile.packages?.[`node_modules/${packageName}`];
}

async function packageDistribution(root, packageName, version) {
  const locked = lockfileEntry(root, packageName);
  if (locked?.resolved && locked.integrity) {
    return { tarball: locked.resolved, integrity: locked.integrity };
  }
  const response = await fetch(
    `https://registry.npmjs.org/${packageName.replace("/", "%2f")}/${version}`,
  );
  if (!response.ok) {
    throw new Error(
      `Could not resolve ${packageName}@${version} from the lockfile or npm registry (${response.status}).`,
    );
  }
  const metadata = await response.json();
  if (!metadata.dist?.tarball || !metadata.dist?.integrity) {
    throw new Error(
      `npm registry metadata for ${packageName}@${version} has no tarball.`,
    );
  }
  return {
    tarball: metadata.dist.tarball,
    integrity: metadata.dist.integrity,
  };
}

function checkIntegrity(bytes, integrity) {
  const [algorithm, expected] = integrity.split("-", 2);
  const actual = createHash(algorithm).update(bytes).digest("base64");
  if (actual !== expected) {
    throw new Error(
      `Integrity check failed for the Rolldown native binding (${integrity}).`,
    );
  }
}

async function installBinding(root, packageName, version) {
  const distribution = await packageDistribution(root, packageName, version);
  const response = await fetch(distribution.tarball);
  if (!response.ok) {
    throw new Error(
      `Could not download ${packageName}@${version} (${response.status}).`,
    );
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  checkIntegrity(bytes, distribution.integrity);

  const workspace = await mkdtemp(join(tmpdir(), "naturelle-rolldown-"));
  const archive = join(workspace, "binding.tgz");
  const destination = join(root, "node_modules", ...packageName.split("/"));
  try {
    await writeFile(archive, bytes);
    rmSync(destination, { recursive: true, force: true });
    mkdirSync(destination, { recursive: true });
    await extract({
      file: archive,
      cwd: destination,
      strip: 1,
    });
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }

  if (!bindingLoads(root, packageName, version)) {
    throw new Error(
      `${packageName}@${version} was installed but Node ${process.version} could not load it.`,
    );
  }
  console.log(
    `[node22] installed ${packageName}@${version} for Node ${process.version}`,
  );
}

async function ensureRolldownBinding(root) {
  const manifestPath = join(root, "node_modules/rolldown/package.json");
  if (!existsSync(manifestPath)) {
    return;
  }
  const version = JSON.parse(readFileSync(manifestPath, "utf8")).version;
  const packageName = rolldownBindingPackage(
    process.platform,
    process.arch,
    isMusl(),
  );
  if (bindingLoads(root, packageName, version)) {
    return;
  }
  await installBinding(root, packageName, version);
}

function patchInstalledCodegen(root) {
  const manifestPath = join(
    root,
    "node_modules/@graphql-codegen/cli/package.json",
  );
  if (!existsSync(manifestPath)) {
    return;
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const patched = patchGraphqlCodegenManifest(manifest);
  if (patched === manifest) {
    return;
  }
  writeFileSync(manifestPath, `${JSON.stringify(patched, null, 2)}\n`);
  console.log(
    `[node22] pointed @graphql-codegen/cli@${manifest.version} at its ESM entry for Node ${process.version}`,
  );
}

function patchInstalledCli(root) {
  const entryPath = join(root, "node_modules/@shopify/cli/bin/run.js");
  if (!existsSync(entryPath)) {
    return;
  }
  const manifest = JSON.parse(
    readFileSync(join(root, "node_modules/@shopify/cli/package.json"), "utf8"),
  );
  if (manifest.version !== CLI_VERSION) {
    throw new Error(
      `Expected published @shopify/cli@${CLI_VERSION}, found ${manifest.version}.`,
    );
  }
  const source = readFileSync(entryPath, "utf8");
  const patched = patchShopifyCliSource(source);
  if (patched === source) {
    // The entrypoint can already be patched while the codegen bundle is not.
  } else {
    writeFileSync(entryPath, patched);
  }

  const distDirectory = join(root, "node_modules/@shopify/cli/dist");
  const bundleCandidates = readdirSync(distDirectory)
    .filter((file) => file.endsWith(".js"))
    .map((file) => join(distDirectory, file))
    .filter((file) => {
      const bundle = readFileSync(file, "utf8");
      return (
        bundle.includes(CODEGEN_WATCHER_SPAWN) ||
        bundle.includes(NODE_ENV_SAFE_CODEGEN_WATCHER_SPAWN)
      );
    });
  if (bundleCandidates.length !== 1) {
    throw new Error(
      `Expected one @shopify/cli@${CLI_VERSION} codegen bundle, found ${bundleCandidates.length}.`,
    );
  }
  const [bundlePath] = bundleCandidates;
  const bundleSource = readFileSync(bundlePath, "utf8");
  const patchedBundle = patchShopifyCliCodegenWatcherSource(bundleSource);
  if (patchedBundle !== bundleSource) {
    writeFileSync(bundlePath, patchedBundle);
  }

  if (patched === source && patchedBundle === bundleSource) {
    return;
  }
  console.log(
    `[node22] patched @shopify/cli@${CLI_VERSION} for Node ${process.version}`,
  );
}

export async function prepareNode22Runtime(root = process.cwd()) {
  assertSupportedNode();
  patchInstalledCli(root);
  patchInstalledCodegen(root);
  await ensureRolldownBinding(root);
}

const invokedDirectly =
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (invokedDirectly) {
  prepareNode22Runtime(fileURLToPath(new URL("..", import.meta.url))).catch(
    (error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    },
  );
}
