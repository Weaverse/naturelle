import type { CartApiQueryFragment } from "storefront-api.generated";

export type CartLayout = "page" | "aside";

export type CartLine = CartApiQueryFragment["lines"]["nodes"][number] & {
  isOptimistic?: boolean;
};

export type CartWithOptimistic = CartApiQueryFragment & {
  isOptimistic?: boolean;
};

export type CartMutationResponse = {
  cart?: CartApiQueryFragment | null;
  errors?: { message?: string }[];
  userErrors?: {
    code?: string | null;
    field?: string[] | null;
    message?: string;
  }[];
  warnings?: { code?: string; message?: string; target?: string }[];
};
