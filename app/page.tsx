import { AtlasApp } from "@/components/AtlasApp";
import { getCurrentGM } from "@/lib/auth";
import { listLabels } from "@/lib/supabase-labels";

export default async function Home() {
  const gm = await getCurrentGM();
  const initialIsGM = Boolean(gm);
  const initialLabels = await listLabels(initialIsGM);
  return <AtlasApp initialGM={gm} initialIsGM={initialIsGM} initialLabels={initialLabels} />;
}
