"use client";

import type { GMNote } from "@/lib/labels";

type Props = {
  notes: GMNote[];
  compact?: boolean;
};

export function GMNotesPanel({ notes, compact = false }: Props) {
  if (!notes.length) {
    return <p className="rounded-md border border-ink/10 bg-white/55 p-4 text-sm text-ink/60">No GM notes yet.</p>;
  }

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {notes.map((note) => (
        <details key={note.id} className="group rounded-md border border-ink/10 bg-white/75">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3">
            <span>
              <span className="block text-xs font-bold uppercase tracking-wide text-copper">
                {note.noteType.replace("_", " ")}
              </span>
              <span className="mt-1 block font-bold">{note.title}</span>
            </span>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-ink/5 text-lg font-bold text-ink/60 group-open:hidden">
              +
            </span>
            <span className="hidden h-7 w-7 shrink-0 place-items-center rounded-md bg-ink/5 text-lg font-bold text-ink/60 group-open:grid">
              -
            </span>
          </summary>
          <div className="border-t border-ink/10 px-3 pb-3 pt-2">
            <p className={compact ? "text-sm leading-5 text-ink/75" : "text-sm leading-6 text-ink/75"}>{note.body}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
