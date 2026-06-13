"use client";

import type { MapLabel } from "@/lib/labels";

type Props = {
  labels: MapLabel[];
  selectedId?: string;
  onSelect: (label: MapLabel) => void;
};

export function LocationList({ labels, selectedId, onSelect }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink/65">Known Locations</h2>
        <span className="text-xs font-semibold text-ink/50">{labels.length}</span>
      </div>
      <div className="space-y-2">
        {labels.map((label) => (
          <button
            key={label.id}
            className={`w-full rounded-md border p-3 text-left transition ${
              selectedId === label.id
                ? "border-tide bg-white shadow-sm"
                : "border-ink/10 bg-white/65 hover:bg-white"
            } ${label.visibility !== "public" ? "opacity-55" : ""}`}
            onClick={() => onSelect(label)}
            type="button"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold">{label.title}</h3>
              <span className="rounded-full bg-moss/12 px-2 py-0.5 text-xs font-semibold capitalize text-moss">
                {label.type}
              </span>
            </div>
            {label.visibility !== "public" ? (
              <span className="mt-2 inline-flex rounded-full bg-ink/10 px-2 py-0.5 text-xs font-bold capitalize text-ink/55">
                {label.visibility}
              </span>
            ) : null}
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink/70">{label.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
