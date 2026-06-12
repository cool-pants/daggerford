"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { uuidOrNew } from "@/lib/ids";
import type { GMNote } from "@/lib/labels";

type Props = {
  open: boolean;
  labelId?: string;
  onClose: () => void;
  onSave: (note: GMNote) => void;
};

export function GMNoteEditor({ open, labelId, onClose, onSave }: Props) {
  const [noteType, setNoteType] = useState<GMNote["noteType"]>("npc");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!labelId || !title.trim() || !body.trim()) {
      return;
    }
    onSave({
      id: uuidOrNew(undefined),
      labelId,
      noteType,
      title: title.trim(),
      body: body.trim()
    });
    setTitle("");
    setBody("");
    onClose();
  }

  return (
    <Dialog open={open} title="Add GM Note" onClose={onClose}>
      <form className="space-y-4" onSubmit={submit}>
        <label className="block space-y-1 text-sm font-semibold">
          Type
          <select
            className="h-10 w-full rounded-md border border-ink/15 bg-white/85 px-3 text-sm outline-none focus:border-tide focus:ring-2 focus:ring-tide/20"
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
        </label>
        <label className="block space-y-1 text-sm font-semibold">
          Title
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="block space-y-1 text-sm font-semibold">
          Body
          <Textarea value={body} onChange={(event) => setBody(event.target.value)} />
        </label>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Note
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
