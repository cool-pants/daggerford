"use client";

import { DivIcon } from "leaflet";
import { Marker } from "react-leaflet";
import type { MapLabel as MapLabelType } from "@/lib/labels";

type Props = {
  label: MapLabelType;
  onOpen: (label: MapLabelType) => void;
};

export function MapLabel({ label, onOpen }: Props) {
  const icon = new DivIcon({
    className: "",
    html: `<div class="atlas-marker">${label.icon ?? label.title.charAt(0)}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });

  return (
    <Marker
      icon={icon}
      position={[label.y, label.x]}
      eventHandlers={{
        click: () => onOpen(label)
      }}
    />
  );
}
