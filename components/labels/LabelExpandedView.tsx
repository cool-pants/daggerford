import { Castle, Flag, ScrollText, Skull, Users } from "lucide-react";
import { GMNotesPanel } from "@/components/gm/GMNotesPanel";
import type { MapLabel } from "@/lib/labels";

type Props = {
  label: MapLabel;
  showGMNotes?: boolean;
  compact?: boolean;
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

export function LabelExpandedView({ label, showGMNotes = false, compact = false }: Props) {
  return (
    <div className={compact ? "space-y-3" : "space-y-6"}>
      <section>
        <h2 className={compact ? "sr-only" : "text-sm font-bold uppercase tracking-wide text-ink/55"}>
          Public Description
        </h2>
        <p className={compact ? "text-sm leading-5 text-ink/75" : "mt-2 text-lg leading-8 text-ink/80"}>
          {label.description}
        </p>
      </section>

      <section>
        <h2 className={compact ? "text-xs font-bold uppercase tracking-wide text-ink/55" : "text-sm font-bold uppercase tracking-wide text-ink/55"}>
          Connections
        </h2>
        <div className={compact ? "mt-2 grid gap-2" : "mt-3 grid gap-3 sm:grid-cols-2"}>
          {relationGroups.map(({ key, title, icon: Icon }) => {
            const values = label[key];
            return (
              <div key={key} className="rounded-md border border-ink/10 bg-white/65 p-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-copper">
                  <Icon className="h-4 w-4" />
                  {title}
                </div>
                {values.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {values.map((value) => (
                      <span key={value} className="rounded-full bg-moss/12 px-2 py-1 text-xs font-semibold text-moss">
                        {value}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-ink/55">None linked.</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {label.tags.length ? (
        <section>
          <h2 className={compact ? "text-xs font-bold uppercase tracking-wide text-ink/55" : "text-sm font-bold uppercase tracking-wide text-ink/55"}>
            Tags
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {label.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-tide/10 px-3 py-1 text-xs font-semibold text-tide">
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
            <h2 className={compact ? "text-xs font-bold uppercase tracking-wide text-ink/55" : "text-xl font-black"}>
              GM Notes
            </h2>
          </div>
          <div className="mt-3">
            <GMNotesPanel notes={label.notes} compact={compact} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
