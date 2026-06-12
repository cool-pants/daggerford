import { NextResponse } from "next/server";
import { requireGM } from "@/lib/auth";
import { uuidOrNew } from "@/lib/ids";
import { createGMNote } from "@/lib/supabase-labels";

export async function POST(request: Request) {
  let gm;
  try {
    gm = await requireGM();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const note = await request.json();
  try {
    const saved = await createGMNote({ ...note, id: uuidOrNew(note.id) }, gm.id);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to save GM note" }, { status: 500 });
  }
}
