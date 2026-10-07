import { useEffect } from "react";

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousScrollbarGutter =
      document.documentElement.style.scrollbarGutter;

    document.documentElement.style.scrollbarGutter = "stable";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.scrollbarGutter = previousScrollbarGutter;
    };
  }, [locked]);
}
