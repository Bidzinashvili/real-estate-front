import type {
  BuildingAgeType,
  BuildingCondition,
  CommercialStatus,
  HotelScope,
  KitchenType,
  LandCategory,
  PropertyType,
  Renovation,
} from "@/features/properties/types";
import {
  isBuildingAgeType,
  isBuildingCondition,
  isCommercialStatus,
  isKitchenType,
  isLandCategory,
  isPropertyType,
  isRenovation,
  LAND_CATEGORIES,
} from "@/features/properties/types";
import {
  BUILDING_AGE_TYPE_FIELD_LABEL,
  BUILDING_AGE_TYPE_LABELS,
  BUILDING_CONDITION_LABELS,
  CLIENT_PREFERENCE_LABELS,
  COMMERCIAL_STATUS_LABELS,
  HOTEL_SCOPE_LABELS,
  KITCHEN_TYPE_LABELS,
  LAND_CATEGORY_LABELS,
  PROPERTY_TYPE_LABELS,
  RENOVATION_LABELS,
} from "@/shared/i18n/enumLabels";

export { BUILDING_AGE_TYPE_FIELD_LABEL };

export const GEORGIAN_CITY_OPTIONS = [
  { value: "თბილისი", label: "თბილისი" },
  { value: "ბათუმი", label: "ბათუმი" },
  { value: "ქუთაისი", label: "ქუთაისი" },
  { value: "ბორჯომი", label: "ბორჯომი" },
] as const;

export type GeorgianCity = (typeof GEORGIAN_CITY_OPTIONS)[number]["value"];

export const TBILISI_CITY: GeorgianCity = "თბილისი";

export function isTbilisiCity(city: string): boolean {
  return city.trim() === TBILISI_CITY;
}

export const PROPERTY_TYPE_OPTIONS: ReadonlyArray<{
  value: PropertyType;
  label: string;
}> = [
  { value: "APARTMENT", label: PROPERTY_TYPE_LABELS.APARTMENT },
  { value: "PRIVATE_HOUSE", label: PROPERTY_TYPE_LABELS.PRIVATE_HOUSE },
  { value: "LAND_PLOT", label: PROPERTY_TYPE_LABELS.LAND_PLOT },
  { value: "COMMERCIAL", label: PROPERTY_TYPE_LABELS.COMMERCIAL },
  { value: "COTTAGE", label: PROPERTY_TYPE_LABELS.COTTAGE },
  { value: "HOTEL", label: PROPERTY_TYPE_LABELS.HOTEL },
];

export const HOTEL_SCOPE_FORM_OPTIONS: ReadonlyArray<{
  value: HotelScope;
  label: string;
}> = [
  { value: "WHOLE_HOTEL", label: HOTEL_SCOPE_LABELS.WHOLE_HOTEL },
  { value: "HOTEL_ROOM", label: HOTEL_SCOPE_LABELS.HOTEL_ROOM },
];

export function formatHotelScopeLabel(scope: HotelScope): string {
  return HOTEL_SCOPE_LABELS[scope];
}

export function formatHotelScopeLabelOrUnset(
  scope: HotelScope | null | undefined,
): string {
  if (scope === null || scope === undefined) return "არ არის მითითებული";
  return formatHotelScopeLabel(scope);
}

export const BUILDING_CONDITION_OPTIONS: ReadonlyArray<{
  value: BuildingCondition;
  label: string;
}> = [
  { value: "OLD", label: BUILDING_CONDITION_LABELS.OLD },
  { value: "NEW", label: BUILDING_CONDITION_LABELS.NEW },
  { value: "UNDER_CONSTRUCTION", label: BUILDING_CONDITION_LABELS.UNDER_CONSTRUCTION },
];

export const BUILDING_AGE_TYPE_SELECT_OPTIONS: ReadonlyArray<{
  value: BuildingAgeType | "";
  label: string;
}> = [
  { value: "", label: CLIENT_PREFERENCE_LABELS.NOT_SET },
  { value: "NEW", label: BUILDING_AGE_TYPE_LABELS.NEW },
  { value: "OLD", label: BUILDING_AGE_TYPE_LABELS.OLD },
];

export const KITCHEN_TYPE_OPTIONS: ReadonlyArray<{
  value: KitchenType;
  label: string;
}> = [
  { value: "SEPARATE", label: KITCHEN_TYPE_LABELS.SEPARATE },
  { value: "STUDIO", label: KITCHEN_TYPE_LABELS.STUDIO },
];

