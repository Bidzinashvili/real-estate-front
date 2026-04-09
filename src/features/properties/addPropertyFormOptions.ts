import type {
  BuildingCondition,
  CommercialStatus,
  HotelScope,
  KitchenType,
  LandCategory,
  PropertyType,
  Renovation,
} from "@/features/properties/types";
import {
  isCommercialStatus,
  isLandCategory,
  isRenovation,
  LAND_CATEGORIES,
} from "@/features/properties/types";

const LAND_CATEGORY_LABELS: Readonly<Record<LandCategory, string>> = {
  AGRICULTURAL: "Agricultural",
  NON_AGRICULTURAL: "Non-agricultural",
};

export const PROPERTY_TYPE_OPTIONS: ReadonlyArray<{
  value: PropertyType;
  label: string;
}> = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "PRIVATE_HOUSE", label: "Private house" },
  { value: "LAND_PLOT", label: "Land plot" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "COTTAGE", label: "Cottage" },
  { value: "HOTEL", label: "Hotel" },
];

export const HOTEL_SCOPE_FORM_OPTIONS: ReadonlyArray<{
  value: HotelScope;
  label: string;
}> = [
  { value: "WHOLE_HOTEL", label: "Whole hotel" },
  { value: "HOTEL_ROOM", label: "Hotel room" },
];

export function formatHotelScopeLabel(scope: HotelScope): string {
  return scope === "WHOLE_HOTEL" ? "Whole hotel" : "Hotel room";
}

export function formatHotelScopeLabelOrUnset(
  scope: HotelScope | null | undefined,
): string {
  if (scope === null || scope === undefined) return "Not specified";
  return formatHotelScopeLabel(scope);
}

export const BUILDING_CONDITION_OPTIONS: ReadonlyArray<{
  value: BuildingCondition;
  label: string;
}> = [
  { value: "OLD", label: "Old" },
  { value: "NEW", label: "New" },
  { value: "UNDER_CONSTRUCTION", label: "Under construction" },
];

export const KITCHEN_TYPE_OPTIONS: ReadonlyArray<{
  value: KitchenType;
  label: string;
}> = [
  { value: "SEPARATE", label: "Separate" },
  { value: "STUDIO", label: "Studio" },
];

export const LAND_CATEGORY_SELECT_OPTIONS: ReadonlyArray<{
  value: LandCategory | "";
  label: string;
}> = [
  { value: "", label: "Select land category" },
  ...LAND_CATEGORIES.map((category) => ({
    value: category,
    label: LAND_CATEGORY_LABELS[category],
  })),
];

export const COMMERCIAL_STATUS_OPTIONS: ReadonlyArray<{
  value: CommercialStatus;
  label: string;
}> = [
  { value: "UNIVERSAL", label: "Universal" },
  { value: "OFFICE", label: "Office" },
  { value: "RETAIL", label: "Retail" },
  { value: "WAREHOUSE", label: "Warehouse" },
  { value: "INDUSTRIAL", label: "Industrial" },
  { value: "FOOD_FACILITY", label: "Food facility" },
  { value: "GARAGE", label: "Garage" },
  { value: "BASEMENT", label: "Basement" },
  { value: "SEMI_BASEMENT", label: "Semi-basement" },
  { value: "WHOLE_BUILDING", label: "Whole building" },
  { value: "CAR_WASH", label: "Car wash" },
  { value: "CAR_SERVICE", label: "Car service" },
];

export const LAND_USAGE_SELECT_OPTIONS: ReadonlyArray<{
  value: CommercialStatus | "";
  label: string;
}> = [
  { value: "", label: "Select land usage" },
  ...COMMERCIAL_STATUS_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  })),
];

export function formatLandCategoryLabel(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  if (!isLandCategory(trimmed)) return trimmed;
  return LAND_CATEGORY_LABELS[trimmed];
}

export function formatLandUsageLabel(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  if (!isCommercialStatus(trimmed)) return trimmed;
  const matched = COMMERCIAL_STATUS_OPTIONS.find((option) => option.value === trimmed);
  return matched?.label ?? trimmed;
}

export const RENOVATION_OPTIONS: ReadonlyArray<{
  value: Renovation;
  label: string;
}> = [
  { value: "NEW_RENOVATED", label: "New Renovated" },
  { value: "RENOVATED", label: "Renovated" },
  { value: "OLD_RENOVATED", label: "Old Renovated" },
  { value: "NEEDS_RENOVATION", label: "Needs Renovation" },
  { value: "GREEN_FRAME", label: "Green Frame" },
  { value: "WHITE_FRAME", label: "White Frame" },
  { value: "BLACK_FRAME", label: "Black Frame" },
];

export const RENOVATION_SELECT_OPTIONS: ReadonlyArray<{
  value: Renovation | "";
  label: string;
}> = [
  { value: "", label: "Not selected" },
  ...RENOVATION_OPTIONS,
];

export function formatRenovationLabel(
  raw: string | null | undefined,
): string | null {
  if (raw === null || raw === undefined || raw.trim() === "") return null;
  const trimmed = raw.trim();
  if (isRenovation(trimmed)) {
    const matched = RENOVATION_OPTIONS.find((option) => option.value === trimmed);
    return matched?.label ?? trimmed;
  }
  return trimmed;
}
