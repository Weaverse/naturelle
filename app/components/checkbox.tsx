import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import type * as React from "react";

import { cn } from "~/utils/cn";

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
  ref?: React.Ref<React.ElementRef<typeof CheckboxPrimitive.Root>>;
}

const Checkbox = (props: CheckboxProps) => {
  const { ref, className, label, ...rest } = props;
  return (
    <div className={cn(`flex items-center space-x-2.5`, className)}>
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "peer size-5 shrink-0 rounded-sm border-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-button-primary-background data-[state=checked]:text-button-primary-text",
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
