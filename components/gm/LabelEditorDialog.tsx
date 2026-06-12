"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { uuidOrNew } from "@/lib/ids";
import type { LabelType, LabelVisibility, MapLabel } from "@/lib/labels";

const emptyLabel: Omit<MapLabel, "id"> = {
  title: "",
  description: "",
  x: 0,
  y: 0,
  type: "town",
  visibility: "public",
  icon: "",
  region: "",
  tags: [],
  linkedDungeons: [],
  linkedNpcs: [],
  linkedEvents: [],
  linkedFactions: [],
  notes: []
};

function parseCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

type Props = {
  open: boolean;
  label?: MapLabel;
  point?: { x: number; y: number };
  onClose: () => void;
  onSave: (label: MapLabel) => void;
  onDelete?: (label: MapLabel) => void;
};

export function LabelEditorDialog({ open, label, point, onClose, onSave, onDelete }: Props) {
  const [draft, setDraft] = useState<Omit<MapLabel, "id">>(emptyLabel);
  const [tags, setTags] = useState("");
  const [linkedDungeons, setLinkedDungeons] = useState("");
  const [linkedNpcs, setLinkedNpcs] = useState("");
  const [linkedEvents, setLinkedEvents] = useState("");
  const [linkedFactions, setLinkedFactions] = useState("");

  useEffect(() => {
    if (label) {
      setDraft({
        title: label.title,
        description: label.description,
        x: label.x,
        y: label.y,
        type: label.type,
        visibility: label.visibility,
        icon: label.icon,
        region: label.region,
        tags: label.tags,
        linkedDungeons: label.linkedDungeons,
        linkedNpcs: label.linkedNpcs,
        linkedEvents: label.linkedEvents,
        linkedFactions: label.linkedFactions,
        notes: label.notes
      });
      setTags(label.tags.join(", "));
      setLinkedDungeons(label.linkedDungeons.join(", "));
      setLinkedNpcs(label.linkedNpcs.join(", "));
      setLinkedEvents(label.linkedEvents.join(", "));
      setLinkedFactions(label.linkedFactions.join(", "));
      return;
    }
    setDraft({ ...emptyLabel, x: point?.x ?? 0, y: point?.y ?? 0 });
    setTags("");
    setLinkedDungeons("");
    setLinkedNpcs("");
    setLinkedEvents("");
    setLinkedFactions("");
  }, [label, point, open]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const saved: MapLabel = {
      ...draft,
      id: uuidOrNew(label?.id),
      title: draft.title.trim(),
      description: draft.description.trim(),
      icon: draft.icon?.trim() || draft.title.charAt(0).toUpperCase(),
      tags: parseCsv(tags),
      linkedDungeons: parseCsv(linkedDungeons),
      linkedNpcs: parseCsv(linkedNpcs),
      linkedEvents: parseCsv(linkedEvents),
      linkedFactions: parseCsv(linkedFactions)
    };
    onSave(saved);
    onClose();
  }

  return (
    <Dialog open={open} title={label ? "Edit Label" : "Add Label"} onClose={onClose}>
      <form className="space-y-4" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm font-semibold">
            Title
            <Input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
          </label>
          <label className="block space-y-1 text-sm font-semibold">
            Icon
            <Input maxLength={2} value={draft.icon} onChange={(event) => setDraft({ ...draft, icon: event.target.value })} />
          </label>
        </div>
        <label className="block space-y-1 text-sm font-semibold">
          Description
          <Textarea
            required
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block space-y-1 text-sm font-semibold">
            Type
            <select
              className="h-10 w-full rounded-md border border-ink/15 bg-white/85 px-3 text-sm outline-none focus:border-tide focus:ring-2 focus:ring-tide/20"
              value={draft.type}
              onChange={(event) => setDraft({ ...draft, type: event.target.value as LabelType })}
            >
              {["city", "town", "ruin", "dungeon", "faction", "quest", "npc", "event", "danger", "mystery"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm font-semibold">
            Visibility
            <select
              className="h-10 w-full rounded-md border border-ink/15 bg-white/85 px-3 text-sm outline-none focus:border-tide focus:ring-2 focus:ring-tide/20"
              value={draft.visibility}
              onChange={(event) => setDraft({ ...draft, visibility: event.target.value as LabelVisibility })}
            >
              <option value="public">public</option>
              <option value="hidden">hidden</option>
              <option value="gm_only">gm_only</option>
            </select>
          </label>
          <label className="block space-y-1 text-sm font-semibold">
            Region
            <Input value={draft.region} onChange={(event) => setDraft({ ...draft, region: event.target.value })} />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block space-y-1 text-sm font-semibold">
            X
            <Input
              type="number"
              value={draft.x}
              onChange={(event) => setDraft({ ...draft, x: Number(event.target.value) })}
            />
          </label>
          <label className="block space-y-1 text-sm font-semibold">
            Y
            <Input
              type="number"
              value={draft.y}
              onChange={(event) => setDraft({ ...draft, y: Number(event.target.value) })}
            />
          </label>
          <label className="block space-y-1 text-sm font-semibold">
            Tags
            <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="trade, roads" />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm font-semibold">
            Dungeons
            <Input
              value={linkedDungeons}
              onChange={(event) => setLinkedDungeons(event.target.value)}
              placeholder="Flooded Barrow, Undermountain"
            />
          </label>
          <label className="block space-y-1 text-sm font-semibold">
            Events
            <Input
              value={linkedEvents}
              onChange={(event) => setLinkedEvents(event.target.value)}
              placeholder="Marsh Lights, Dockside Disappearances"
            />
          </label>
          <label className="block space-y-1 text-sm font-semibold">
            NPCs
            <Input
              value={linkedNpcs}
              onChange={(event) => setLinkedNpcs(event.target.value)}
              placeholder="Guard Captain Maelin"
            />
          </label>
          <label className="block space-y-1 text-sm font-semibold">
            Factions
            <Input
              value={linkedFactions}
              onChange={(event) => setLinkedFactions(event.target.value)}
              placeholder="Zhentarim, Harpers"
            />
          </label>
        </div>
        <div className="flex justify-between gap-2">
          {label && onDelete ? (
            <Button type="button" variant="danger" onClick={() => onDelete(label)}>
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Label
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
