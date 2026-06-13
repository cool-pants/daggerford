"use client";

import { CircleMarker, Polyline, useMapEvents } from "react-leaflet";
import type { MapPoint } from "@/lib/map";
import { latLngToImagePoint } from "@/lib/map";

type Props = {
  enabled: boolean;
  points: MapPoint[];
  onAddPoint: (point: MapPoint) => void;
};

export function RulerLayer({ enabled, points, onAddPoint }: Props) {
  useMapEvents({
    click(event) {
      if (!enabled) {
        return;
      }
      onAddPoint(latLngToImagePoint(event.latlng.lat, event.latlng.lng));
    }
  });

  return (
    <>
      {points.length > 1 ? (
        <Polyline
          pathOptions={{ color: "#f2c14e", weight: 4, opacity: 0.92 }}
          positions={points.map((point) => [point.y, point.x])}
        />
      ) : null}
      {points.map((point, index) => (
        <CircleMarker
          key={`${point.x}-${point.y}-${index}`}
          center={[point.y, point.x]}
          pathOptions={{
            color: "#20241f",
            fillColor: index === points.length - 1 ? "#d94b35" : "#f2c14e",
            fillOpacity: 0.95,
            weight: 2
          }}
          radius={7}
        />
      ))}
    </>
  );
}
