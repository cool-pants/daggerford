import { cookies } from "next/headers";
import { isUuid } from "@/lib/ids";
import { verifyGMById } from "@/lib/supabase-gm";

export const GM_COOKIE = "gm_session";
export const GM_SESSION_MAX_AGE_SECONDS = 60 * 60;

export async function getGMSession() {
  const cookieStore = await cookies();
  return cookieStore.get(GM_COOKIE)?.value ?? null;
}

export async function requireGM() {
  const gm = await getCurrentGM();
  if (!gm) {
    throw new Error("Unauthorized");
  }
  return gm;
}

export async function requireSuperuser() {
  const gm = await requireGM();
  if (!gm.isSuperuser) {
    throw new Error("Forbidden");
  }
  return gm;
}

export async function getCurrentGM() {
  const session = await getGMSession();
  if (!isUuid(session)) {
    return null;
  }

  return verifyGMById(session);
}
