import { NextResponse } from "next/server";
import { requireSuperuser } from "@/lib/auth";
import { getGMManagementSnapshot } from "@/lib/supabase-management";

export async function GET() {
  try {
    await requireSuperuser();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(await getGMManagementSnapshot());
}
