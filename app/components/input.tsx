import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import type * as React from "react";
import { useState } from "react";
import { IconClose } from "~/components/icon";
import { cn } from "~/utils/cn";

const inputVariants = cva(
  "w-full !shadow-none focus:ring-0 focus-visible:outline-none placeholder-text-subtle bg-transparent",
  {
    variants: {
      variant: {
        default:
          "flex w-full rounded border-2 border-border-subtle text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-border hover:border-border disabled:cursor-not-allowed disabled:opacity-50",
        search:
          "px-0 py-2 text-sm placeholder-text-subtle w-full focus:ring-0 border-x-0 border-t-0 transition border-b-2 border-border/10 focus:border-border/50",
        minisearch:
          "hidden md:inline-block text-left lg:text-right border-b transition border-transparent -mb-px border-x-0 border-t-0 appearance-none px-0 py-1 focus:ring-transparent placeholder:opacity-20 placeholder-text-subtle focus:border-bar/50",
        error: "border-red-500",
        custom: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  suffix?: React.ReactNode;
  prefixElement?: React.ReactNode;
  onClear?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
}

const Input = ({
  className,
  type,
  variant = "default",
  prefixElement,
  suffix,
  onFocus,
  onBlur,
  onClear,
  ref,
  ...rest
}: InputProps) => {
  let [focused, setFocused] = useState(false);
  let commonClasses = cn(
    "w-full rounded-sm border px-3 py-3",
    focused ? "border-border" : "border-border-subtle",
    className,
  );

  let handleClear = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.previousSibling.value = "";
    if (onClear) {
      onClear(e);
    }
  };
  if (type === "search") {
    suffix = <IconClose className="cursor-pointer" onClick={handleClear} />;
  }
  let hasChild = Boolean(prefixElement || suffix);

  let rawInput = (
    <input
      type={type}
      ref={ref}
      autoComplete="off"
      className={cn(
        hasChild ? "relative grow border-none p-0" : commonClasses,
        inputVariants({ variant }),
      )}
      onFocus={(e) => {
        setFocused(true);
        if (onFocus) {
          onFocus(e);
        }
      }}
      onBlur={(e) => {
        setFocused(false);
        if (onBlur) {
          onBlur(e);
        }
      }}
      {...rest}
    />
  );

  return hasChild ? (
    <div
      className={clsx(
        commonClasses,
        "flex items-center gap-2 overflow-hidden border p-2.5",
      )}
    >
      {prefixElement}
      {rawInput}
      {suffix}
    </div>
  ) : (
    rawInput
  );
};
Input.displayName = "Input";

export { Input };
