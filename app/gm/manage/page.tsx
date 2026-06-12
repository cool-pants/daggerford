import Link from "next/link";
import { notFound } from "next/navigation";
import { GMManagementPanel } from "@/components/gm/GMManagementPanel";
import { getCurrentGM } from "@/lib/auth";
import { getGMManagementSnapshot } from "@/lib/supabase-management";

export default async function GMManagePage() {
  const gm = await getCurrentGM();
  if (!gm?.isSuperuser) {
    notFound();
  }

  const snapshot = await getGMManagementSnapshot();

  return (
    <main className="min-h-dvh bg-parchment">
      <div className="border-b border-ink/10 bg-parchment/95 px-4 py-3">
        <Link className="text-sm font-semibold text-tide hover:underline" href="/">
          Back to atlas
        </Link>
      </div>
      <GMManagementPanel initialSnapshot={snapshot} />
    </main>
  );
}
