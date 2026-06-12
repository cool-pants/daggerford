import { getSupabaseHeaders, getSupabaseRestUrl } from "@/lib/db";

export type GMUser = {
  id: string;
  username: string;
  displayName: string;
  isSuperuser: boolean;
};

type GMRow = {
  id: string;
  username: string | null;
  display_name: string;
  is_superuser: boolean | null;
  is_active?: boolean;
  created_at?: string;
};

function gmRequest(path: string) {
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

function mapGM(row: GMRow): GMUser {
  return {
    id: row.id,
    username: row.username ?? row.display_name,
    displayName: row.display_name,
    isSuperuser: Boolean(row.is_superuser)
  };
}

function toGMRow(gm: { id: string; username: string; displayName: string; isSuperuser: boolean }) {
  return {
    id: gm.id,
    username: gm.username,
    display_name: gm.displayName,
    is_superuser: gm.isSuperuser,
    is_active: true
  };
}

export async function verifyGMCredentials(id: string, username: string) {
  const normalizedUsername = username.trim();
  const request = gmRequest(
    `gm_keys?select=id,username,display_name,is_superuser&id=eq.${encodeURIComponent(id)}&username=eq.${encodeURIComponent(
      normalizedUsername
    )}&is_active=eq.true&limit=1`
  );

  if (!request) {
    return null;
  }

  const response = await request;
  if (!response.ok) {
    return null;
  }

  const rows = (await response.json()) as GMRow[];
  return rows[0] ? mapGM(rows[0]) : null;
}

export async function verifyGMById(id: string) {
  const request = gmRequest(
    `gm_keys?select=id,username,display_name,is_superuser&id=eq.${encodeURIComponent(id)}&is_active=eq.true&limit=1`
  );

  if (!request) {
    return null;
  }

  const response = await request;
  if (!response.ok) {
    return null;
  }

  const rows = (await response.json()) as GMRow[];
  return rows[0] ? mapGM(rows[0]) : null;
}

export async function listGMs() {
  const request = gmRequest("gm_keys?select=id,username,display_name,is_superuser,is_active,created_at&order=username.asc");

  if (!request) {
    return [];
  }

  const response = await request;
  if (!response.ok) {
    return [];
  }

  const rows = (await response.json()) as GMRow[];
  return rows.map((row) => ({
    ...mapGM(row),
    isActive: Boolean(row.is_active),
    createdAt: row.created_at ?? null
  }));
}

export async function createGM(gm: { id: string; username: string; displayName: string; isSuperuser: boolean }) {
  const url = getSupabaseRestUrl("gm_keys");
  const headers = getSupabaseHeaders("return=representation");

  if (!url || !headers) {
    throw new Error("Supabase is not configured");
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(toGMRow(gm)),
    cache: "no-store"
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail ? `Unable to create GM: ${detail}` : "Unable to create GM");
  }

  const rows = (await response.json()) as GMRow[];
  return rows[0] ? mapGM(rows[0]) : gm;
}
