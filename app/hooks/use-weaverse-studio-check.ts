import { isIframe, useWeaverse } from "@weaverse/hydrogen";

export function useWeaverseStudioCheck() {
  const { isDesignMode } = useWeaverse();

  if (isDesignMode === undefined && isIframe) {
    return window.location.search.includes("isDesignMode=true");
  }

  return isDesignMode;
}
