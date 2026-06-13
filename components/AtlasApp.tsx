"use client";

import dynamic from "next/dynamic";
import { Menu, PanelLeftOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { LocationDrawer } from "@/components/drawer/LocationDrawer";
import { GMToolbar } from "@/components/gm/GMToolbar";
import { LabelEditorDialog } from "@/components/gm/LabelEditorDialog";
import { LabelSheet } from "@/components/labels/LabelSheet";
import { Button } from "@/components/ui/button";
import { getPublicLabels, searchLabels, type GMNote, type LabelType, type MapLabel } from "@/lib/labels";

const SwordCoastMap = dynamic(() => import("@/components/map/SwordCoastMap").then((mod) => mod.SwordCoastMap), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center bg-ink text-parchment">Loading map...</div>
});

type AtlasAppProps = {
  initialGM: { isSuperuser: boolean } | null;
  initialIsGM: boolean;
  initialLabels: MapLabel[];
};

export function AtlasApp({ initialGM, initialIsGM, initialLabels }: AtlasAppProps) {
  const [labels, setLabels] = useState<MapLabel[]>(initialLabels);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LabelType | "all">("all");
  const [selectedId, setSelectedId] = useState<string>(initialLabels[0]?.id ?? "");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isGM, setIsGM] = useState(initialIsGM);
  const [isSuperuser, setIsSuperuser] = useState(Boolean(initialGM?.isSuperuser));
  const [placementMode, setPlacementMode] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<MapLabel | undefined>();
  const [sheetLabelId, setSheetLabelId] = useState<string | undefined>();
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number } | undefined>();

  const visibleLabels = useMemo(() => (isGM ? labels : getPublicLabels(labels)), [isGM, labels]);
  const filteredLabels = useMemo(() => searchLabels(visibleLabels, query, filter), [visibleLabels, query, filter]);
  const selectedLabel = visibleLabels.find((label) => label.id === selectedId);
  const sheetLabel = visibleLabels.find((label) => label.id === sheetLabelId);

  async function saveLabel(label: MapLabel) {
    const response = await fetch("/api/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(label)
    });
    if (!response.ok) {
      return;
    }
    const saved = (await response.json()) as MapLabel;
    setLabels((current) => {
      const exists = current.some((item) => item.id === saved.id);
      if (exists) {
        return current.map((item) => (item.id === saved.id ? saved : item));
      }
      return [...current, saved];
    });
    setSelectedId(saved.id);
    setSheetLabelId(saved.id);
    setPlacementMode(false);
    setPendingPoint(undefined);
  }

  async function deleteLabel(label: MapLabel) {
    const response = await fetch(`/api/labels/${label.id}`, { method: "DELETE" });
    if (!response.ok) {
      return;
    }
    setLabels((current) => current.filter((item) => item.id !== label.id));
    setSelectedId((current) => (current === label.id ? labels.find((item) => item.id !== label.id)?.id ?? "" : current));
    setSheetLabelId(undefined);
    setEditorOpen(false);
  }

  async function toggleLabelVisibility(label: MapLabel) {
    const nextVisibility = label.visibility === "public" ? "hidden" : "public";
    const updatedLabel: MapLabel = { ...label, visibility: nextVisibility };
    const response = await fetch(`/api/labels/${label.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedLabel)
    });
    if (!response.ok) {
      return;
    }
    const saved = (await response.json()) as MapLabel;
    setLabels((current) => current.map((item) => (item.id === label.id ? saved : item)));
  }

  async function saveNote(note: GMNote) {
    const response = await fetch("/api/gm-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note)
    });
    if (!response.ok) {
      return;
    }
    const saved = (await response.json()) as GMNote;
    setLabels((current) =>
      current.map((label) => (label.id === saved.labelId ? { ...label, notes: [...label.notes, saved] } : label))
    );
  }

  function openEditor(label?: MapLabel, point?: { x: number; y: number }) {
    setEditingLabel(label);
    setPendingPoint(point);
    setEditorOpen(true);
  }

  return (
    <main className="flex h-dvh min-h-[680px] flex-col overflow-hidden">
      <header className="z-[800] flex h-16 shrink-0 items-center justify-between border-b border-ink/10 bg-parchment/95 px-3 shadow-sm backdrop-blur md:px-5">
        <div className="flex items-center gap-3">
          <Button className="hidden md:inline-flex" size="icon" variant="ghost" onClick={() => setDrawerOpen((open) => !open)}>
            {drawerOpen ? <Menu className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </Button>
          <div>
            <h1 className="text-lg font-black leading-tight sm:text-xl">Sword Coast Atlas</h1>
            <p className="hidden text-xs font-semibold uppercase tracking-wide text-ink/55 sm:block">
              Player map and GM campaign layer
            </p>
          </div>
        </div>
        <GMToolbar
          isGM={isGM}
          isSuperuser={isSuperuser}
          placementMode={placementMode}
          onLogout={() => {
            setIsGM(false);
            setIsSuperuser(false);
            setPlacementMode(false);
          }}
          onTogglePlacement={() => setPlacementMode((value) => !value)}
        />
      </header>
      <div className="flex min-h-0 flex-1">
        <LocationDrawer
          filter={filter}
          isOpen={drawerOpen}
          labels={filteredLabels}
          query={query}
          selectedId={selectedId}
          onFilterChange={setFilter}
          onQueryChange={setQuery}
          onSelect={(label) => {
            setSelectedId(label.id);
            setSheetLabelId(label.id);
            setDrawerOpen(false);
          }}
          onToggle={() => setDrawerOpen((open) => !open)}
        />
        <section className="relative min-w-0 flex-1">
          {placementMode ? (
            <div className="absolute left-1/2 top-4 z-[700] -translate-x-1/2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-parchment shadow-atlas">
              Click the map to place a new label
            </div>
          ) : null}
          <SwordCoastMap
            labels={visibleLabels}
            placementMode={placementMode}
            selectedLabel={selectedLabel}
            onOpenLabel={(label) => {
              setSelectedId(label.id);
              setSheetLabelId(label.id);
            }}
            onPlace={(point) => openEditor(undefined, point)}
          />
        </section>
      </div>
      <LabelSheet
        isGM={isGM}
        label={sheetLabel}
        onClose={() => setSheetLabelId(undefined)}
        onEdit={(label) => openEditor(label)}
        onSaveGMNote={saveNote}
        onToggleVisibility={toggleLabelVisibility}
      />
      <LabelEditorDialog
        label={editingLabel}
        open={editorOpen}
        point={pendingPoint}
        onClose={() => {
          setEditorOpen(false);
          setEditingLabel(undefined);
          setPendingPoint(undefined);
        }}
        onDelete={deleteLabel}
        onSave={saveLabel}
      />
    </main>
  );
}
