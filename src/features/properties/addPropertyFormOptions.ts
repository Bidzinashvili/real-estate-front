import type {
  BuildingCondition,
  CommercialStatus,
  KitchenType,
  LandStatus,
  PropertyType,
  Renovation,
} from "@/features/properties/types";
import { isRenovation } from "@/features/properties/types";

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

export const LAND_STATUS_OPTIONS: ReadonlyArray<{
  value: LandStatus;
  label: string;
}> = [
  { value: "AGRICULTURAL", label: "Agricultural" },
  { value: "NON_AGRICULTURAL", label: "Non-agricultural" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "SPECIAL", label: "Special" },
  { value: "INVESTMENT", label: "Investment" },
  { value: "FARMING", label: "Farming" },
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
