export type LabelType =
  | "city"
  | "town"
  | "ruin"
  | "dungeon"
  | "faction"
  | "quest"
  | "npc"
  | "event"
  | "danger"
  | "mystery";

export type LabelVisibility = "public" | "hidden" | "gm_only";

export type GMNote = {
  id: string;
  labelId: string;
  noteType: "npc" | "location" | "event" | "secret" | "quest_hook" | "faction" | "loot" | "encounter";
  title: string;
  body: string;
  tags: string[];
  createdBy?: string;
};

export type MapLabel = {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  type: LabelType;
  visibility: LabelVisibility;
  icon?: string;
  region?: string;
  tags: string[];
  linkedDungeons: string[];
  linkedNpcs: string[];
  linkedEvents: string[];
  linkedFactions: string[];
  createdBy?: string;
  notes: GMNote[];
};

export const labelTypes: Array<{ value: LabelType | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "city", label: "Cities" },
  { value: "dungeon", label: "Dungeons" },
  { value: "npc", label: "NPCs" },
  { value: "event", label: "Events" },
  { value: "faction", label: "Factions" }
];

export const sampleLabels: MapLabel[] = [
  {
    id: "daggerford",
    title: "Daggerford",
    description: "A battered trade town rebuilding after devastation along the Delimbiyr route.",
    x: 760,
    y: 640,
    type: "town",
    visibility: "public",
    icon: "D",
    region: "Delimbiyr Vale",
    tags: ["trade", "rebuilding", "roads"],
    linkedDungeons: ["Flooded Barrow", "Old Laughing Hollow Cellar"],
    linkedNpcs: ["Guard Captain Maelin", "Duchess Morwen"],
    linkedEvents: ["Zhent Supply Scheme"],
    linkedFactions: ["Zhentarim", "Daggerford Council"],
    notes: [
      {
        id: "note-daggerford-captain",
        labelId: "daggerford",
        noteType: "npc",
        title: "Guard Captain Maelin",
        body: "Wants adventurers to stabilize the roads before winter caravans arrive.",
        tags: ["#delimbiyr"]
      },
      {
        id: "note-daggerford-secret",
        labelId: "daggerford",
        noteType: "secret",
        title: "Unsettling Court Rumor",
        body: "Several councilors insist the Duchess has changed since the last dragon raid.",
        tags: ["#delimbiyr"]
      }
    ]
  },
  {
    id: "waterdeep",
    title: "Waterdeep",
    description: "The City of Splendors, loud with intrigue, trade, masked lords, and dangerous favors.",
    x: 735,
    y: 502,
    type: "city",
    visibility: "public",
    icon: "W",
    region: "Sword Coast North",
    tags: ["city", "politics", "guilds"],
    linkedDungeons: ["Undermountain", "Vault of Dragons"],
    linkedNpcs: ["Open Lord Laeral"],
    linkedEvents: ["Masked Lord Vote"],
    linkedFactions: ["Masked Lords", "Harpers", "Xanathar Guild"],
    notes: []
  },
  {
    id: "neverwinter",
    title: "Neverwinter",
    description: "A northern city of warm river mist, ambitious reconstruction, and old scars.",
    x: 690,
    y: 332,
    type: "city",
    visibility: "public",
    icon: "N",
    region: "Sword Coast North",
    tags: ["city", "reconstruction", "north"],
    linkedDungeons: ["Chasm District Ruins"],
    linkedNpcs: ["Lord Neverember"],
    linkedEvents: ["Ashmarket Unrest"],
    linkedFactions: ["Neverwinter Guard", "Ashmadai Remnants"],
    notes: []
  },
  {
    id: "baldurs-gate",
    title: "Baldur's Gate",
    description: "A hard-edged harbor city where coin, blood, and law all bargain at the same table.",
    x: 765,
    y: 815,
    type: "city",
    visibility: "public",
    icon: "B",
    region: "Western Heartlands",
    tags: ["harbor", "mercantile", "danger"],
    linkedDungeons: ["Sewer Warrens", "Vanthampur Cellars"],
    linkedNpcs: ["Flaming Fist Marshal"],
    linkedEvents: ["Dockside Disappearances"],
    linkedFactions: ["Flaming Fist", "Guild"],
    notes: []
  },
  {
    id: "lizard-marsh",
    title: "Lizard Marsh",
    description: "A wetland of sinking paths, black water, and strange necromantic activity.",
    x: 705,
    y: 665,
    type: "danger",
    visibility: "public",
    icon: "L",
    region: "Delimbiyr Vale",
    tags: ["marsh", "undead", "hazard"],
    linkedDungeons: ["Flooded Barrow", "Sunken Lizardfolk Shrine"],
    linkedNpcs: ["The Bone-Talker"],
    linkedEvents: ["Marsh Lights"],
    linkedFactions: ["Blackscale Survivors"],
    notes: [
      {
        id: "note-lizard-marsh-encounter",
        labelId: "lizard-marsh",
        noteType: "encounter",
        title: "Marsh Lights",
        body: "The lights are corpse-candles marking the route to a flooded barrow.",
        tags: ["#delimbiyr"]
      }
    ]
  }
];

export function getPublicLabels(labels: MapLabel[]) {
  return labels.filter((label) => label.visibility === "public");
}

export function searchLabels(labels: MapLabel[], query: string, type: LabelType | "all") {
  const normalized = query.trim().toLowerCase();
  return labels.filter((label) => {
    const typeMatches = type === "all" || label.type === type;
    if (!typeMatches) {
      return false;
    }
    if (!normalized) {
      return true;
    }
    const haystack = [
      label.title,
      label.description,
      label.region,
      label.type,
      ...label.tags,
      ...label.linkedDungeons,
      ...label.linkedNpcs,
      ...label.linkedEvents,
      ...label.linkedFactions
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export function findLabel(id: string) {
  return sampleLabels.find((label) => label.id === id);
}
