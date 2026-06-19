"use client";

import { useEffect, type MouseEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, FileText, Pencil, Skull, X } from "lucide-react";
import { LabelExpandedView } from "@/components/labels/LabelExpandedView";
import { Button } from "@/components/ui/button";
import type { GMNote, MapLabel } from "@/lib/labels";

type Props = {
  label?: MapLabel;
  isGM: boolean;
  onClose: () => void;
  onEdit: (label: MapLabel) => void;
  onToggleVisibility: (label: MapLabel) => void;
  onSaveGMNote: (note: GMNote) => void;
};

export function LabelSheet({ label, isGM, onClose, onEdit, onToggleVisibility, onSaveGMNote }: Props) {
  useEffect(() => {
    if (!label) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [label, onClose]);

  if (!label) {
    return null;
  }

  function handleBackdropMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-[950] bg-ink/30 p-3 backdrop-blur-sm sm:p-6" onMouseDown={handleBackdropMouseDown}>
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-white/70 bg-white/90 shadow-atlas backdrop-blur-xl">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-ink/10 bg-[#1f302c] px-4 py-3 text-parchment">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-parchment/25 bg-parchment/10 text-sm font-black shadow-sm">
                {label.icon ?? label.title.charAt(0)}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-black leading-tight">{label.title}</h2>
                <p className="truncate text-xs font-semibold uppercase tracking-wide text-parchment/70">
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
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-sky/15 px-3 py-1 text-sm font-bold capitalize text-tide">{label.type}</span>
              {label.visibility !== "public" ? (
                <span className="rounded-full bg-ink/10 px-3 py-1 text-sm font-bold capitalize text-ink/60">
                  {label.visibility}
                </span>
              ) : null}
              {label.destroyed ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-flower/15 px-3 py-1 text-sm font-bold text-flower">
                  <Skull className="h-4 w-4" />
                  Destroyed
                </span>
              ) : null}
            </div>
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
                  <Button size="sm" variant="ghost" onClick={() => onToggleVisibility(label)}>
                    {label.visibility === "public" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {label.visibility === "public" ? "Hide" : "Unhide"}
                  </Button>
                </>
              ) : null}
            </div>
          </div>
          <LabelExpandedView label={label} showGMNotes={isGM} onSaveGMNote={onSaveGMNote} />
        </div>
      </div>
    </div>
  );
}
