"use client";

import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DELIMBIYR_TRAVEL_BASE_HOURS,
  formatDistance,
  formatTravelTime,
  getDelimbiyrPathDistance,
  type MapPoint
} from "@/lib/map";

type Props = {
  active: boolean;
  points: MapPoint[];
  onClear: () => void;
  onClose: () => void;
};

export function RulerPanel({ active, points, onClear, onClose }: Props) {
  if (!active && points.length === 0) {
    return null;
  }

  const distance = getDelimbiyrPathDistance(points);
  const ratio = distance.kilometers / 23;

  return (
    <aside className="absolute bottom-4 right-4 z-[720] max-h-[72vh] w-[min(360px,calc(100%-2rem))] overflow-auto rounded-lg border border-white/70 bg-white/90 p-4 shadow-atlas backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-black">Delimbiyr Ruler</h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink/50">
            {active ? "Click map points. Esc clears." : "Measurement paused."}
          </p>
        </div>
        <Button aria-label="Close ruler" size="icon" variant="ghost" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label="Distance" value={`${formatDistance(distance.kilometers)} km`} />
        <Metric label="Miles" value={`${formatDistance(distance.miles)} mi`} />
      </div>

      <div className="mt-4 rounded-md border border-white/70 bg-white/70 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-ink/50">Path Points</span>
          <span className="text-sm font-black">{points.length}</span>
        </div>
        <div className="mt-2 max-h-24 space-y-1 overflow-auto text-xs text-ink/65">
          {points.length ? (
            points.map((point, index) => (
              <div key={`${point.x}-${point.y}-${index}`} className="flex justify-between gap-3">
                <span>Point {index + 1}</span>
                <span>
                  X {point.x}, Y {point.y}
                </span>
              </div>
            ))
          ) : (
            <p>Click the Delimbiyr map to start measuring.</p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wide text-ink/50">Travel</h3>
        {DELIMBIYR_TRAVEL_BASE_HOURS.map((mode) => (
          <div key={mode.label} className="flex justify-between gap-3 rounded-md bg-white/65 px-3 py-2 text-sm">
            <span className="font-semibold text-ink/75">{mode.label}</span>
            <span className="text-right font-bold">{formatTravelTime(mode.hours * ratio)}</span>
          </div>
        ))}
      </div>

      <Button className="mt-4 w-full" disabled={!points.length} variant="secondary" onClick={onClear}>
        <Trash2 className="h-4 w-4" />
        Clear Path
      </Button>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/70 bg-white/70 p-3 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wide text-ink/50">{label}</div>
      <div className="mt-1 text-xl font-black">{value}</div>
    </div>
  );
}
