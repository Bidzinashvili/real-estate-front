import type { Property } from "@/features/properties/types";

export type CompactStatChip = {
  key: string;
  label: string;
};

function formatFloorLabel(
  floor: number,
  totalFloors: number | null | undefined,
): string {
  if (totalFloors !== null && totalFloors !== undefined && Number.isFinite(totalFloors)) {
    return `${floor}/${totalFloors}`;
  }
  return `${floor} სართული`;
}

export function propertyCompactStats(property: Property): CompactStatChip[] {
  if (property.apartment) {
    const apartment = property.apartment;
    const chips: CompactStatChip[] = [];
    if (Number.isFinite(apartment.rooms)) {
      chips.push({ key: "rooms", label: `${apartment.rooms} ოთახი` });
    }
    if (Number.isFinite(apartment.bedrooms)) {
      chips.push({ key: "bedrooms", label: `${apartment.bedrooms} საძინებელი` });
    }
    if (Number.isFinite(apartment.totalArea)) {
      chips.push({ key: "area", label: `${apartment.totalArea} მ²` });
    }
    if (Number.isFinite(apartment.floor)) {
      chips.push({
        key: "floor",
        label: formatFloorLabel(apartment.floor, apartment.totalFloors),
      });
    }
    return chips;
  }

  if (property.privateHouse) {
    const house = property.privateHouse;
    const chips: CompactStatChip[] = [];
    if (Number.isFinite(house.rooms)) {
      chips.push({ key: "rooms", label: `${house.rooms} ოთახი` });
    }
    if (Number.isFinite(house.bedrooms)) {
      chips.push({ key: "bedrooms", label: `${house.bedrooms} საძინებელი` });
    }
    if (Number.isFinite(house.totalArea)) {
      chips.push({ key: "area", label: `${house.totalArea} მ²` });
    }
    if (Number.isFinite(house.yardArea)) {
      chips.push({ key: "yard", label: `${house.yardArea} მ² ეზო` });
    }
    return chips;
  }

  if (property.landPlot) {
    const plot = property.landPlot;
    if (Number.isFinite(plot.landArea)) {
      return [{ key: "area", label: `${plot.landArea} მ²` }];
    }
    return [];
  }

  if (property.commercial) {
    const commercial = property.commercial;
    const chips: CompactStatChip[] = [];
    if (Number.isFinite(commercial.area)) {
      chips.push({ key: "area", label: `${commercial.area} მ²` });
    }
    if (Number.isFinite(commercial.floor)) {
      chips.push({
        key: "floor",
        label: formatFloorLabel(commercial.floor, commercial.totalFloors),
      });
    }
    return chips;
  }

  return [];
}
