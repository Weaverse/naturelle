import { CartForm } from "@shopify/hydrogen";
import { useEffect, useState } from "react";
import { type Fetcher, useFetchers } from "react-router";

export function useCartFetchers(actionName: string, onFinished?: () => void) {
  const fetchers = useFetchers();
  const cartFetchers: Fetcher[] = [];
  let [cartAdding, setCartAdding] = useState(false);

  useEffect(() => {
    for (const fetcher of fetchers) {
      if (fetcher.formData) {
        const formInputs = CartForm.getFormInput(fetcher.formData);
        if (formInputs.action === actionName) {
          cartFetchers.push(fetcher);
          if (fetcher.state === "submitting") {
            setCartAdding(true);
            break;
          }
        }
      }
    }
    if (fetchers.length === 0 && cartAdding) {
      setCartAdding(false);
      onFinished?.();
    }
  }, [fetchers, actionName, cartAdding, onFinished]);
  return { cartAdding, cartFetchers };
}
