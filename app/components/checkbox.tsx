import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import type * as React from "react";

import { cn } from "~/utils/cn";

export type CheckboxShape = "square" | "circle";

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: React.ReactNode;
  shape?: CheckboxShape;
  ref?: React.Ref<React.ElementRef<typeof CheckboxPrimitive.Root>>;
}

const Checkbox = (props: CheckboxProps) => {
  const { ref, className, label, shape = "square", ...rest } = props;
  return (
    <div className={cn(`flex items-center space-x-2.5`, className)}>
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "peer size-5 shrink-0 border-2 border-border ring-offset-background transition-colors hover:border-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-button-primary-background data-[state=checked]:bg-button-primary-background data-[state=checked]:text-button-primary-text",
          shape === "circle" ? "rounded-full" : "rounded-sm",
        )}
        {...rest}
      >
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-current")}
        >
          <Check className="h-4 w-4" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label ? <span>{label}</span> : null}
    </div>
  );
};
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
