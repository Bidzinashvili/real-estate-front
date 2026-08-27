import {
  DEAL_TYPE_LABELS,
  type DealType,
} from "@/features/clients/clientEnums";
import type { Client, ClientRequirements } from "@/features/clients/types";
import { formatGeorgianLocative } from "@/shared/i18n/formatGeorgianLocative";

export type CompactStatChip = {
  key: string;
  label: string;
};

export function formatBoundedCountRange(
  minimum: number | null,
  maximum: number | null,
  unit: string,
): string | null {
  if (minimum === null && maximum === null) {
    return null;
  }
  if (minimum !== null && maximum !== null && minimum !== maximum) {
    return `${minimum}–${maximum} ${unit}`;
  }
  const countValue = minimum ?? maximum;
  return countValue !== null ? `${countValue} ${unit}` : null;
}

export function formatRoomsRange(
  requirements: ClientRequirements | null,
): string | null {
  if (!requirements) {
    return null;
  }
  return formatBoundedCountRange(
    requirements.minRooms,
    requirements.maxRooms,
    "ოთახი",
  );
}

export function formatBudgetRange(
  budgetMin: number | null,
  budgetMax: number | null,
): string | null {
  if (budgetMin === null && budgetMax === null) {
    return null;
  }
  const minimumLabel =
    budgetMin !== null ? budgetMin.toLocaleString() : null;
  const maximumLabel =
    budgetMax !== null ? budgetMax.toLocaleString() : null;
  if (minimumLabel && maximumLabel) {
    return `${minimumLabel} – ${maximumLabel} ₾`;
  }
  if (minimumLabel) {
    return `${minimumLabel}+ ₾`;
  }
  return maximumLabel ? `მდე ${maximumLabel} ₾` : null;
}

export function formatSharedClientHeadline(client: {
  dealType: DealType;
  districts: string[];
}): string {
  const dealLabel = DEAL_TYPE_LABELS[client.dealType];
  const district = client.districts.find((districtName) => districtName.trim() !== "") ?? "";
  const locative = formatGeorgianLocative(district);
  if (locative) {
    return `${dealLabel} ${locative}`;
  }
  return dealLabel;
}

export function formatClientLocationLine(client: Client): string {
  const districts = client.districts
    .map((district) => district.trim())
    .filter((district) => district !== "");
  const addresses = client.addresses
    .map((address) => address.trim())
    .filter((address) => address !== "");
  return [...districts, ...addresses].join(" · ");
}

export function clientCompactStats(client: Client): CompactStatChip[] {
  const requirements = client.requirements;
  const chips: CompactStatChip[] = [];
  const roomsLabel = formatRoomsRange(requirements);
  if (roomsLabel) {
    chips.push({ key: "rooms", label: roomsLabel });
  }
  const bedroomsLabel = requirements
    ? formatBoundedCountRange(
        requirements.minBedrooms,
        requirements.maxBedrooms,
        "საძინებელი",
      )
    : null;
  if (bedroomsLabel) {
    chips.push({ key: "bedrooms", label: bedroomsLabel });
  }
  const areaLabel = requirements
    ? formatBoundedCountRange(requirements.minArea, requirements.maxArea, "მ²")
    : null;
  if (areaLabel) {
    chips.push({ key: "area", label: areaLabel });
  }
  const floorLabel = requirements
    ? formatBoundedCountRange(
        requirements.minFloor,
        requirements.maxFloor,
        "სართული",
      )
    : null;
  if (floorLabel) {
    chips.push({ key: "floor", label: floorLabel });
  }
  return chips;
}

export function sharedClientCriteriaLines(client: Client): string[] {
  const lines: string[] = [];
  const budgetLabel = formatBudgetRange(client.budgetMin, client.budgetMax);
  if (budgetLabel) {
    lines.push(budgetLabel);
  }
  const roomsLabel = formatRoomsRange(client.requirements);
  if (roomsLabel) {
    lines.push(roomsLabel);
  }
  return lines;
}
