import { useThemeSettings } from "@weaverse/hydrogen";
import { animate, inView, useAnimate } from "framer-motion";
import { ForwardedRef, useEffect } from "react";

type MotionType = "fade-up" | "fade-in" | "zoom-in" | "slide-in";

const ANIMATIONS: Record<MotionType, any> = {
  "fade-up": { opacity: [0, 1], y: [20, 0] },
  "fade-in": { opacity: [0, 1] },
  "zoom-in": { opacity: [0, 1], scale: [0.8, 1], y: [20, 0] },
  "slide-in": { opacity: [0, 1], x: [20, 0] },
};

export function useMotion(ref?: ForwardedRef<any>) {
  let { enableScrollReveal } = useThemeSettings();
  let [scope] = useAnimate();

  useEffect(() => {
    if (!scope.current || !ref) return;
    Object.assign(ref, { current: scope.current });
  }, [scope, ref]);

  useEffect(() => {
    if (!enableScrollReveal) {
      return;
    }
    if (scope.current) {
      scope.current.classList.add("animated-scope");
      const elems = scope.current.querySelectorAll("[data-motion]");
      elems.forEach((elem: HTMLElement, idx: number) => {
        inView(
          elem,
          ({ target }) => {
            let { motion, delay } = elem.dataset;
            animate(target, ANIMATIONS[motion as MotionType || "fade-up"], {
              delay: Number(delay) || idx * 0.15,
              duration: 0.5,
            });
            if (idx === elems.length - 1) {
              scope.current.classList.remove("animated-scope");
            }
          },
          { amount: 0.3 }
        );
      });
    }
  }, []);

  return [scope] as const;
}
