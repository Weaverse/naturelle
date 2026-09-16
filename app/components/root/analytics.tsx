import {
  AnalyticsEvent,
  type CartUpdatePayload,
  type PageViewPayload,
  type ProductViewPayload,
  useAnalytics,
  useNonce,
} from "@shopify/hydrogen";
import { useEffect, useRef } from "react";
import { useRouteLoaderData } from "react-router";
import type { RootLoader } from "~/root";

const GTM_ADAPTER_NAME = "Google Tag Manager";
const GTM_SCRIPT_ID = "google-tag-manager";
const GTM_FALLBACK_DELAY_MS = 8000;
const INTENT_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"];

export function CustomAnalytics() {
  const rootData = useRouteLoaderData<RootLoader>("root");
  const id = rootData?.googleGtmID;

  if (!id) {
    return null;
  }

  return <GoogleTagManagerAdapter id={id} />;
}

function GoogleTagManagerAdapter({ id }: { id: string }) {
  const { canTrack, register, subscribe } = useAnalytics();
  const nonce = useNonce();
  const { ready } = register(GTM_ADAPTER_NAME);
  const didSubscribe = useRef(false);

  useEffect(() => {
    if (didSubscribe.current) {
      return;
    }
    didSubscribe.current = true;
    window.dataLayer = window.dataLayer || [];

    subscribe(AnalyticsEvent.PAGE_VIEWED, (data: PageViewPayload) => {
      window.dataLayer.push({
        event: "page_viewed",
        page_path: getSafePath(data.url),
      });
    });
    subscribe(AnalyticsEvent.PRODUCT_VIEWED, (data: ProductViewPayload) => {
      window.dataLayer.push({
        event: "product_viewed",
        product_id: data.products?.[0]?.id,
        product_name: data.products?.[0]?.title,
        product_price: data.products?.[0]?.price,
        product_path: getSafePath(data.products?.[0]?.url),
      });
    });
    subscribe(AnalyticsEvent.COLLECTION_VIEWED, (data) => {
      window.dataLayer.push({
        event: "collection_viewed",
        collection_handle: data.collection?.handle,
      });
    });
    subscribe(AnalyticsEvent.CART_VIEWED, (data) => {
      window.dataLayer.push({
        event: "cart_viewed",
        cart_total: data.cart?.cost?.totalAmount?.amount,
        cart_total_quantity: data.cart?.totalQuantity,
      });
    });
    subscribe(AnalyticsEvent.CART_UPDATED, (data: CartUpdatePayload) => {
      window.dataLayer.push({
        event: "cart_updated",
        cart_total: data.cart?.cost?.totalAmount?.amount,
        cart_total_quantity: data.cart?.totalQuantity,
      });
    });
    subscribe(AnalyticsEvent.PRODUCT_ADD_TO_CART, () => {
      window.dataLayer.push({ event: "add_to_cart" });
    });
    subscribe(AnalyticsEvent.PRODUCT_REMOVED_FROM_CART, () => {
      window.dataLayer.push({ event: "remove_from_cart" });
    });
    subscribe(AnalyticsEvent.SEARCH_VIEWED, () => {
      window.dataLayer.push({ event: "search_viewed" });
    });
    subscribe(AnalyticsEvent.CUSTOM_EVENT, (data) => {
      if (data.eventName === "checkout_started") {
        window.dataLayer.push({ event: "checkout_started" });
      }
    });

    ready();
  }, [ready, subscribe]);

  useEffect(() => {
    let didLoad = Boolean(document.getElementById(GTM_SCRIPT_ID));
    let didSchedule = false;
    let fallbackTimer: number | undefined;

    function cleanupIntentEvents() {
      for (const event of INTENT_EVENTS) {
        window.removeEventListener(event, loadGtm);
      }
      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
        fallbackTimer = undefined;
      }
    }

    function loadGtm() {
      if (didLoad) {
        return;
      }

      cleanupIntentEvents();
      didSchedule = false;
      if (!canTrack()) {
        return;
      }

      didLoad = true;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      window.dataLayer.push(["js", new Date()]);
      window.dataLayer.push(["config", id]);

      const script = document.createElement("script");
      script.async = true;
      script.id = GTM_SCRIPT_ID;
      script.nonce = nonce;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
      document.head.appendChild(script);
    }

    function scheduleGtm() {
      if (didLoad || didSchedule || !canTrack()) {
        return;
      }

      didSchedule = true;
      for (const event of INTENT_EVENTS) {
        window.addEventListener(event, loadGtm, {
          once: true,
          passive: true,
        });
      }
      fallbackTimer = window.setTimeout(loadGtm, GTM_FALLBACK_DELAY_MS);
    }

    document.addEventListener("shopifyCustomerPrivacyApiLoaded", scheduleGtm);
    document.addEventListener("visitorConsentCollected", scheduleGtm);
    scheduleGtm();

    return () => {
      cleanupIntentEvents();
      document.removeEventListener(
        "shopifyCustomerPrivacyApiLoaded",
        scheduleGtm,
      );
      document.removeEventListener("visitorConsentCollected", scheduleGtm);
    };
  }, [canTrack, id, nonce]);

  return null;
}

function getSafePath(url: unknown) {
  if (typeof url !== "string" || !url) {
    return undefined;
  }

  try {
    return new URL(url, window.location.origin).pathname;
  } catch {
    return undefined;
  }
}
