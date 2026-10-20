import { isIframe, useWeaverse } from "@weaverse/hydrogen";

export function useWeaverseStudioCheck() {
  const { isDesignMode } = useWeaverse();
  const isStudioPreview =
    isIframe &&
    typeof window !== "undefined" &&
    window.location.search.includes("isDesignMode=true");

  return Boolean(isDesignMode || isStudioPreview);
}
