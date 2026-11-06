import fs from "node:fs/promises";
import path from "node:path";
import {
  createServer
} from "node:http";
import { lookup as lookupMimeType } from "mrmime";
import { getErrorPage } from "../common/error-page.js";
const artificialAssetPrefix = "mini-oxygen/00000/11111/22222/33333";
function buildAssetsUrl(assetsPort) {
  return `http://localhost:${assetsPort}/${artificialAssetPrefix}/`;
}
function createAssetsServer(assetsDirectory) {
  return createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      // Build assets are public and never require browser credentials.
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Private-Network", "true");
      res.setHeader("Access-Control-Max-Age", "86400");
      res.writeHead(204);
      res.end();
      return;
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("X-Content-Type-Options", "nosniff");
    const pathname = req.url?.split("?")[0] || "";
    const isValidAssetPath = pathname.startsWith(`/${artificialAssetPrefix}/`) && !pathname.includes("..");
    const relativeAssetPath = isValidAssetPath ? pathname.replace(`/${artificialAssetPrefix}`, "") : pathname;
    if (isValidAssetPath) {
      const root = await fs.realpath(assetsDirectory).catch(() => null);
      const rootPrefix = root && (root.endsWith(path.sep) ? root : root + path.sep);
      const candidatePath = root && path.resolve(root, `.${relativeAssetPath}`);
      // Validate before any filesystem lookup, then check the symlink target.
      const filePath = candidatePath && candidatePath.startsWith(rootPrefix)
        ? await fs.realpath(candidatePath).catch(() => null)
        : null;
      const isContained = filePath && filePath.startsWith(rootPrefix);
      const file = isContained ? await fs.open(filePath).catch(() => null) : null;
      const stat = await file?.stat().catch(() => {
      });
      if (file && stat?.isFile()) {
        res.setHeader("Content-Length", stat.size);
        res.setHeader(
          "Content-Type",
          lookupMimeType(relativeAssetPath) || "application/octet-stream"
        );
        return file.createReadStream().pipe(res);
      }
      await file?.close();
    }
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      getErrorPage({
        title: "404: Page not found",
        header: "404 NOT FOUND",
        message: isValidAssetPath ? "This file was not found in the build output directory:" : "The following URL pathname is not valid:",
        code: relativeAssetPath
      })
    );
  });
}
const STATIC_ASSET_EXTENSIONS = Object.freeze([
  "7Z",
  "CSV",
  "GIF",
  "MIDI",
  "PNG",
  "TIF",
  "ZIP",
  "AVI",
  "DOC",
  "GZ",
  "MKV",
  "PPT",
  "TIFF",
  "ZST",
  "AVIF",
  "DOCX",
  "ICO",
  "MP3",
  "PPTX",
  "TTF",
  "APK",
  "DMG",
  "ISO",
  "MP4",
  "PS",
  "WEBM",
  "BIN",
  "EJS",
  "JAR",
  "OGG",
  "RAR",
  "WEBP",
  "BMP",
  "EOT",
  "JPG",
  "OTF",
  "SVG",
  "WOFF",
  "BZ2",
  "EPS",
  "JPEG",
  "PDF",
  "SVGZ",
  "WOFF2",
  "CLASS",
  "EXE",
  "JS",
  "PICT",
  "SWF",
  "XLS",
  "CSS",
  "FLAC",
  "MID",
  "PLS",
  "TAR",
  "XLSX",
  "TXT",
  "XML",
  "MAP",
  "HTML",
  "GLB",
  "JSON"
]);
export {
  STATIC_ASSET_EXTENSIONS,
  buildAssetsUrl,
  createAssetsServer
};
