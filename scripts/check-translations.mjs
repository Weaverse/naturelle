import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const catalog = JSON.parse(readFileSync("app/locales/en-us.json", "utf8"));
const catalogKeys = new Set(flattenKeys(catalog));
const usedKeys = new Set();

for (const file of walk("app")) {
  if (![".ts", ".tsx"].includes(extname(file))) {
    continue;
  }
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/\bt\(\s*["']([^"']+)["']/g)) {
    usedKeys.add(match[1]);
  }
}

const missing = [...usedKeys].filter((key) => !catalogKeys.has(key)).sort();
assert.deepEqual(
  missing,
  [],
  `Missing en-US translation keys: ${missing.join(", ")}`,
);
console.log(`Verified ${usedKeys.size} translation keys in en-us.json`);

function flattenKeys(value, prefix = "") {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object" && !Array.isArray(child)
      ? flattenKeys(child, path)
      : [path];
  });
}

function* walk(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      yield* walk(path);
    } else {
      yield path;
    }
  }
}
