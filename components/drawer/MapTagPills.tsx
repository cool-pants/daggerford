"use client";

import { ATLAS_MAPS, type MapTagFilter } from "@/lib/map";

type Props = {
  value: MapTagFilter;
  onChange: (value: MapTagFilter) => void;
};

export function MapTagPills({ value, onChange }: Props) {
  const pills: Array<{ value: MapTagFilter; label: string }> = [
    { value: "all", label: "All" },
    ...ATLAS_MAPS.map((map) => ({ value: map.id, label: map.label }))
  ];

  return (
    <div className="flex gap-2 overflow-x-auto rounded-lg border border-white/70 bg-white/60 p-1 shadow-sm">
      {pills.map((pill) => (
        <button
          key={pill.value}
          className={`inline-flex min-h-8 shrink-0 items-center justify-center rounded-md border px-4 py-1.5 text-sm font-bold leading-tight transition ${
            value === pill.value
              ? "border-tide bg-tide text-white shadow-sm"
              : "border-transparent bg-transparent text-ink/70 hover:bg-white hover:text-ink"
          }`}
          suppressHydrationWarning
          type="button"
          onClick={() => onChange(pill.value)}
        >
          {pill.label}
        </button>
      ))}
    </div>
  );
}
