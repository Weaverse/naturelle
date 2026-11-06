import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const requested = process.argv.slice(2);
const files = requested.length
  ? requested
  : readdirSync("tests")
      .filter((name) => name.endsWith(".unit.test.ts"))
      .sort()
      .map((name) => join("tests", name));

if (files.length === 0) {
  throw new Error("No unit tests were found.");
}

function nativeTypeScriptArgs() {
  const mode = process.features?.typescript;
  if (mode === "strip" || mode === "transform" || mode === true) {
    return [];
  }
  const probe = spawnSync(
    process.execPath,
    ["--experimental-strip-types", "-e", "0"],
    { encoding: "utf8" },
  );
  if (probe.status === 0) {
    return ["--experimental-strip-types"];
  }
  return null;
}

function tsxCli() {
  const require = createRequire(import.meta.url);
  const packageJsonPath = require.resolve("tsx/package.json");
  const packageJson = require(packageJsonPath);
  const bin = packageJson.bin;
  const relativeBin = typeof bin === "string" ? bin : bin?.tsx;
  if (typeof relativeBin !== "string") {
    throw new Error("The installed tsx package does not expose a CLI.");
  }
  return join(dirname(packageJsonPath), relativeBin);
}

const nativeArgs = nativeTypeScriptArgs();
const result = nativeArgs
  ? spawnSync(process.execPath, [...nativeArgs, "--test", ...files], {
      stdio: "inherit",
    })
  : spawnSync(process.execPath, [tsxCli(), "--test", ...files], {
      stdio: "inherit",
    });

if (result.error) {
  throw result.error;
}
process.exit(result.status ?? 1);
