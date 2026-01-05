import { cn } from "~/utils/cn";

export function RevealUnderline({
  children,
  className,
  as: Component = "span",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Component
      className={cn(
        "relative bg-transparent pb-1",
        "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-current",
        "after:origin-right after:scale-x-0 after:transition-transform after:duration-300",
        "group-hover:after:origin-left group-hover:after:scale-x-100",
        className,
      )}
    >
      {children}
    </Component>
  );
}
