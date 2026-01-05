import { cn } from "~/utils/cn";

export interface BannerProps {
  children: React.ReactNode;
  className?: string;
  variant?: "success" | "error" | "info";
}

export function Banner({ children, className, variant = "info" }: BannerProps) {
  const variants = {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <div
      className={cn("p-3 rounded border text-sm", variants[variant], className)}
    >
      {children}
    </div>
  );
}
