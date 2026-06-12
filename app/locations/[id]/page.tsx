import Link from "next/link";
import { notFound } from "next/navigation";
import { LabelExpandedView } from "@/components/labels/LabelExpandedView";
import { getCurrentGM } from "@/lib/auth";
import { getLabelById } from "@/lib/supabase-labels";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LocationDetailPage({ params }: Props) {
  const { id } = await params;
  const isGM = Boolean(await getCurrentGM());
  const label = await getLabelById(id, isGM);

  if (!label) {
    notFound();
  }

  return (
    <main className="min-h-dvh bg-parchment px-4 py-8">
      <article className="mx-auto max-w-3xl">
        <Link className="text-sm font-semibold text-tide hover:underline" href="/">
          Back to atlas
        </Link>
        <div className="mt-6 rounded-lg border border-ink/10 bg-white/70 p-6 shadow-atlas">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-black">{label.title}</h1>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-ink/50">{label.region}</p>
            </div>
            <span className="rounded-full bg-tide/10 px-3 py-1 text-sm font-bold capitalize text-tide">{label.type}</span>
          </div>
          <div className="mt-6">
            <LabelExpandedView label={label} showGMNotes={isGM} />
          </div>
        </div>
      </article>
    </main>
  );
}
