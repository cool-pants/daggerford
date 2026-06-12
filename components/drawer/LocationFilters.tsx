"use client";

import { labelTypes, type LabelType } from "@/lib/labels";

type Props = {
  value: LabelType | "all";
  onChange: (value: LabelType | "all") => void;
};

export function LocationFilters({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {labelTypes.map((type) => (
        <button
          key={type.value}
          className={`h-8 rounded-md border px-2 text-xs font-semibold transition ${
            value === type.value
              ? "border-tide bg-tide text-white"
              : "border-ink/15 bg-white/70 text-ink hover:bg-white"
          }`}
          onClick={() => onChange(type.value)}
          type="button"
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}
