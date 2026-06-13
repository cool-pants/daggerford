"use client";

import { labelTypes, type LabelType } from "@/lib/labels";

type Props = {
  value: LabelType | "all";
  onChange: (value: LabelType | "all") => void;
};

export function LocationFilters({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {labelTypes.map((type) => (
        <button
          key={type.value}
          className={`min-h-8 min-w-0 flex-1 basis-[calc(50%-0.25rem)] rounded-md border px-2 py-1.5 text-xs font-semibold leading-tight transition sm:basis-[calc(33.333%-0.375rem)] ${
            value === type.value
              ? "border-moss bg-moss text-white shadow-sm"
              : "border-ink/10 bg-white/70 text-ink/75 hover:bg-white hover:text-ink"
          }`}
          suppressHydrationWarning
          onClick={() => onChange(type.value)}
          type="button"
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}
