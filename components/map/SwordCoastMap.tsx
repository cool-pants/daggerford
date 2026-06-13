"use client";

import { CRS, type Map as LeafletMap } from "leaflet";
import { useEffect, useRef } from "react";
import { ImageOverlay, MapContainer, useMap } from "react-leaflet";
import { MapClickHandler } from "@/components/map/MapClickHandler";
import { MapLabel } from "@/components/map/MapLabel";
import { RulerLayer } from "@/components/map/RulerLayer";
import type { MapLabel as MapLabelType } from "@/lib/labels";
import type { AtlasMap, MapPoint } from "@/lib/map";

type Props = {
  atlasMap: AtlasMap;
  labels: MapLabelType[];
  selectedLabel?: MapLabelType;
  placementMode: boolean;
  rulerMode: boolean;
  rulerPoints: MapPoint[];
  onPlace: (point: { x: number; y: number }) => void;
  onRulerPoint: (point: MapPoint) => void;
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

function MapBoundsSync({ atlasMap }: { atlasMap: AtlasMap }) {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(atlasMap.bounds);
    map.fitBounds(atlasMap.bounds, { animate: false });
  }, [atlasMap, map]);

  return null;
}

export function SwordCoastMap({
  atlasMap,
  labels,
  selectedLabel,
  placementMode,
  rulerMode,
  rulerPoints,
  onPlace,
  onRulerPoint,
  onOpenLabel
}: Props) {
  const mapRef = useRef<LeafletMap | null>(null);

  return (
    <div className={`h-full min-h-0 ${placementMode || rulerMode ? "cursor-crosshair" : ""}`}>
      <MapContainer
        ref={mapRef}
        bounds={atlasMap.bounds}
        className="h-full w-full"
        crs={CRS.Simple}
        maxBounds={atlasMap.bounds}
        maxBoundsViscosity={0.85}
        maxZoom={3}
        minZoom={-2}
        scrollWheelZoom
      >
        <ImageOverlay key={atlasMap.id} bounds={atlasMap.bounds} url={atlasMap.url} />
        <MapBoundsSync atlasMap={atlasMap} />
        <MapClickHandler enabled={placementMode} onPlace={onPlace} />
        <RulerLayer enabled={rulerMode} points={rulerPoints} onAddPoint={onRulerPoint} />
        <MapFocus label={selectedLabel} />
        {labels.map((label) => (
          <MapLabel
            key={label.id}
            label={label}
            onOpen={(clickedLabel) => {
              if (rulerMode) {
                onRulerPoint({ x: clickedLabel.x, y: clickedLabel.y });
                return;
              }
              onOpenLabel(clickedLabel);
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
