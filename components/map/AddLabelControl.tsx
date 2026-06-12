"use client";

import { MapPinPlus, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  active: boolean;
  onToggle: () => void;
};

export function AddLabelControl({ active, onToggle }: Props) {
  return (
    <Button
      className="shadow-atlas"
      variant={active ? "primary" : "secondary"}
      onClick={onToggle}
      title={active ? "Click the map to place a label" : "Add label"}
    >
      {active ? <MousePointer2 className="h-4 w-4" /> : <MapPinPlus className="h-4 w-4" />}
      {active ? "Click Map" : "Add Label"}
    </Button>
  );
}
