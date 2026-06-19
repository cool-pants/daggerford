"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";

type Props = {
  count: number;
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onSave: (note: { title: string; body: string; partiallyDestroyed: boolean }) => void;
};

export function BatchDestroyDialog({ count, open, saving, onClose, onSave }: Props) {
  const [title, setTitle] = useState("Destroyed by a dragon");
  const [body, setBody] = useState("Destroyed by a dragon");
  const [partiallyDestroyed, setPartiallyDestroyed] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !body.trim() || saving) {
      return;
    }
    onSave({ title: title.trim(), body: body.trim(), partiallyDestroyed });
  }

  return (
    <Dialog open={open} title="Mark Labels Destroyed" onClose={onClose}>
      <form className="space-y-4" onSubmit={submit}>
        <p className="text-sm leading-6 text-ink/70">
          This will mark {count} selected label{count === 1 ? "" : "s"} and add an Event GM note to each one.
        </p>
        <label className="flex items-center gap-2 rounded-md border border-ink/10 bg-white/70 px-3 py-2 text-sm font-semibold">
          <input
            checked={partiallyDestroyed}
            type="checkbox"
            onChange={(event) => setPartiallyDestroyed(event.target.checked)}
          />
          Partially destroyed
        </label>
        <label className="block space-y-1 text-sm font-semibold">
          Event title
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="block space-y-1 text-sm font-semibold">
          Event note
          <Textarea value={body} onChange={(event) => setBody(event.target.value)} />
        </label>
        <div className="flex justify-end gap-2">
          <Button disabled={saving} type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={saving} type="submit" variant="danger">
            {saving ? "Saving..." : partiallyDestroyed ? "Mark Partially Destroyed" : "Mark Destroyed"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
