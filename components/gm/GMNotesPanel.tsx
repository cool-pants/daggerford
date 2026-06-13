"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { uuidOrNew } from "@/lib/ids";
import type { GMNote } from "@/lib/labels";

type Props = {
  notes: GMNote[];
  compact?: boolean;
  labelId?: string;
  onSaveNote?: (note: GMNote) => void;
};

export function GMNotesPanel({ notes, compact = false, labelId, onSaveNote }: Props) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {labelId && onSaveNote ? <GMNoteInlineEditor labelId={labelId} onSave={onSaveNote} /> : null}
      {notes.length ? (
        notes.map((note) => (
          <details key={note.id} className="group rounded-md border border-white/70 bg-white/75 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3">
              <span>
                <span className="block text-xs font-bold uppercase tracking-wide text-copper">
                  {note.noteType.replace("_", " ")}
                </span>
                <span className="mt-1 block font-bold">{note.title}</span>
              </span>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-sky/10 text-lg font-bold text-tide group-open:hidden">
                +
              </span>
              <span className="hidden h-7 w-7 shrink-0 place-items-center rounded-md bg-sky/10 text-lg font-bold text-tide group-open:grid">
                -
              </span>
            </summary>
            <div className="border-t border-ink/10 px-3 pb-3 pt-2">
              <p className={compact ? "text-sm leading-5 text-ink/75" : "text-sm leading-6 text-ink/75"}>{note.body}</p>
            </div>
          </details>
        ))
      ) : (
        <p className="rounded-md border border-white/70 bg-white/60 p-4 text-sm text-ink/60 shadow-sm">No GM notes yet.</p>
      )}
    </div>
  );
}

function GMNoteInlineEditor({ labelId, onSave }: { labelId: string; onSave: (note: GMNote) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [noteType, setNoteType] = useState<GMNote["noteType"]>("secret");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      return;
    }

    onSave({
      id: uuidOrNew(undefined),
      labelId,
      noteType,
      title: title.trim(),
      body: body.trim(),
      tags: []
    });
    setTitle("");
    setBody("");
    setNoteType("secret");
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <Button size="sm" variant="primary" onClick={() => setIsOpen(true)}>
        Add GM Note
      </Button>
    );
  }

  return (
    <form className="rounded-md border border-white/70 bg-white/80 p-3 shadow-sm" onSubmit={submit}>
      <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
        <select
          className="h-10 w-full rounded-md border border-ink/10 bg-white/85 px-3 text-sm shadow-sm outline-none focus:border-sky focus:ring-2 focus:ring-sky/25"
          value={noteType}
          onChange={(event) => setNoteType(event.target.value as GMNote["noteType"])}
        >
          <option value="npc">NPC</option>
          <option value="location">Location</option>
          <option value="event">Event</option>
          <option value="secret">Secret</option>
          <option value="quest_hook">Quest Hook</option>
          <option value="faction">Faction</option>
          <option value="loot">Loot</option>
          <option value="encounter">Encounter</option>
        </select>
        <Input placeholder="Note title" value={title} onChange={(event) => setTitle(event.target.value)} />
      </div>
      <Textarea
        className="mt-3"
        placeholder="Private GM note..."
        value={body}
        onChange={(event) => setBody(event.target.value)}
      />
      <div className="mt-3 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Note
        </Button>
      </div>
    </form>
  );
}
