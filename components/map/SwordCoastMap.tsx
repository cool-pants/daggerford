"use client";

import { CRS, type Map as LeafletMap } from "leaflet";
import { useEffect, useRef } from "react";
import { ImageOverlay, MapContainer, useMap } from "react-leaflet";
import { MapClickHandler } from "@/components/map/MapClickHandler";
import { MapLabel } from "@/components/map/MapLabel";
import type { MapLabel as MapLabelType } from "@/lib/labels";
import { MAP_BOUNDS, MAP_IMAGE_URL } from "@/lib/map";

type Props = {
  labels: MapLabelType[];
  selectedLabel?: MapLabelType;
  placementMode: boolean;
  onPlace: (point: { x: number; y: number }) => void;
  onOpenLabel: (label: MapLabelType) => void;
};

function MapFocus({ label }: { label?: MapLabelType }) {
  const map = useMap();

  useEffect(() => {
    if (!label) {
      return;
    }
    map.setView([label.y, label.x], Math.max(map.getZoom(), 0), { animate: true });
  }, [label, map]);

  return null;
}

export function SwordCoastMap({
  labels,
  selectedLabel,
  placementMode,
  onPlace,
  onOpenLabel
}: Props) {
  const mapRef = useRef<LeafletMap | null>(null);

  return (
    <div className={`h-full min-h-0 ${placementMode ? "cursor-crosshair" : ""}`}>
      <MapContainer
        ref={mapRef}
        bounds={MAP_BOUNDS}
        className="h-full w-full"
        crs={CRS.Simple}
        maxBounds={MAP_BOUNDS}
        maxBoundsViscosity={0.85}
        maxZoom={3}
        minZoom={-2}
        scrollWheelZoom
      >
        <ImageOverlay bounds={MAP_BOUNDS} url={MAP_IMAGE_URL} />
        <MapClickHandler enabled={placementMode} onPlace={onPlace} />
        <MapFocus label={selectedLabel} />
        {labels.map((label) => (
          <MapLabel
            key={label.id}
            label={label}
            onOpen={onOpenLabel}
          />
        ))}
      </MapContainer>
    </div>
  );
}
