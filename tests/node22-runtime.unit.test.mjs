import assert from "node:assert/strict";
import test from "node:test";
import {
  assertSupportedNode,
  patchGraphqlCodegenManifest,
  patchShopifyCliCodegenWatcherSource,
  patchShopifyCliSource,
  rolldownBindingPackage,
} from "../scripts/prepare-node22-runtime.mjs";

const upstreamEntry = `
import {enableCompileCache} from 'node:module'

if (enableCompileCache) enableCompileCache()
`;

test("replaces the CLI static enableCompileCache import", () => {
  const patched = patchShopifyCliSource(upstreamEntry);
  assert.equal(patched.includes("import {enableCompileCache}"), false);
  assert.match(patched, /await import\('node:module'\)/);
  assert.equal(patchShopifyCliSource(patched), patched);
});

test("rejects an unexpected Shopify CLI entry", () => {
  assert.throws(
    () => patchShopifyCliSource("console.log('different entry')\n"),
    /4\.6\.1/,
  );
});

test("does not leak dev NODE_ENV into the CLI codegen watcher", () => {
  const upstream = 'let s=El(o,n,{stdio:["inherit","ignore","pipe"]});return s';
  const patched = patchShopifyCliCodegenWatcherSource(upstream);
  assert.doesNotMatch(patched, /stdio:\["inherit","ignore","pipe"\]\}\)/);
  assert.match(patched, /a!=="NODE_ENV"/);
  assert.equal(patchShopifyCliCodegenWatcherSource(patched), patched);
  assert.throws(
    () => patchShopifyCliCodegenWatcherSource("console.log('changed')"),
    /codegen watcher/,
  );
});

test("selects the Rolldown binding npm skips below Node 22.12", () => {
  assert.equal(
    rolldownBindingPackage("linux", "x64", false),
    "@rolldown/binding-linux-x64-gnu",
  );
  assert.equal(
    rolldownBindingPackage("linux", "x64", true),
    "@rolldown/binding-linux-x64-musl",
  );
  assert.equal(
    rolldownBindingPackage("linux", "arm", false),
    "@rolldown/binding-linux-arm-gnueabihf",
  );
  assert.equal(
    rolldownBindingPackage("darwin", "arm64", false),
    "@rolldown/binding-darwin-arm64",
  );
  assert.equal(
    rolldownBindingPackage("win32", "x64", false),
    "@rolldown/binding-win32-x64-msvc",
  );
});

test("points GraphQL Codegen's require entry at ESM", () => {
  const manifest = {
    exports: {
      ".": {
        require: { default: "./cjs/index.js" },
        import: { default: "./esm/index.js" },
      },
    },
  };
  const patched = patchGraphqlCodegenManifest(manifest);
  assert.equal(patched.exports["."].require.default, "./esm/index.js");
  assert.equal(patchGraphqlCodegenManifest(patched), patched);
  assert.throws(
    () =>
      patchGraphqlCodegenManifest({
        exports: { ".": { require: { default: "./other.js" } } },
      }),
    /require entry/,
  );
});

test("accepts the Node 22.0.0 contract and rejects older majors", () => {
  assert.doesNotThrow(() => assertSupportedNode("22.0.0"));
  assert.doesNotThrow(() => assertSupportedNode("23.11.1"));
  assert.doesNotThrow(() => assertSupportedNode("26.13.0"));
  assert.throws(() => assertSupportedNode("20.19.0"), />=22\.0\.0/);
});
