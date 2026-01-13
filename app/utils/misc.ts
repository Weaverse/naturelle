import type { FulfillmentStatus } from "@shopify/hydrogen/customer-account-api-types";
import { colord, extend } from "colord";
import namesPlugin from "colord/plugins/names";
import { type LinkHTMLAttributes, useEffect, useState } from "react";
import typographicBase from "typographic-base/index";

extend([namesPlugin]);

export function constructURL(
  url: string,
  queries: Record<string, string | number | boolean> = {},
) {
  const fullUrl = url.startsWith("/") ? `${window.location.origin}${url}` : url;
  const _url = new URL(fullUrl);
  for (const [k, v] of Object.entries(queries)) {
    if (v !== undefined && v !== null) {
      _url.searchParams.set(k, v.toString());
    }
  }
  return _url.toString();
}

export function formDataToObject(formData: FormData) {
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
}

export function formatDate(date: string) {
  const dateObj = new Date(date);
  const dateStr = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeStr = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
  return `${dateStr} at ${timeStr}`;
}

export function isValidColor(color: string) {
  const c = colord(color);
  return c.isValid();
}

export function isLightColor(color: string, threshold = 0.8) {
  const c = colord(color);
  return c.isValid() && c.brightness() > threshold;
}

export function missingClass(string?: string, prefix?: string) {
  if (!string) {
    return true;
  }

  const regex = new RegExp(` ?${prefix}`, "g");
  return string.match(regex) === null;
}

export function formatText(input?: string | React.ReactNode) {
  if (!input) {
    return;
  }

  if (typeof input !== "string") {
    return input;
  }

  return typographicBase(input, { locale: "en-us" }).replace(
    /\s([^\s<]+)\s*$/g,
    "\u00A0$1",
  );
}

export function getExcerpt(text: string) {
  const regex = /<p.*>(.*?)<\/p>/;
  const match = regex.exec(text);
  return match?.length ? match[0] : text;
}

export function statusMessage(status: FulfillmentStatus) {
  const translations: Record<FulfillmentStatus, string> = {
    SUCCESS: "Success",
    PENDING: "Pending",
    OPEN: "Open",
    FAILURE: "Failure",
    ERROR: "Error",
    CANCELLED: "Cancelled",
  };
  try {
    return translations?.[status];
  } catch (error) {
    return status;
  }
}

/**
 * Validates that a url is local
 * @param url
 * @returns `true` if local `false`if external domain
 */
export function isLocalPath(url: string) {
  try {
    // We don't want to redirect cross domain,
    // doing so could create fishing vulnerability
    // If `new URL()` succeeds, it's a fully qualified
    // url which is cross domain. If it fails, it's just
    // a path, which will be the current domain.
    new URL(url);
  } catch (e) {
    return true;
  }

  return false;
}

export function removeFalsy<T = any>(
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  obj: {},
  falsyValues: any[] = ["", null, undefined],
): T {
  if (!obj || typeof obj !== "object") return obj as any;

  return Object.entries(obj).reduce((a: any, c) => {
    let [k, v]: [string, any] = c;
    if (
      falsyValues.indexOf(v) === -1 &&
      JSON.stringify(removeFalsy(v, falsyValues)) !== "{}"
    ) {
      a[k] =
        typeof v === "object" && !Array.isArray(v)
          ? removeFalsy(v, falsyValues)
          : v;
    }
    return a;
  }, {}) as T;
}

export function loadCSS(attrs: LinkHTMLAttributes<HTMLLinkElement>) {
  return new Promise((resolve, reject) => {
    let found = document.querySelector(`link[href="${attrs.href}"]`);
    if (found) {
      return resolve(true);
    }
    let link = document.createElement("link");
    Object.assign(link, attrs);
    link.addEventListener("load", () => resolve(true));
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

export function prefixClassNames(contentHtml: string, prefix: string) {
  const [articleContent, setArticleContent] = useState<string>("");
  const prefixClassNames = (html: string, prefix: string) => {
    html = html.replace(/class="([^"]*)"/g, (match, classNames) => {
      const prefixedClassNames = classNames
        .split(" ")
        .map((className: string) => `${prefix}${className}`)
        .join(" ");
      return `class="${prefixedClassNames}"`;
    });
    html = html.replace(/(\.[a-zA-Z0-9_-]+)\s*{/g, (match, className) => {
      return `.${prefix}${className.slice(1)} {`;
    });

    return html;
  };
  useEffect(() => {
    if (contentHtml) {
      const prefixedContent = prefixClassNames(contentHtml, prefix);
      setArticleContent(prefixedContent);
    }
  }, [contentHtml]);
  return articleContent;
}
