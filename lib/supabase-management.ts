import { getSupabaseHeaders, getSupabaseRestUrl } from "@/lib/db";

type GMRow = {
  id: string;
  username: string | null;
  display_name: string;
  is_superuser: boolean;
  is_active: boolean;
};

type LabelRow = {
  id: string;
  title: string;
  type: string;
  linked_npcs?: string[] | null;
  linked_events?: string[] | null;
  created_by?: string | null;
};

type NoteRow = {
  id: string;
  label_id: string;
  note_type: string;
  title: string;
  body: string;
  created_by?: string | null;
  created_at: string;
};

function managementRequest(path: string) {
  const url = getSupabaseRestUrl(path);
  const headers = getSupabaseHeaders();

  if (!url || !headers) {
    return null;
  }

  return fetch(url, {
    headers,
    cache: "no-store"
  });
}

async function getRows<T>(path: string): Promise<T[]> {
  const request = managementRequest(path);
  if (!request) {
    return [];
  }

  const response = await request;
  if (!response.ok) {
    return [];
  }

  return response.json() as Promise<T[]>;
}

export async function getGMManagementSnapshot() {
  const [gms, labels, notes] = await Promise.all([
    getRows<GMRow>("gm_keys?select=id,username,display_name,is_superuser,is_active&order=username.asc"),
    getRows<LabelRow>("labels?select=id,title,type,linked_npcs,linked_events,created_by&order=title.asc"),
    getRows<NoteRow>("gm_notes?select=id,label_id,note_type,title,body,created_by,created_at&order=created_at.desc")
  ]);

  const gmNames = new Map(gms.map((gm) => [gm.id, gm.username ?? gm.display_name]));
  const labelNames = new Map(labels.map((label) => [label.id, label.title]));

  return {
    gms: gms.map((gm) => ({
      id: gm.id,
      username: gm.username ?? gm.display_name,
      displayName: gm.display_name,
      isSuperuser: gm.is_superuser,
      isActive: gm.is_active
    })),
    notes: notes.map((note) => ({
      id: note.id,
      type: note.note_type,
      title: note.title,
      body: note.body,
      label: labelNames.get(note.label_id) ?? "Unknown label",
      author: note.created_by ? gmNames.get(note.created_by) ?? "Unknown GM" : "Unassigned",
      createdAt: note.created_at
    })),
    npcs: labels.flatMap((label) =>
      (label.linked_npcs ?? []).map((name) => ({
        name,
        label: label.title,
        author: label.created_by ? gmNames.get(label.created_by) ?? "Unknown GM" : "Unassigned"
      }))
    ),
    events: labels.flatMap((label) =>
      (label.linked_events ?? []).map((name) => ({
        name,
        label: label.title,
        author: label.created_by ? gmNames.get(label.created_by) ?? "Unknown GM" : "Unassigned"
      }))
    )
  };
}
