import type { LucideIcon } from "lucide-react";
import { DoorOpen, Hash, Layers, Maximize2, Trees } from "lucide-react";
import { statChipClassName } from "@/shared/ui/chipStyles";

type ClosedRecordStatChip = {
  key: string;
  label: string;
};

type ClosedRecordStatChipsProps = {
  items: ClosedRecordStatChip[];
};

function iconForStatKey(statKey: string): LucideIcon | null {
  if (statKey === "rooms" || statKey === "bedrooms") {
    return DoorOpen;
  }
  if (statKey === "area" || statKey === "yard") {
    return Maximize2;
  }
  if (statKey === "floor") {
    return Layers;
  }
  if (statKey === "units") {
    return Hash;
  }
  if (statKey === "land") {
    return Trees;
  }
  return null;
}

export function ClosedRecordStatChips({ items }: ClosedRecordStatChipsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {items.map((item) => {
        const Icon = iconForStatKey(item.key);
        return (
          <span key={item.key} className={statChipClassName}>
            {Icon ? <Icon className="h-3 w-3 shrink-0 opacity-70" aria-hidden /> : null}
            {item.label}
          </span>
        );
      })}
    </div>
  );
}
