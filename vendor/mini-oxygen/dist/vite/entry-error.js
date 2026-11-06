import { readFile } from "node:fs/promises";
import { getErrorPage } from "../common/error-page.js";
function isEntrypointError(webResponse) {
  return webResponse.status === 503 && webResponse.statusText === "executeEntrypoint error";
}
async function handleEntrypointError(viteDevServer, webResponse, res, entryPointErrorHandler) {
  const stack = (await webResponse.text()).split("\n").filter((line) => !line.includes("mini-oxygen")).join("\n");
  const optimizableDependency = await findOptimizableDependency(
    viteDevServer,
    stack
  ).catch(() => void 0);
  const header = `MiniOxygen couldn't load your app's entry point.`;
  const message = optimizableDependency ? `Try adding <code>${optimizableDependency}</code> to the <code>ssr.optimizeDeps.include</code> array in your Vite config.` : "";
  if (!entryPointErrorHandler) {
    console.warn(
      "\nWarning: " + header + "\n" + message.replace(/<\/?code>/g, '"')
    );
  }
  const result = await entryPointErrorHandler?.({
    optimizableDependency,
    stack
  })?.catch(() => void 0);
  res.writeHead(
    result?.status ?? 503,
    result?.headers ?? { "Content-Type": "text/html; charset=utf-8" }
  );
  res.end(
    result?.body ?? getErrorPage({
      title: "Entry point error",
      header,
      message,
      code: stack
    })
  );
  return true;
}
async function findOptimizableDependency(viteServer, stack) {
  const filepath = stack.match(/^\s+at\s([^:\?]+)(\?|:\d)/m)?.[1]?.replace(/^.*?\(/, "").replace(/\?.+$/, "");
  const nodeModulesPath = filepath?.split(/node_modules[\\\/]/).pop();
  if (!filepath || !nodeModulesPath) return;
  const mods = viteServer.moduleGraph.getModulesByFile(filepath);
  const modImporters = /* @__PURE__ */ new Set();
  mods?.forEach((mod) => {
    mod.importers.forEach((importer) => {
      if (importer.file) modImporters.add(importer.file);
    });
  });
  for (const mod of modImporters) {
    const importersSet = /* @__PURE__ */ new Set();
    const code = await readFile(mod, "utf-8").catch(() => "");
    const matches = code.matchAll(/import\s[^'"]*?['"]((@|\w)[^'"]+)['"]/g) ?? [];
    for (const [, match] of matches) {
      if (match) importersSet.add(match);
    }
    const importers = Array.from(importersSet).sort(
      (a, b) => b.length - a.length
    );
    const foundMatchingDependency = importers.find(
      (importer) => nodeModulesPath.startsWith(importer)
    );
    if (foundMatchingDependency) return foundMatchingDependency;
  }
}
export {
  handleEntrypointError,
  isEntrypointError
};