export const LAND_CATEGORY_SELECT_OPTIONS: ReadonlyArray<{
  value: LandCategory | "";
  label: string;
}> = [
  { value: "", label: "აირჩიეთ მიწის კატეგორია" },
  ...LAND_CATEGORIES.map((category) => ({
    value: category,
    label: LAND_CATEGORY_LABELS[category],
  })),
];

export const COMMERCIAL_STATUS_OPTIONS: ReadonlyArray<{
  value: CommercialStatus;
  label: string;
}> = [
  { value: "UNIVERSAL", label: COMMERCIAL_STATUS_LABELS.UNIVERSAL },
  { value: "OFFICE", label: COMMERCIAL_STATUS_LABELS.OFFICE },
  { value: "RETAIL", label: COMMERCIAL_STATUS_LABELS.RETAIL },
  { value: "WAREHOUSE", label: COMMERCIAL_STATUS_LABELS.WAREHOUSE },
  { value: "INDUSTRIAL", label: COMMERCIAL_STATUS_LABELS.INDUSTRIAL },
  { value: "FOOD_FACILITY", label: COMMERCIAL_STATUS_LABELS.FOOD_FACILITY },
  { value: "GARAGE", label: COMMERCIAL_STATUS_LABELS.GARAGE },
  { value: "BASEMENT", label: COMMERCIAL_STATUS_LABELS.BASEMENT },
  { value: "SEMI_BASEMENT", label: COMMERCIAL_STATUS_LABELS.SEMI_BASEMENT },
  { value: "WHOLE_BUILDING", label: COMMERCIAL_STATUS_LABELS.WHOLE_BUILDING },
  { value: "CAR_WASH", label: COMMERCIAL_STATUS_LABELS.CAR_WASH },
  { value: "CAR_SERVICE", label: COMMERCIAL_STATUS_LABELS.CAR_SERVICE },
];

export const LAND_USAGE_SELECT_OPTIONS: ReadonlyArray<{
  value: CommercialStatus | "";
  label: string;
}> = [
  { value: "", label: "აირჩიეთ მიწის დანიშნულება" },
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
  { value: "NEW_RENOVATED", label: RENOVATION_LABELS.NEW_RENOVATED },
  { value: "RENOVATED", label: RENOVATION_LABELS.RENOVATED },
  { value: "OLD_RENOVATED", label: RENOVATION_LABELS.OLD_RENOVATED },
  { value: "NEEDS_RENOVATION", label: RENOVATION_LABELS.NEEDS_RENOVATION },
  { value: "GREEN_FRAME", label: RENOVATION_LABELS.GREEN_FRAME },
  { value: "WHITE_FRAME", label: RENOVATION_LABELS.WHITE_FRAME },
  { value: "BLACK_FRAME", label: RENOVATION_LABELS.BLACK_FRAME },
];

export const RENOVATION_SELECT_OPTIONS: ReadonlyArray<{
  value: Renovation | "";
  label: string;
}> = [
  { value: "", label: "არ არის არჩეული" },
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

export function formatPropertyTypeLabel(
  raw: string | null | undefined,
): string | null {
  if (raw === null || raw === undefined || raw.trim() === "") return null;
  const trimmed = raw.trim();
  if (isPropertyType(trimmed)) {
    return PROPERTY_TYPE_LABELS[trimmed];
  }
  return trimmed;
}

export function formatBuildingConditionLabel(
  raw: string | null | undefined,
): string | null {
  if (raw === null || raw === undefined || raw.trim() === "") return null;
  const trimmed = raw.trim();
  if (isBuildingCondition(trimmed)) {
    return BUILDING_CONDITION_LABELS[trimmed];
  }
  return trimmed;
}

export function formatBuildingAgeTypeLabel(
  raw: string | null | undefined,
): string | null {
  if (raw === null || raw === undefined || raw.trim() === "") return null;
  const trimmed = raw.trim();
  if (isBuildingAgeType(trimmed)) {
    return BUILDING_AGE_TYPE_LABELS[trimmed];
  }
  return null;
}

export function formatKitchenTypeLabel(
  raw: string | null | undefined,
): string | null {
  if (raw === null || raw === undefined || raw.trim() === "") return null;
  const trimmed = raw.trim();
  if (isKitchenType(trimmed)) {
    return KITCHEN_TYPE_LABELS[trimmed];
  }
  return trimmed;
}
