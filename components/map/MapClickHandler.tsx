"use client";

import { useMapEvents } from "react-leaflet";
import { latLngToImagePoint } from "@/lib/map";

type Props = {
  enabled: boolean;
  onPlace: (point: { x: number; y: number }) => void;
};

export function MapClickHandler({ enabled, onPlace }: Props) {
  useMapEvents({
    click(event) {
      if (!enabled) {
        return;
      }
      onPlace(latLngToImagePoint(event.latlng.lat, event.latlng.lng));
    }
  });

  return null;
}
