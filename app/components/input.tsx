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
          "flex w-full rounded-md border-2 border-border-subtle text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-border hover:border-border disabled:cursor-not-allowed disabled:opacity-50",
        search:
          "w-full border-x-0 border-t-0 border-b-2 border-border/10 px-0 py-0 text-base leading-[1.6] tracking-[-0.16px] placeholder-text-subtle transition focus:border-border/50 focus:ring-0",
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
  clearLabel?: string;
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
  clearLabel = "Clear search",
  ref,
  ...rest
}: InputProps) => {
  let [focused, setFocused] = useState(false);
  let commonClasses = cn(
    "w-full rounded-md border px-3 py-3.5",
    focused ? "border-border" : "border-border-subtle",
    className,
  );

  let handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const input = event.currentTarget
      .previousElementSibling as HTMLInputElement | null;
    if (!input) {
      return;
    }
    input.value = "";
    if (onClear) {
      onClear({
        ...event,
        target: input,
        currentTarget: input,
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };
  if (type === "search" && !suffix) {
    suffix = (
      <button
        type="button"
        aria-label={clearLabel}
        className="flex size-5 shrink-0 items-center justify-center"
        onMouseDown={(event) => event.preventDefault()}
        onClick={handleClear}
      >
        <IconClose aria-hidden="true" />
      </button>
    );
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
        "flex items-center gap-2 overflow-hidden border",
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
