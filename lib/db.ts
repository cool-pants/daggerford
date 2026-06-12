const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function getDatabaseStatus() {
  return {
    provider: "Supabase Postgres",
    configured: Boolean(supabaseUrl && supabaseKey)
  };
}

export function getSupabaseRestUrl(path: string) {
  if (!supabaseUrl) {
    return null;
  }
  return `${supabaseUrl.replace(/\/$/, "")}/rest/v1/${path.replace(/^\//, "")}`;
}

export function getSupabaseHeaders(prefer?: string) {
  if (!supabaseKey) {
    return null;
  }

  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
    ...(prefer ? { Prefer: prefer } : {})
  };
}
