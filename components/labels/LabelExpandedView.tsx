import { Castle, Flag, ScrollText, Skull, Users } from "lucide-react";
import { GMNotesPanel } from "@/components/gm/GMNotesPanel";
import type { GMNote, MapLabel } from "@/lib/labels";

type Props = {
  label: MapLabel;
  showGMNotes?: boolean;
  compact?: boolean;
  onSaveGMNote?: (note: GMNote) => void;
};

const relationGroups = [
  {
    key: "linkedDungeons",
    title: "Dungeons",
    icon: Castle
  },
  {
    key: "linkedEvents",
    title: "Events",
    icon: ScrollText
  },
  {
    key: "linkedNpcs",
    title: "NPCs",
    icon: Users
  },
  {
    key: "linkedFactions",
    title: "Factions",
    icon: Flag
  }
] as const;

export function LabelExpandedView({ label, showGMNotes = false, compact = false, onSaveGMNote }: Props) {
  return (
    <div className={compact ? "space-y-3" : "space-y-6"}>
      {label.destroyed ? (
        <section className="rounded-md border border-flower/20 bg-flower/10 px-3 py-2 text-sm font-bold text-flower">
          Destroyed
        </section>
      ) : null}

      <section>
        <h2 className={compact ? "sr-only" : "text-sm font-bold uppercase tracking-wide text-ink/50"}>
          Public Description
        </h2>
        <p className={compact ? "text-sm leading-5 text-ink/75" : "mt-2 text-lg leading-8 text-ink/80"}>
          {label.description}
        </p>
      </section>

      <section>
        <h2 className={compact ? "text-xs font-bold uppercase tracking-wide text-ink/50" : "text-sm font-bold uppercase tracking-wide text-ink/50"}>
          Connections
        </h2>
        <div className={compact ? "mt-2 grid gap-2" : "mt-3 grid gap-3 sm:grid-cols-2"}>
          {relationGroups.map(({ key, title, icon: Icon }) => {
            const values = label[key];
            return (
              <div key={key} className="rounded-md border border-white/70 bg-white/70 p-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-copper">
                  <Icon className="h-4 w-4" />
                  {title}
                </div>
                {values.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {values.map((value) => (
                      <span key={value} className="rounded-full bg-meadow/15 px-2 py-1 text-xs font-semibold text-moss">
                        {value}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-ink/50">None linked.</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {label.tags.length ? (
        <section>
          <h2 className={compact ? "text-xs font-bold uppercase tracking-wide text-ink/50" : "text-sm font-bold uppercase tracking-wide text-ink/50"}>
            Tags
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {label.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-sky/15 px-3 py-1 text-xs font-semibold text-tide">
                {tag}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {showGMNotes ? (
        <section>
          <div className="flex items-center gap-2">
            <Skull className="h-4 w-4 text-copper" />
            <h2 className={compact ? "text-xs font-bold uppercase tracking-wide text-ink/50" : "text-xl font-black"}>
              GM Notes
            </h2>
          </div>
          <div className="mt-3">
            <GMNotesPanel notes={label.notes} compact={compact} labelId={label.id} onSaveNote={onSaveGMNote} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
