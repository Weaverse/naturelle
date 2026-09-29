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
const GTM_FALLBACK_DELAY_MS = 8000;
const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/i;
const GTM_SCRIPT_ID = "google-tag-manager";
const INTENT_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"];

export function CustomAnalytics() {
  const rootData = useRouteLoaderData<RootLoader>("root");
  const id = rootData?.googleGtmID?.trim();

  if (!(id && GTM_ID_PATTERN.test(id))) {
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

    function pushEvent(event: Record<string, unknown>) {
      if (canTrack()) {
        window.dataLayer.push(event);
      }
    }

    subscribe(AnalyticsEvent.PAGE_VIEWED, (data: PageViewPayload) => {
      pushEvent({
        event: "page_viewed",
        page_path: getSafePath(data.url),
      });
    });
    subscribe(AnalyticsEvent.PRODUCT_VIEWED, (data: ProductViewPayload) => {
      pushEvent({
        event: "product_viewed",
        product_id: data.products?.[0]?.id,
        product_name: data.products?.[0]?.title,
        product_price: data.products?.[0]?.price,
        product_path: getSafePath(data.products?.[0]?.url),
      });
    });
    subscribe(AnalyticsEvent.COLLECTION_VIEWED, (data) => {
      pushEvent({
        event: "collection_viewed",
        collection_handle: data.collection?.handle,
      });
    });
    subscribe(AnalyticsEvent.CART_VIEWED, (data) => {
      pushEvent({
        event: "cart_viewed",
        cart_total: data.cart?.cost?.totalAmount?.amount,
        cart_total_quantity: data.cart?.totalQuantity,
      });
    });
    subscribe(AnalyticsEvent.CART_UPDATED, (data: CartUpdatePayload) => {
      pushEvent({
        event: "cart_updated",
        cart_total: data.cart?.cost?.totalAmount?.amount,
        cart_total_quantity: data.cart?.totalQuantity,
      });
    });
    subscribe(AnalyticsEvent.PRODUCT_ADD_TO_CART, () => {
      pushEvent({ event: "add_to_cart" });
    });
    subscribe(AnalyticsEvent.PRODUCT_REMOVED_FROM_CART, () => {
      pushEvent({ event: "remove_from_cart" });
    });
    subscribe(AnalyticsEvent.SEARCH_VIEWED, () => {
      pushEvent({ event: "search_viewed" });
    });
    subscribe(AnalyticsEvent.CUSTOM_EVENT, (data) => {
      if (data.eventName === "checkout_started") {
        pushEvent({ event: "checkout_started" });
      }
    });

    ready();
  }, [canTrack, ready, subscribe]);

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
