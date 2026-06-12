import { NextResponse } from "next/server";
import { getCurrentGM, requireGM } from "@/lib/auth";
import { deleteLabel, getLabelById, upsertLabel } from "@/lib/supabase-labels";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  const isGM = Boolean(await getCurrentGM());
  const label = await getLabelById(id, isGM);
  if (!label) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(label);
}

export async function PATCH(request: Request, context: Context) {
  let gm;
  try {
    gm = await requireGM();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const patch = await request.json();
  try {
    const saved = await upsertLabel({ ...patch, id }, gm.id);
    return NextResponse.json(saved);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to save label" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    await requireGM();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    await deleteLabel(id);
    return NextResponse.json({ deleted: id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to delete label" }, { status: 500 });
  }
}
