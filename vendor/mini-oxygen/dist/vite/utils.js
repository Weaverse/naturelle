import { Readable } from "node:stream";
import { sendResponse } from "@mjackson/node-fetch-server";
import { Request as MiniflareRequest } from "miniflare";
function toURL(req = "/", origin) {
  const isRequest = typeof req !== "string";
  let pathname = (isRequest ? req.url : req) || "/";
  return new URL(
    (origin || isRequest && req.headers.host && `http://${req.headers.host}` || "http://example.com") + pathname
  );
}
function toWeb(req, headers) {
  const authorityHeader = req.headers.host || req.headers[":authority"];
  const authority = Array.isArray(authorityHeader) ? authorityHeader[0] : authorityHeader;
  if (!authority) {
    throw new Error("Request must contain a host header.");
  }
  const requestHeaders = Object.fromEntries(
    Object.entries({ ...headers, ...req.headers }).filter(
      ([name]) => !name.startsWith(":")
    )
  );
  requestHeaders.host = authority;
  return new Request(toURL(req, `http://${authority}`), {
    method: req.method,
    headers: requestHeaders,
    body: req.headers["content-length"] ? Readable.toWeb(req) : void 0,
    duplex: "half",
    // This is required when sending a ReadableStream as body
    redirect: "manual"
    // Avoid consuming 300 responses here, return to browser
  });
}
function pipeFromWeb(webResponse, res) {
  return sendResponse(res, webResponse);
}
function toMiniflareRequest(request) {
  const host = request.headers.get("Host");
  if (host) {
    request.headers.set("X-Forwarded-Host", host);
  }
  return new MiniflareRequest(request.url, {
    method: request.method,
    headers: [["accept-encoding", "identity"], ...request.headers],
    body: request.body,
    duplex: "half"
  });
}
export {
  pipeFromWeb,
  toMiniflareRequest,
  toURL,
  toWeb
};
