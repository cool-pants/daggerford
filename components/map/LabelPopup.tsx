"use client";

import Link from "next/link";
import { EyeOff, FileText, Pencil, Plus } from "lucide-react";
import { LabelExpandedView } from "@/components/labels/LabelExpandedView";
import { Button } from "@/components/ui/button";
import type { MapLabel } from "@/lib/labels";

type Props = {
  label: MapLabel;
  isGM: boolean;
  onEdit: (label: MapLabel) => void;
  onHide: (label: MapLabel) => void;
  onAddNote: (label: MapLabel) => void;
};

export function LabelPopup({ label, isGM, onEdit, onHide, onAddNote }: Props) {
  return (
    <div className="w-80 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-black">{label.title}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink/50">{label.region}</p>
        </div>
        <span className="rounded-full bg-tide/10 px-2 py-0.5 text-xs font-bold capitalize text-tide">
          {label.type}
        </span>
      </div>
      <div className="mt-3 max-h-96 overflow-auto pr-1">
        <LabelExpandedView compact label={label} showGMNotes={isGM} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          className="inline-flex h-8 items-center justify-center gap-2 rounded-md bg-tide px-3 text-xs font-semibold text-white transition hover:bg-[#255d60]"
          href={`/locations/${label.id}`}
        >
          <FileText className="h-3.5 w-3.5" />
          Details
        </Link>
        {isGM ? (
          <>
            <Button className="h-8 px-3 text-xs" size="sm" onClick={() => onEdit(label)}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button className="h-8 px-3 text-xs" size="sm" onClick={() => onAddNote(label)}>
              <Plus className="h-3.5 w-3.5" />
              Note
            </Button>
            <Button className="h-8 px-3 text-xs" size="sm" variant="ghost" onClick={() => onHide(label)}>
              <EyeOff className="h-3.5 w-3.5" />
              Hide
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
