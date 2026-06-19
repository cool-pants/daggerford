import { NextResponse } from "next/server";
import { GM_COOKIE, getGMSessionMaxAgeSeconds } from "@/lib/auth";
import { isUuid } from "@/lib/ids";
import { verifyGMCredentials } from "@/lib/supabase-gm";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { uuid?: string; username?: string };
  const uuid = body.uuid?.trim();
  const username = body.username?.trim();

  if (!isUuid(uuid) || !username) {
    return NextResponse.json({ error: "Invalid GM UUID" }, { status: 400 });
  }

  const gm = await verifyGMCredentials(uuid, username);
  if (!gm) {
    return NextResponse.json({ error: "Invalid GM credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, gm: { username: gm.username, displayName: gm.displayName } });
  response.cookies.set(GM_COOKIE, uuid, {
    httpOnly: true,
    maxAge: getGMSessionMaxAgeSeconds(gm.username),
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
  return response;
}
