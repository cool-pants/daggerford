"use client";

import type { MapLabel } from "@/lib/labels";
import { isPartiallyDestroyed } from "@/lib/labels";

type Props = {
  labels: MapLabel[];
  selectedId?: string;
  selectedLabelIds?: string[];
  showSelection?: boolean;
  onSelect: (label: MapLabel) => void;
  onToggleSelected?: (labelId: string) => void;
};

export function LocationList({
  labels,
  selectedId,
  selectedLabelIds = [],
  showSelection = false,
  onSelect,
  onToggleSelected
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink/60">Known Locations</h2>
        <span className="text-xs font-semibold text-ink/50">{labels.length}</span>
      </div>
      <div className="space-y-2">
        {labels.map((label) => {
          const isChecked = selectedLabelIds.includes(label.id);
          const isPartial = isPartiallyDestroyed(label);
          return (
            <div
              key={label.id}
              className={`w-full rounded-md border p-3 text-left shadow-sm transition ${
                selectedId === label.id
                  ? "border-sky bg-white"
                  : "border-white/70 bg-white/60 hover:bg-white"
              } ${label.visibility !== "public" ? "opacity-55" : ""}`}
              suppressHydrationWarning
            >
              <div className="flex gap-3">
                {showSelection ? (
                  <input
                    aria-label={`Select ${label.title}`}
                    checked={isChecked}
                    className="mt-1 h-4 w-4 shrink-0 accent-tide"
                    type="checkbox"
                    onChange={() => onToggleSelected?.(label.id)}
                  />
                ) : null}
                <button className="min-w-0 flex-1 text-left" type="button" onClick={() => onSelect(label)}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold">{label.title}</h3>
                    <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                      {label.destroyed ? (
                        <span className="rounded-full bg-flower/15 px-2 py-0.5 text-xs font-semibold text-flower">
                          destroyed
                        </span>
                      ) : null}
                      {isPartial ? (
                        <span className="rounded-full bg-sun/30 px-2 py-0.5 text-xs font-semibold text-copper">
                          partial
                        </span>
                      ) : null}
                      <span className="rounded-full bg-meadow/15 px-2 py-0.5 text-xs font-semibold capitalize text-moss">
                        {label.type}
                      </span>
                    </div>
                  </div>
                  {label.visibility !== "public" ? (
                    <span className="mt-2 inline-flex rounded-full bg-ink/10 px-2 py-0.5 text-xs font-bold capitalize text-ink/50">
                      {label.visibility}
                    </span>
                  ) : null}
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink/70">{label.description}</p>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
