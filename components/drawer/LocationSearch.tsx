"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function LocationSearch({ value, onChange }: Props) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45" />
      <Input
        aria-label="Search locations"
        className="pl-9"
        placeholder="Search locations..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
