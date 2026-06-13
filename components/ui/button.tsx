import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "icon";
};

const variants = {
  primary: "bg-tide text-white shadow-sm hover:bg-[#176270] focus-visible:ring-sky/35",
  secondary: "border border-ink/10 bg-white/80 text-ink shadow-sm hover:bg-white focus-visible:ring-sky/30",
  ghost: "text-ink hover:bg-ink/10 focus-visible:ring-sky/30",
  danger: "bg-flower text-white shadow-sm hover:bg-[#b83b28] focus-visible:ring-flower/30"
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  icon: "h-9 w-9 p-0"
};

export function Button({ className = "", variant = "secondary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      suppressHydrationWarning
      {...props}
    />
  );
}
