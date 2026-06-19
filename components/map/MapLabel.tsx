"use client";

import { DivIcon } from "leaflet";
import { Marker } from "react-leaflet";
import { isPartiallyDestroyed, type MapLabel as MapLabelType } from "@/lib/labels";

type Props = {
  label: MapLabelType;
  onOpen: (label: MapLabelType) => void;
};

export function MapLabel({ label, onOpen }: Props) {
  const isHidden = label.visibility !== "public";
  const isPartial = isPartiallyDestroyed(label);
  const icon = new DivIcon({
    className: "",
    html: `<div class="atlas-marker ${isHidden ? "atlas-marker-hidden" : ""} ${
      label.destroyed ? "atlas-marker-destroyed" : ""
    } ${isPartial ? "atlas-marker-partially-destroyed" : ""
    }"><span>${label.icon ?? label.title.charAt(0)}</span></div>`,
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
