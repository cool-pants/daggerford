import { NextResponse } from "next/server";
import { requireSuperuser } from "@/lib/auth";
import { uuidOrNew } from "@/lib/ids";
import { createGM, listGMs } from "@/lib/supabase-gm";

export async function GET() {
  try {
    await requireSuperuser();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(await listGMs());
}

export async function POST(request: Request) {
  try {
    await requireSuperuser();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    uuid?: string;
    username?: string;
    displayName?: string;
    isSuperuser?: boolean;
  };

  const username = body.username?.trim();
  const displayName = body.displayName?.trim();
  if (!username || !displayName) {
    return NextResponse.json({ error: "Username and display name are required" }, { status: 400 });
  }

  try {
    const gm = await createGM({
      id: uuidOrNew(body.uuid),
      username,
      displayName,
      isSuperuser: Boolean(body.isSuperuser)
    });
    return NextResponse.json(gm, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create GM" }, { status: 500 });
  }
}
