import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useState,
} from "react";
import {
  clampProductQuantity,
  getProductQuantityMax,
} from "~/utils/product-quantity";

export function useQuantityDraft(
  value: number,
  max: number | null | undefined,
  onChange: (value: number) => void,
) {
  const maxQuantity = getProductQuantityMax(max);
  const [draftValue, setDraftValue] = useState(String(value));

  useEffect(() => {
    setDraftValue(String(clampProductQuantity(value, maxQuantity)));
  }, [value, maxQuantity]);

  const updateQuantity = (nextQuantity: number) => {
    const clampedQuantity = clampProductQuantity(nextQuantity, maxQuantity);
    setDraftValue(String(clampedQuantity));
    onChange(clampedQuantity);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextDraftValue = event.currentTarget.value;
    if (!/^\d*$/.test(nextDraftValue)) {
      return;
    }
    if (nextDraftValue === "") {
      setDraftValue("");
      return;
    }
    updateQuantity(Number(nextDraftValue));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        updateQuantity(value + 1);
        break;
      case "ArrowDown":
        event.preventDefault();
        updateQuantity(value - 1);
        break;
      case "Home":
        event.preventDefault();
        updateQuantity(1);
        break;
      case "End":
        if (maxQuantity !== undefined) {
          event.preventDefault();
          updateQuantity(maxQuantity);
        }
        break;
      case "Enter":
        event.currentTarget.blur();
        break;
      default:
        break;
    }
  };

  return {
    draftValue,
    maxQuantity,
    updateQuantity,
    handleChange,
    handleBlur: () => updateQuantity(Number(draftValue)),
    handleKeyDown,
  };
}
