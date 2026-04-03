import type { DealType } from "@/features/properties/dealType";

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

export function parsePropertyType(value: unknown): PropertyType {
  const s = typeof value === "string" ? value.trim() : "";
  return isPropertyType(s) ? s : "APARTMENT";
}

export const BUILDING_CONDITIONS = ["OLD", "NEW", "UNDER_CONSTRUCTION"] as const;
export type BuildingCondition = (typeof BUILDING_CONDITIONS)[number];

export const KITCHEN_TYPES = ["SEPARATE", "STUDIO"] as const;
export type KitchenType = (typeof KITCHEN_TYPES)[number];

export const LAND_STATUSES = [
  "AGRICULTURAL",
  "NON_AGRICULTURAL",
  "COMMERCIAL",
  "SPECIAL",
  "INVESTMENT",
  "FARMING",
] as const;
export type LandStatus = (typeof LAND_STATUSES)[number];

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

export type PropertyApartment = {
  id: string;
  propertyId: string;
  buildingNumber: string;
  buildingCondition: string;
  totalArea: number;
  project: string;
  renovation: string;
  rooms: number;
  bedrooms: number;
  floor: number;
  balcony: boolean;
  elevator: boolean;
  centralHeating: boolean;
  airConditioner: boolean;
  kitchenType: string;
  furniture: boolean;
  appliances: boolean;
  parking: boolean;
  petsAllowed: boolean;
  minRentalPeriod: number;
};

export type PropertyPrivateHouse = {
  id: string;
  propertyId: string;
  totalArea?: number;
  rooms?: number;
  bedrooms?: number;
  floor?: number;
  houseArea: number;
  yardArea: number;
  pool: boolean;
  fruitTrees: boolean;
};

export type PropertyLandPlot = {
  id: string;
  propertyId: string;
  landArea: number;
  forInvestment: boolean;
  canBeDivided: boolean;
};

export type PropertyCommercial = {
  id: string;
  propertyId: string;
  area: number;
  floor?: number;
  parking: boolean;
  airConditioner: boolean;
};

export type Property = {
  id: string;
  propertyType: PropertyType;
  dealType: DealType;
  city: string;
  district: string;
  address: string;
  cadastralCode?: string | null;
  pricePublic: number;
  priceInternal?: number | null;
  ownerName: string;
  ownerPhone: string;
  ownerWhatsapp?: string | null;
  ourSiteId?: string | null;
  myHomeId?: string | null;
  ssGeId?: string | null;
  description?: string | null;
  comment: string | null;
  internalComment: string | null;
  reminderDate: string | null;
  commentDate: string | null;
  images: Array<{ url: string; originalName: string }>;
  createdAt: string;
  updatedAt: string;
  userId: string;

  apartment: PropertyApartment | null;
  privateHouse: PropertyPrivateHouse | null;
  landPlot: PropertyLandPlot | null;
  commercial: PropertyCommercial | null;
};
