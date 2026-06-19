"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationFilters } from "@/components/drawer/LocationFilters";
import { LocationList } from "@/components/drawer/LocationList";
import { LocationSearch } from "@/components/drawer/LocationSearch";
import { MapTagPills } from "@/components/drawer/MapTagPills";
import type { LabelType, MapLabel } from "@/lib/labels";
import type { MapTagFilter } from "@/lib/map";

type Props = {
  labels: MapLabel[];
  query: string;
  filter: LabelType | "all";
  mapFilter: MapTagFilter;
  selectedId?: string;
  selectedLabelIds: string[];
  isGM: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onQueryChange: (query: string) => void;
  onFilterChange: (type: LabelType | "all") => void;
  onMapFilterChange: (filter: MapTagFilter) => void;
  onSelect: (label: MapLabel) => void;
  onSelectAllLabels: () => void;
  onClearSelectedLabels: () => void;
  onToggleLabelSelected: (labelId: string) => void;
  onOpenBatchDestroy: () => void;
};

export function LocationDrawer({
  labels,
  query,
  filter,
  mapFilter,
  selectedId,
  selectedLabelIds,
  isGM,
  isOpen,
  onToggle,
  onQueryChange,
  onFilterChange,
  onMapFilterChange,
  onSelect,
  onSelectAllLabels,
  onClearSelectedLabels,
  onToggleLabelSelected,
  onOpenBatchDestroy
}: Props) {
  return (
    <>
      <Button
        aria-label="Toggle location drawer"
        className="fixed bottom-4 left-4 z-[900] shadow-atlas md:hidden"
        size="icon"
        variant="primary"
        onClick={onToggle}
      >
        {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
      </Button>
      <aside
        aria-hidden={!isOpen}
        className={`z-[850] border-white/70 bg-white/75 shadow-atlas backdrop-blur-xl transition-[width,opacity] duration-200 md:static md:block md:h-dvh md:shrink-0 md:rounded-none md:shadow-none ${
          isOpen
            ? "fixed bottom-0 left-0 top-16 w-[calc(100vw-3rem)] max-w-[26rem] overflow-hidden border-r md:w-80 md:max-w-none md:border-r"
            : "hidden md:block md:w-0 md:overflow-hidden md:border-r-0 md:opacity-0"
        }`}
      >
        <div className={isOpen ? "flex h-full flex-col" : "md:hidden"}>
          <div className="hidden items-center justify-between border-b border-ink/10 px-4 py-3 md:flex">
            <h1 className="text-lg font-black">Sword Coast Atlas</h1>
            <Button aria-label="Collapse drawer" size="icon" variant="ghost" onClick={onToggle}>
              <PanelLeftClose className="h-5 w-5" />
            </Button>
          </div>
          <div className="shrink-0 space-y-4 border-b border-white/70 bg-white/80 p-4 backdrop-blur-xl">
            <MapTagPills value={mapFilter} onChange={onMapFilterChange} />
            <LocationSearch value={query} onChange={onQueryChange} />
            <LocationFilters value={filter} onChange={onFilterChange} />
            {isGM ? (
              <div className="rounded-md border border-white/70 bg-white/60 p-3 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-ink/50">
                    Selected {selectedLabelIds.length}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={onSelectAllLabels}>
                      All
                    </Button>
                    <Button size="sm" variant="ghost" onClick={onClearSelectedLabels}>
                      Clear
                    </Button>
                  </div>
                </div>
                <Button className="mt-3 w-full" disabled={!selectedLabelIds.length} size="sm" variant="danger" onClick={onOpenBatchDestroy}>
                Mark Destroyed
              </Button>
            </div>
          ) : null}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-28">
            <LocationList
              labels={labels}
              selectedId={selectedId}
              selectedLabelIds={selectedLabelIds}
              showSelection={isGM}
              onSelect={onSelect}
              onToggleSelected={onToggleLabelSelected}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
