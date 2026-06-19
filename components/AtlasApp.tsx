"use client";

import dynamic from "next/dynamic";
import { Menu, PanelLeftOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LocationDrawer } from "@/components/drawer/LocationDrawer";
import { BatchDestroyDialog } from "@/components/gm/BatchDestroyDialog";
import { GMToolbar } from "@/components/gm/GMToolbar";
import { LabelEditorDialog } from "@/components/gm/LabelEditorDialog";
import { LabelSheet } from "@/components/labels/LabelSheet";
import { RulerPanel } from "@/components/map/RulerPanel";
import { Button } from "@/components/ui/button";
import { uuidOrNew } from "@/lib/ids";
import {
  PARTIALLY_DESTROYED_TAG,
  getPublicLabels,
  searchLabels,
  type GMNote,
  type LabelType,
  type MapLabel
} from "@/lib/labels";
import { ATLAS_MAPS, DEFAULT_MAP_ID, getAtlasMap, getMapTag, type AtlasMapId, type MapPoint, type MapTagFilter } from "@/lib/map";

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
  const [activeMapId, setActiveMapId] = useState<AtlasMapId>(DEFAULT_MAP_ID);
  const [mapFilter, setMapFilter] = useState<MapTagFilter>(DEFAULT_MAP_ID);
  const [selectedId, setSelectedId] = useState<string>(initialLabels[0]?.id ?? "");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isGM, setIsGM] = useState(initialIsGM);
  const [isSuperuser, setIsSuperuser] = useState(Boolean(initialGM?.isSuperuser));
  const [placementMode, setPlacementMode] = useState(false);
  const [rulerMode, setRulerMode] = useState(false);
  const [rulerPoints, setRulerPoints] = useState<MapPoint[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<MapLabel | undefined>();
  const [sheetLabelId, setSheetLabelId] = useState<string | undefined>();
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number } | undefined>();
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
  const [batchDestroyOpen, setBatchDestroyOpen] = useState(false);
  const [batchSaving, setBatchSaving] = useState(false);

  const activeMap = getAtlasMap(activeMapId);
  const visibleLabels = useMemo(() => (isGM ? labels : getPublicLabels(labels)), [isGM, labels]);
  const activeMapLabels = useMemo(() => {
    const tag = getMapTag(activeMapId);
    return visibleLabels.filter((label) => label.tags.includes(tag));
  }, [activeMapId, visibleLabels]);
  const mapFilteredLabels = useMemo(() => {
    if (mapFilter === "all") {
      return visibleLabels;
    }
    const tag = getMapTag(mapFilter);
    return visibleLabels.filter((label) => label.tags.includes(tag));
  }, [mapFilter, visibleLabels]);
  const filteredLabels = useMemo(() => searchLabels(mapFilteredLabels, query, filter), [mapFilteredLabels, query, filter]);
  const selectedLabel = activeMapLabels.find((label) => label.id === selectedId);
  const sheetLabel = visibleLabels.find((label) => label.id === sheetLabelId);

  async function saveLabel(label: MapLabel) {
    const mapTag = getMapTag(activeMapId);
    const labelWithMapTag: MapLabel = {
      ...label,
      tags: label.tags.includes(mapTag) ? label.tags : [...label.tags, mapTag]
    };
    const response = await fetch("/api/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(labelWithMapTag)
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
    setSelectedLabelIds((current) => current.filter((id) => id !== label.id));
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
    const mapTag = getMapTag(activeMapId);
    const noteWithMapTag: GMNote = {
      ...note,
      tags: note.tags.includes(mapTag) ? note.tags : [...note.tags, mapTag]
    };
    const response = await fetch("/api/gm-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteWithMapTag)
    });
    if (!response.ok) {
      return;
    }
    const saved = (await response.json()) as GMNote;
    setLabels((current) =>
      current.map((label) => (label.id === saved.labelId ? { ...label, notes: [...label.notes, saved] } : label))
    );
  }

  function toggleLabelSelected(labelId: string) {
    setSelectedLabelIds((current) =>
      current.includes(labelId) ? current.filter((id) => id !== labelId) : [...current, labelId]
    );
  }

  async function markSelectedDestroyed(note: { title: string; body: string; partiallyDestroyed: boolean }) {
    if (!selectedLabelIds.length || batchSaving) {
      return;
    }

    setBatchSaving(true);
    const selectedIds = new Set(selectedLabelIds);
    const selectedLabels = labels.filter((label) => selectedIds.has(label.id));
    const mapTag = getMapTag(activeMapId);
    const successfulUpdates: Array<{ id: string; note: GMNote }> = [];

    try {
      for (const label of selectedLabels) {
        const tags = note.partiallyDestroyed
          ? label.tags.includes(PARTIALLY_DESTROYED_TAG)
            ? label.tags
            : [...label.tags, PARTIALLY_DESTROYED_TAG]
          : label.tags.filter((tag) => tag !== PARTIALLY_DESTROYED_TAG);
        const linkedEvents = label.linkedEvents.includes(note.title)
          ? label.linkedEvents
          : [...label.linkedEvents, note.title];
        const updatedLabel: MapLabel = { ...label, destroyed: !note.partiallyDestroyed, tags, linkedEvents };
        const labelResponse = await fetch(`/api/labels/${label.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedLabel)
        });

        if (!labelResponse.ok) {
          continue;
        }

        const eventNote: GMNote = {
          id: uuidOrNew(undefined),
          labelId: label.id,
          noteType: "event",
          title: note.title,
          body: note.body,
          tags: [label.tags.includes(mapTag) ? mapTag : "", note.partiallyDestroyed ? PARTIALLY_DESTROYED_TAG : ""].filter(
            Boolean
          )
        };
        const noteResponse = await fetch("/api/gm-notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventNote)
        });

        if (!noteResponse.ok) {
          continue;
        }

        successfulUpdates.push({ id: label.id, note: (await noteResponse.json()) as GMNote });
      }

      if (successfulUpdates.length) {
        const updates = new Map(successfulUpdates.map((update) => [update.id, update.note]));
        setLabels((current) =>
          current.map((label) => {
            const savedNote = updates.get(label.id);
            if (!savedNote) {
              return label;
            }
            const tags = note.partiallyDestroyed
              ? label.tags.includes(PARTIALLY_DESTROYED_TAG)
                ? label.tags
                : [...label.tags, PARTIALLY_DESTROYED_TAG]
              : label.tags.filter((tag) => tag !== PARTIALLY_DESTROYED_TAG);
            const linkedEvents = label.linkedEvents.includes(note.title)
              ? label.linkedEvents
              : [...label.linkedEvents, note.title];
            return {
              ...label,
              destroyed: !note.partiallyDestroyed,
              tags,
              linkedEvents,
              notes: [...label.notes, savedNote]
            };
          })
        );
        setSelectedLabelIds((current) => current.filter((id) => !updates.has(id)));
      }
    } finally {
      setBatchSaving(false);
      setBatchDestroyOpen(false);
    }
  }

  function openEditor(label?: MapLabel, point?: { x: number; y: number }) {
    setEditingLabel(label);
    setPendingPoint(point);
    setEditorOpen(true);
  }

  function setActiveMap(mapId: AtlasMapId) {
    setActiveMapId(mapId);
    setMapFilter(mapId);
    if (mapId !== "delimbiyr") {
      setRulerMode(false);
      setRulerPoints([]);
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (!editorOpen && !sheetLabelId) {
          setRulerPoints([]);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editorOpen, sheetLabelId]);

  return (
    <main className="flex h-dvh min-h-[680px] flex-col overflow-hidden">
      <header className="z-[800] flex h-16 shrink-0 items-center justify-between border-b border-white/70 bg-white/75 px-3 shadow-sm backdrop-blur-xl md:px-5">
        <div className="flex items-center gap-3">
          <Button className="hidden md:inline-flex" size="icon" variant="ghost" onClick={() => setDrawerOpen((open) => !open)}>
            {drawerOpen ? <Menu className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </Button>
          <div>
            <h1 className="text-lg font-black leading-tight sm:text-xl">Sword Coast Atlas</h1>
            <p className="hidden text-xs font-semibold uppercase tracking-wide text-steel/70 sm:block">
              Player map and GM campaign layer
            </p>
          </div>
        </div>
        <div className="hidden rounded-md border border-white/70 bg-white/70 p-1 shadow-sm backdrop-blur-xl md:flex">
          {ATLAS_MAPS.map((map) => (
            <button
              key={map.id}
              className={`h-9 rounded px-3 text-sm font-bold transition ${
                activeMapId === map.id ? "bg-tide text-white shadow-sm" : "text-ink/75 hover:bg-white hover:text-ink"
              }`}
              suppressHydrationWarning
              type="button"
              onClick={() => {
                setActiveMap(map.id);
              }}
            >
              {map.label}
            </button>
          ))}
        </div>
        <GMToolbar
          isGM={isGM}
          isSuperuser={isSuperuser}
          placementMode={placementMode}
          onLogout={() => {
            setIsGM(false);
            setIsSuperuser(false);
            setPlacementMode(false);
            setRulerMode(false);
          }}
          onTogglePlacement={() => setPlacementMode((value) => !value)}
          onBeforePlacement={() => setRulerMode(false)}
        />
      </header>
      <div className="flex min-h-0 flex-1">
        <LocationDrawer
          filter={filter}
          isGM={isGM}
          isOpen={drawerOpen}
          labels={filteredLabels}
          mapFilter={mapFilter}
          query={query}
          selectedId={selectedId}
          selectedLabelIds={selectedLabelIds}
          onClearSelectedLabels={() => setSelectedLabelIds([])}
          onFilterChange={setFilter}
          onMapFilterChange={setMapFilter}
          onOpenBatchDestroy={() => setBatchDestroyOpen(true)}
          onQueryChange={setQuery}
          onSelect={(label) => {
            setSelectedId(label.id);
            setSheetLabelId(label.id);
            setDrawerOpen(false);
          }}
          onSelectAllLabels={() => setSelectedLabelIds(filteredLabels.map((label) => label.id))}
          onToggleLabelSelected={toggleLabelSelected}
          onToggle={() => setDrawerOpen((open) => !open)}
        />
        <section className="relative min-w-0 flex-1">
          {activeMapId === "delimbiyr" ? (
            <Button
              className="absolute right-4 top-4 z-[710] shadow-atlas"
              variant={rulerMode ? "primary" : "secondary"}
              onClick={() => {
                setPlacementMode(false);
                setRulerMode((active) => !active);
              }}
            >
              Ruler
            </Button>
          ) : null}
          {placementMode ? (
            <div className="absolute left-1/2 top-4 z-[700] -translate-x-1/2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-parchment shadow-atlas">
              Click the map to place a new label
            </div>
          ) : null}
          {rulerMode ? (
            <div className="absolute left-1/2 top-4 z-[700] -translate-x-1/2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-parchment shadow-atlas">
              Click map points to measure. Press Esc to clear.
            </div>
          ) : null}
          <SwordCoastMap
            atlasMap={activeMap}
            labels={activeMapLabels}
            placementMode={placementMode}
            rulerMode={rulerMode}
            rulerPoints={rulerPoints}
            selectedLabel={selectedLabel}
            onOpenLabel={(label) => {
              setSelectedId(label.id);
              setSheetLabelId(label.id);
            }}
            onPlace={(point) => openEditor(undefined, point)}
            onRulerPoint={(point) => setRulerPoints((points) => [...points, point])}
          />
          {activeMapId === "delimbiyr" ? (
            <RulerPanel
              active={rulerMode}
              points={rulerPoints}
              onClear={() => setRulerPoints([])}
              onClose={() => {
                setRulerMode(false);
                setRulerPoints([]);
              }}
            />
          ) : null}
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
      <BatchDestroyDialog
        count={selectedLabelIds.length}
        open={batchDestroyOpen}
        saving={batchSaving}
        onClose={() => {
          if (!batchSaving) {
            setBatchDestroyOpen(false);
          }
        }}
        onSave={markSelectedDestroyed}
      />
    </main>
  );
}
