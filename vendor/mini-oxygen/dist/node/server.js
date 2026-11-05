import path from "node:path";
import http from "node:http";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { lookup as lookupMimeType } from "mrmime";
import { Request } from "miniflare";
import connect from "connect";
import bodyParser from "body-parser";
import { OXYGEN_HEADERS_MAP } from "../common/headers.js";
import { Request as Request2, Response as Response2, fetch } from "miniflare";
const SSEUrl = "/__minioxygen_events";
const autoReloadScriptTemplate = `<script defer type="application/javascript">
(function () {
  // MiniOxygen Auto Reload
  var source = new EventSource('${SSEUrl}');
  source.addEventListener('open', function(e) { console.log('Auto Reload Enabled') }, false);
  source.onmessage = function(e) { if (e.data === 'connected') {console.log('Listening for events...');} else if (e.data === 'reload') {location.reload();} };
})();
</script>`;
function createAssetMiddleware({
  assetsDir,
  publicPath,
  proxyServer
}) {
  return (req, res, next) => {
    if (assetsDir === void 0) {
      return next();
    }
    if (shouldProxy(req, proxyServer)) {
      return next();
    }
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    let filePath;
    if (publicPath === void 0 || publicPath === "") {
      const pathname = url.pathname.substring(1);
      if (pathname === "") {
        return next();
      }
      filePath = path.join(assetsDir, pathname);
    } else {
      let pathname = url.pathname;
      if (pathname.startsWith(publicPath)) {
        pathname = pathname.substring(publicPath.length);
        filePath = path.join(assetsDir, pathname);
      } else {
        return next();
      }
    }
    if (fs.lstatSync(filePath, { throwIfNoEntry: false })?.isFile()) {
      const rs = fs.createReadStream(filePath);
      const { size } = fs.statSync(filePath);
      res.setHeader(
        "Content-Type",
        lookupMimeType(filePath) || "application/octet-stream"
      );
      res.setHeader("Content-Length", size);
      return rs.pipe(res);
    }
    next();
  };
}
function writeSSE(res, data) {
  const id = (/* @__PURE__ */ new Date()).toLocaleTimeString();
  res.write(`id: ${id}
`);
  res.write(`data: ${data}

`);
}
function createAutoReloadMiddleware(mf) {
  return (req, res) => {
    if (req.headers.accept && req.headers.accept === "text/event-stream") {
      mf.addEventListener("reload", () => writeSSE(res, "reload"));
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      });
      return writeSSE(res, "connected");
    } else {
      res.writeHead(400).end("Bad Request");
    }
  };
}
function createRequestMiddleware(mf, {
  autoReload,
  proxyServer,
  oxygenHeaders,
  onRequest,
  onResponse,
  onResponseError
}) {
  return async (req, res) => {
    if (shouldProxy(req, proxyServer)) {
      return sendProxyRequest(req, res, proxyServer);
    }
    const reqHeaders = {};
    for (const key in req.headers) {
      const val = req.headers[key];
      if (Array.isArray(val)) {
        reqHeaders[key] = val.join(",");
      } else if (val !== void 0) {
        reqHeaders[key] = val;
      }
    }
    if (!reqHeaders["request-id"]) {
      reqHeaders["request-id"] = randomUUID();
    }
    for (const [key, { name, defaultValue }] of Object.entries(
      OXYGEN_HEADERS_MAP
    )) {
      if (!reqHeaders[name]) {
        reqHeaders[name] = oxygenHeaders?.[key] ?? defaultValue;
      }
    }
    const request = new Request(urlFromRequest(req), {
      method: req.method,
      headers: reqHeaders,
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : null
    });
    let status = 500;
    const headers = {};
    const defaultDispatcher = (dispatchRequest = request) => mf.dispatchFetch(dispatchRequest);
    try {
      let response = await onRequest?.(request, defaultDispatcher);
      if (!response) {
        response = await defaultDispatcher();
        if (onResponse) await onResponse(request, response);
      }
      status = response.status;
      for (const key of response.headers.keys()) {
        const val = key.toLowerCase() === "set-cookie" ? response.headers.getSetCookie() : response.headers.get(key);
        if (val !== null) {
          headers[key] = val;
        }
      }
      let autoReloadScript = autoReloadScriptTemplate;
      const shouldAutoreload = autoReload && response.headers.get("content-type") === "text/html";
      if (shouldAutoreload) {
        const csp = response.headers.get("content-security-policy");
        if (csp) {
          const nonce = /'nonce-([^']+)'/.exec(csp)?.[1];
          if (nonce) {
            autoReloadScript = autoReloadScript.replace(
              "<script",
              `$& nonce="${nonce}"`
            );
          }
        }
        const contentLength = response.headers.get("content-length");
        if (contentLength) {
          headers["content-length"] = parseInt(contentLength, 10) + Buffer.byteLength(autoReloadScript);
        }
      }
      res.writeHead(status, headers);
      if (response.body) {
        for await (const chunk of response.body) {
          res.write(chunk);
        }
        if (shouldAutoreload) {
          res.write(autoReloadScript);
        }
      }
      res.end();
    } catch (err) {
      onResponseError?.(request, err);
      res.writeHead(status || 500, {
        "Content-Type": "text/plain; charset=UTF-8"
      });
      console.error(err);
      res.end("Internal server error", "utf8");
    }
  };
}
function sendProxyRequest(req, res, proxyServer) {
  const proxyRequest = new Promise(function(_resolve, reject) {
    const url = urlFromRequest(req);
    const [host = proxyServer, port = "80"] = proxyServer.split(":");
    const options = {
      host,
      port: parseInt(port, 10),
      path: `${url.protocol}//${url.host}${url.pathname}`,
      headers: {
        ...req.headers,
        "mini-Oxygen-Proxy": "true"
      },
      timeout: 3e3
    };
    const request = http.get(options, (response) => {
      const statusCode = response.statusCode || 0;
      res.writeHead(statusCode, response.statusMessage);
      response.pipe(res);
      return response;
    });
    request.on("timeout", () => {
      request.destroy();
      const error = new Error("connection to proxy timed out");
      reject(error);
    });
  });
  proxyRequest.catch((err) => {
    res.writeHead(500, { "Content-Type": "text/plain; charset=UTF-8" });
    res.end(err.stack, "utf8");
    return res;
  });
}
function createServer(mf, {
  assetsDir,
  publicPath,
  autoReload = false,
  proxyServer,
  ...rest
}) {
  const app = connect();
  if (assetsDir) {
    app.use(createAssetMiddleware({ assetsDir, publicPath, proxyServer }));
  }
  if (autoReload) {
    app.use(SSEUrl, createAutoReloadMiddleware(mf));
  }
  app.use(bodyParser.raw({ type: "*/*", limit: "100mb" }));
  app.use(createRequestMiddleware(mf, { autoReload, proxyServer, ...rest }));
  const server = http.createServer(app);
  return server;
}
function urlFromRequest(req) {
  const protocol = req.socket.encrypted ? "https" : "http";
  const origin = `${protocol}://${req.headers.host ?? "localhost"}`;
  const url = new URL(req.url ?? "", origin);
  return url;
}
function shouldProxy(req, proxyServer) {
  return typeof proxyServer !== "undefined" && proxyServer !== "" && !req.headers["mini-oxygen-proxy"];
}
export {
  Request2 as Request,
  Response2 as Response,
  createServer,
  fetch
};
