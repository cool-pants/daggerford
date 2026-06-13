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
  isOpen: boolean;
  onToggle: () => void;
  onQueryChange: (query: string) => void;
  onFilterChange: (type: LabelType | "all") => void;
  onMapFilterChange: (filter: MapTagFilter) => void;
  onSelect: (label: MapLabel) => void;
};

export function LocationDrawer({
  labels,
  query,
  filter,
  mapFilter,
  selectedId,
  isOpen,
  onToggle,
  onQueryChange,
  onFilterChange,
  onMapFilterChange,
  onSelect
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
        className={`z-[850] border-white/70 bg-white/75 shadow-atlas backdrop-blur-xl transition md:static md:block md:h-full md:w-80 md:border-r md:shadow-none ${
          isOpen
            ? "fixed inset-x-3 bottom-3 max-h-[72vh] overflow-auto rounded-lg border p-4"
            : "hidden"
        }`}
      >
        <div className="hidden items-center justify-between border-b border-ink/10 px-4 py-3 md:flex">
          <h1 className="text-lg font-black">Sword Coast Atlas</h1>
          <Button aria-label="Collapse drawer" size="icon" variant="ghost" onClick={onToggle}>
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-4 md:p-4">
          <MapTagPills value={mapFilter} onChange={onMapFilterChange} />
          <LocationSearch value={query} onChange={onQueryChange} />
          <LocationFilters value={filter} onChange={onFilterChange} />
          <LocationList labels={labels} selectedId={selectedId} onSelect={onSelect} />
        </div>
      </aside>
    </>
  );
}
