import { NextResponse } from "next/server";
import { getCurrentGM, requireGM } from "@/lib/auth";
import { uuidOrNew } from "@/lib/ids";
import { listLabels, upsertLabel } from "@/lib/supabase-labels";

export async function GET() {
  const isGM = Boolean(await getCurrentGM());
  return NextResponse.json(await listLabels(isGM));
}

export async function POST(request: Request) {
  let gm;
  try {
    gm = await requireGM();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const label = await request.json();
  try {
    const saved = await upsertLabel({ ...label, id: uuidOrNew(label.id) }, gm.id);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to save label" }, { status: 500 });
  }
}
