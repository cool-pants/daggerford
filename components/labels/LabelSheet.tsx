"use client";

import Link from "next/link";
import { EyeOff, FileText, Pencil, Plus, X } from "lucide-react";
import { LabelExpandedView } from "@/components/labels/LabelExpandedView";
import { Button } from "@/components/ui/button";
import type { MapLabel } from "@/lib/labels";

type Props = {
  label?: MapLabel;
  isGM: boolean;
  onClose: () => void;
  onEdit: (label: MapLabel) => void;
  onHide: (label: MapLabel) => void;
  onAddNote: (label: MapLabel) => void;
};

export function LabelSheet({ label, isGM, onClose, onEdit, onHide, onAddNote }: Props) {
  if (!label) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[950] bg-ink/35 p-3 backdrop-blur-[2px] sm:p-6">
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-md border border-ink/25 bg-[#efe4c8] shadow-atlas">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-ink/20 bg-ink px-4 py-3 text-parchment">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-parchment/25 bg-parchment/10 text-sm font-black">
                {label.icon ?? label.title.charAt(0)}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-black leading-tight">{label.title}</h2>
                <p className="truncate text-xs font-semibold uppercase tracking-wide text-parchment/65">
                  {label.region ?? "Uncharted"}
                </p>
              </div>
            </div>
          </div>
          <Button aria-label="Close location sheet" size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5 text-parchment" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-tide/10 px-3 py-1 text-sm font-bold capitalize text-tide">{label.type}</span>
            <div className="flex flex-wrap gap-2">
              <Link
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-tide px-3 text-sm font-semibold text-white transition hover:bg-[#255d60]"
                href={`/locations/${label.id}`}
              >
                <FileText className="h-4 w-4" />
                Page
              </Link>
              {isGM ? (
                <>
                  <Button size="sm" onClick={() => onEdit(label)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button size="sm" onClick={() => onAddNote(label)}>
                    <Plus className="h-4 w-4" />
                    Note
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onHide(label)}>
                    <EyeOff className="h-4 w-4" />
                    Hide
                  </Button>
                </>
              ) : null}
            </div>
          </div>
          <LabelExpandedView label={label} showGMNotes={isGM} />
        </div>
      </div>
    </div>
  );
}
