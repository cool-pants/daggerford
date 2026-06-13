import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-ink/10 bg-white/85 px-3 text-sm shadow-sm outline-none transition placeholder:text-ink/45 focus:border-sky focus:ring-2 focus:ring-sky/25",
        className
      )}
      suppressHydrationWarning
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-y rounded-md border border-ink/10 bg-white/85 px-3 py-2 text-sm shadow-sm outline-none transition placeholder:text-ink/45 focus:border-sky focus:ring-2 focus:ring-sky/25",
        className
      )}
      suppressHydrationWarning
      {...props}
    />
  );
}
