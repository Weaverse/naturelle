function getMiniOxygenHandlerScript() {
  return `export default { fetch: ${miniOxygenHandler} }
${withRequestHook}`;
}
async function miniOxygenHandler(request, env, context) {
  const { pathname } = new URL(request.url);
  if (env.assets && env.staticAssetExtensions && request.method === "GET") {
    const staticAssetExtensions = new Set(env.staticAssetExtensions);
    const wellKnown = pathname.startsWith("/.well-known");
    const extension = pathname.split(".").at(-1) ?? "";
    const isAsset = wellKnown || !!staticAssetExtensions.has(extension.toUpperCase()) || pathname.startsWith("/assets/");
    if (isAsset) {
      const response = await env.assets.fetch(
        new Request(request.url, {
          signal: request.signal,
          headers: request.headers
        })
      );
      if (response.status !== 404) return response;
    }
  }
  const requestInit = {
    headers: {
      "request-id": crypto.randomUUID(),
      ...env.oxygenHeadersMap,
      ...Object.fromEntries(request.headers.entries())
    }
  };
  const handleRequest = () => env.entry.fetch(request, requestInit);
  return env.hook ? withRequestHook({
    ...requestInit,
    handleRequest,
    request,
    headers: requestInit.headers,
    hook: env.hook,
    context
  }) : handleRequest();
}
async function withRequestHook({
  handleRequest,
  request,
  headers,
  hook,
  context
}) {
  const startTimeMs = Date.now();
  const response = await handleRequest();
  const endTimeMs = Date.now();
  const durationMs = endTimeMs - startTimeMs;
  context.waitUntil(
    hook.fetch(request.url, {
      method: "POST",
      signal: request.signal,
      body: JSON.stringify({
        request: {
          url: request.url,
          method: request.method,
          headers: headers ?? Object.fromEntries(request.headers.entries())
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        },
        meta: {
          startTimeMs,
          endTimeMs,
          durationMs
        }
      })
    })
  );
  return response;
}
export {
  getMiniOxygenHandlerScript,
  withRequestHook
};
