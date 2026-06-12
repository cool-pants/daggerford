import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-10 w-full rounded-md border border-ink/15 bg-white/85 px-3 text-sm outline-none transition placeholder:text-ink/45 focus:border-tide focus:ring-2 focus:ring-tide/20 ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-24 w-full resize-y rounded-md border border-ink/15 bg-white/85 px-3 py-2 text-sm outline-none transition placeholder:text-ink/45 focus:border-tide focus:ring-2 focus:ring-tide/20 ${className}`}
      {...props}
    />
  );
}
