import type { DealType } from "@/features/properties/dealType";
import type { JsonValue } from "@/shared/lib/jsonValue";

export type { DealType };

export const PROPERTY_TYPES = [
  "APARTMENT",
  "PRIVATE_HOUSE",
  "LAND_PLOT",
  "COMMERCIAL",
  "COTTAGE",
  "HOTEL",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export function isPropertyType(value: string): value is PropertyType {
  return (PROPERTY_TYPES as readonly string[]).includes(value);
}

export function parsePropertyType(value: JsonValue | undefined): PropertyType {
  const stringCandidate = typeof value === "string" ? value.trim() : "";
  return isPropertyType(stringCandidate) ? stringCandidate : "APARTMENT";
}

export const BUILDING_CONDITIONS = ["OLD", "NEW", "UNDER_CONSTRUCTION"] as const;
export type BuildingCondition = (typeof BUILDING_CONDITIONS)[number];

export function isBuildingCondition(value: string): value is BuildingCondition {
  return (BUILDING_CONDITIONS as readonly string[]).includes(value);
}

export const KITCHEN_TYPES = ["SEPARATE", "STUDIO"] as const;
export type KitchenType = (typeof KITCHEN_TYPES)[number];

export function isKitchenType(value: string): value is KitchenType {
  return (KITCHEN_TYPES as readonly string[]).includes(value);
}

export const LAND_CATEGORIES = ["AGRICULTURAL", "NON_AGRICULTURAL"] as const;
export type LandCategory = (typeof LAND_CATEGORIES)[number];

export function isLandCategory(value: string): value is LandCategory {
  return (LAND_CATEGORIES as readonly string[]).includes(value);
}

export const COMMERCIAL_STATUSES = [
  "UNIVERSAL",
  "OFFICE",
  "RETAIL",
  "WAREHOUSE",
  "INDUSTRIAL",
  "FOOD_FACILITY",
  "GARAGE",
  "BASEMENT",
  "SEMI_BASEMENT",
  "WHOLE_BUILDING",
  "CAR_WASH",
  "CAR_SERVICE",
] as const;
export type CommercialStatus = (typeof COMMERCIAL_STATUSES)[number];

export function isCommercialStatus(value: string): value is CommercialStatus {
  return (COMMERCIAL_STATUSES as readonly string[]).includes(value);
}

export const RENOVATION_VALUES = [
  "NEW_RENOVATED",
  "RENOVATED",
  "OLD_RENOVATED",
  "NEEDS_RENOVATION",
  "GREEN_FRAME",
  "WHITE_FRAME",
  "BLACK_FRAME",
] as const;
export type Renovation = (typeof RENOVATION_VALUES)[number];

export function isRenovation(value: string): value is Renovation {
  return (RENOVATION_VALUES as readonly string[]).includes(value);
}

export function parseRenovationForForm(
  raw: string | null | undefined,
): Renovation | "" {
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  if (trimmed === "") return "";
  return isRenovation(trimmed) ? trimmed : "";
}

export type PropertyListingImage = {
  id: string;
  url: string;
  originalName: string;
};

export type PropertyApartment = {
  id: string;
  propertyId: string;
  buildingNumber: string | null;
  buildingCondition: BuildingCondition;
  totalArea: number;
  project: string | null;
  renovation: string | null;
  rooms: number;
  bedrooms: number;
  floor: number;
  balcony: number;
  elevator: boolean;
  centralHeating: boolean;
  airConditioner: boolean;
  kitchenType: KitchenType;
  furniture: boolean;
  appliances: boolean;
  parking: boolean;
  petsAllowed: boolean | null;
  minRentalPeriod: number | null;
};

export type PropertyPrivateHouse = {
  id: string;
  propertyId: string;
  buildingCondition: BuildingCondition;
  houseArea: number;
  yardArea: number;
  totalArea: number;
  renovation: string | null;
  rooms: number;
  bedrooms: number;
  balcony: number;
  centralHeating: boolean;
  airConditioner: boolean;
  furniture: boolean;
  appliances: boolean;
  parking: boolean;
  pool: boolean;
  fruitTrees: boolean;
  electricity: boolean;
  water: boolean;
  gas: boolean;
  sewage: boolean;
  petsAllowed: boolean | null;
  minRentalPeriod: number | null;
};

export type PropertyLandPlot = {
  id: string;
  propertyId: string;
  landArea: number;
  landCategory: LandCategory;
  landUsage: CommercialStatus;
  forInvestment: boolean;
  approvedProject: boolean;
  canBeDivided: boolean;
  fruitTrees: boolean;
  electricity: boolean;
  water: boolean;
  gas: boolean;
  sewage: boolean;
  minRentalPeriod: number | null;
};

export type PropertyCommercial = {
  id: string;
  propertyId: string;
  area: number;
  status: CommercialStatus;
  floor: number;
  renovation: string | null;
  centralHeating: boolean;
  airConditioner: boolean;
  parking: boolean;
  electricity: boolean;
  water: boolean;
  gas: boolean;
  sewage: boolean;
  minRentalPeriod: number | null;
};

export type Property = {
  id: string;
  propertyType: PropertyType;
  dealType: DealType;
  city: string;
  district: string;
  address: string;
  title: string | null;
  cadastralCode: string | null;
  pricePublic: number;
  priceInternal: number | null;
  ownerName: string;
  ownerPhone: string;
  ownerWhatsapp: string | null;
  ourSiteId: string | null;
  myHomeId: string | null;
  ssGeId: string | null;
  description: string | null;
  comment: string | null;
  internalComment: string | null;
  reminderDate: string | null;
  commentDate: string | null;
  images: PropertyListingImage[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: string;

  apartment: PropertyApartment | null;
  privateHouse: PropertyPrivateHouse | null;
  landPlot: PropertyLandPlot | null;
  commercial: PropertyCommercial | null;
};
