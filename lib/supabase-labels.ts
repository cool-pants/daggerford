import { getDatabaseStatus, getSupabaseHeaders, getSupabaseRestUrl } from "@/lib/db";
import { getPublicLabels, sampleLabels, type GMNote, type MapLabel } from "@/lib/labels";

type LabelRow = {
  id: string;
  title: string;
  description: string;
  x: string | number;
  y: string | number;
  type: MapLabel["type"];
  visibility: MapLabel["visibility"];
  destroyed?: boolean | null;
  icon?: string | null;
  region?: string | null;
  tags?: string[] | null;
  linked_dungeons?: string[] | null;
  linked_npcs?: string[] | null;
  linked_events?: string[] | null;
  linked_factions?: string[] | null;
  created_by?: string | null;
  gm_notes?: NoteRow[] | null;
};

type NoteRow = {
  id: string;
  label_id: string;
  note_type: GMNote["noteType"];
  title: string;
  body: string;
  tags?: string[] | null;
  created_by?: string | null;
};

function configuredRequest(path: string, init?: RequestInit) {
  const url = getSupabaseRestUrl(path);
  const headers = getSupabaseHeaders(init?.method && init.method !== "GET" ? "return=representation" : undefined);

  if (!url || !headers) {
    return null;
  }

  return fetch(url, {
    ...init,
    headers: {
      ...headers,
      ...init?.headers
    },
    cache: "no-store"
  });
}

function mapNote(row: NoteRow): GMNote {
  return {
    id: row.id,
    labelId: row.label_id,
    noteType: row.note_type,
    title: row.title,
    body: row.body,
    tags: row.tags ?? [],
    createdBy: row.created_by ?? undefined
  };
}

function mapLabel(row: LabelRow): MapLabel {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    x: Number(row.x),
    y: Number(row.y),
    type: row.type,
    visibility: row.visibility,
    destroyed: Boolean(row.destroyed),
    icon: row.icon ?? undefined,
    region: row.region ?? undefined,
    tags: row.tags ?? [],
    linkedDungeons: row.linked_dungeons ?? [],
    linkedNpcs: row.linked_npcs ?? [],
    linkedEvents: row.linked_events ?? [],
    linkedFactions: row.linked_factions ?? [],
    createdBy: row.created_by ?? undefined,
    notes: row.gm_notes?.map(mapNote) ?? []
  };
}

function toLabelRow(label: MapLabel, createdBy?: string) {
  return {
    id: label.id,
    title: label.title,
    description: label.description,
    x: label.x,
    y: label.y,
    type: label.type,
    visibility: label.visibility,
    destroyed: label.destroyed,
    icon: label.icon,
    region: label.region,
    tags: label.tags,
    linked_dungeons: label.linkedDungeons,
    linked_npcs: label.linkedNpcs,
    linked_events: label.linkedEvents,
    linked_factions: label.linkedFactions,
    created_by: createdBy ?? label.createdBy
  };
}

function toNoteRow(note: GMNote, createdBy?: string) {
  return {
    id: note.id,
    label_id: note.labelId,
    note_type: note.noteType,
    title: note.title,
    body: note.body,
    tags: note.tags,
    created_by: createdBy ?? note.createdBy
  };
}

async function throwSupabaseError(response: Response, message: string): Promise<never> {
  const detail = await response.text().catch(() => "");
  throw new Error(detail ? `${message}: ${detail}` : message);
}

export async function listLabels(isGM: boolean) {
  const fallbackLabels = getDatabaseStatus().configured ? [] : isGM ? sampleLabels : getPublicLabels(sampleLabels);
  const visibilityFilter = isGM ? "" : "&visibility=eq.public";
  const request = configuredRequest(
    `labels?select=*,gm_notes(*)&order=title.asc${visibilityFilter}`
  );

  if (!request) {
    return fallbackLabels;
  }

  try {
    const response = await request;
    if (!response.ok) {
      return fallbackLabels;
    }
    const rows = (await response.json()) as LabelRow[];
    return rows.map(mapLabel);
  } catch {
    return fallbackLabels;
  }
}

export async function getLabelById(id: string, isGM: boolean) {
  const allowSampleFallback = !getDatabaseStatus().configured;
  const visibilityFilter = isGM ? "" : "&visibility=eq.public";
  const request = configuredRequest(
    `labels?select=*,gm_notes(*)&id=eq.${encodeURIComponent(id)}${visibilityFilter}&limit=1`
  );

  if (!request) {
    const label = sampleLabels.find((item) => item.id === id);
    return allowSampleFallback && label && (isGM || label.visibility === "public") ? label : null;
  }

  try {
    const response = await request;
    if (!response.ok) {
      const label = sampleLabels.find((item) => item.id === id);
      return allowSampleFallback && label && (isGM || label.visibility === "public") ? label : null;
    }
    const rows = (await response.json()) as LabelRow[];
    return rows[0] ? mapLabel(rows[0]) : null;
  } catch {
    const label = sampleLabels.find((item) => item.id === id);
    return allowSampleFallback && label && (isGM || label.visibility === "public") ? label : null;
  }
}

export async function upsertLabel(label: MapLabel, createdBy?: string) {
  const request = configuredRequest("labels?on_conflict=id", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify(toLabelRow(label, createdBy))
  });

  if (!request) {
    return label;
  }

  const response = await request;
  if (!response.ok) {
    await throwSupabaseError(response, "Unable to save label");
  }
  const rows = (await response.json()) as LabelRow[];
  return rows[0] ? mapLabel(rows[0]) : label;
}

export async function deleteLabel(id: string) {
  const request = configuredRequest(`labels?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE"
  });

  if (!request) {
    return;
  }

  const response = await request;
  if (!response.ok) {
    await throwSupabaseError(response, "Unable to delete label");
  }
}

export async function createGMNote(note: GMNote, createdBy?: string) {
  const request = configuredRequest("gm_notes", {
    method: "POST",
    body: JSON.stringify(toNoteRow(note, createdBy))
  });

  if (!request) {
    return note;
  }

  const response = await request;
  if (!response.ok) {
    await throwSupabaseError(response, "Unable to save GM note");
  }
  const rows = (await response.json()) as NoteRow[];
  return rows[0] ? mapNote(rows[0]) : note;
}
