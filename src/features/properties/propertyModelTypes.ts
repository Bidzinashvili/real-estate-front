import type { DealType } from "@/features/properties/dealType";
import type { SupportedListingCurrency } from "@/features/currency/types";
import type { LabelDto } from "@/features/labels/labelTypes";
import type { PropertyStatus } from "@/features/properties/propertyStatus";
import type { JsonValue } from "@/shared/lib/jsonValue";
import type { EntityVerificationFields } from "@/features/lifecycle/lifecycleEnums";
import type { ReminderSummary } from "@/features/reminders/remindersApiTypes";
import type { PropertyOwnerSummary } from "@/features/propertyOwners/propertyOwnerSummary";
import type { RecordColor } from "@/features/recordColor/recordColor";
import type { ManagingAgentSummary } from "@/features/agents/managingAgentSummary";

export type { DealType };
export type { PropertyStatus };

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

export const HOTEL_SCOPES = ["WHOLE_HOTEL", "HOTEL_ROOM"] as const;
export type HotelScope = (typeof HOTEL_SCOPES)[number];

export function isHotelScope(value: string): value is HotelScope {
  return (HOTEL_SCOPES as readonly string[]).includes(value);
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

export const BUILDING_AGE_TYPES = ["NEW_OLD", "NEW_GOOD"] as const;
export type BuildingAgeType = (typeof BUILDING_AGE_TYPES)[number];

export function isBuildingAgeType(value: string): value is BuildingAgeType {
  return (BUILDING_AGE_TYPES as readonly string[]).includes(value);
}

export function parseBuildingAgeType(value: unknown): BuildingAgeType | null {
  const stringCandidate = typeof value === "string" ? value.trim() : "";
  return isBuildingAgeType(stringCandidate) ? stringCandidate : null;
}

export function buildingAgeTypeForCondition(
  condition: string | null | undefined,
  ageType: string | null | undefined,
): BuildingAgeType | null {
  if (condition !== "NEW") {
    return null;
  }
  if (typeof ageType === "string" && isBuildingAgeType(ageType)) {
    return ageType;
  }
  return null;
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

export const LISTING_PARKING_VALUES = ["NO", "YES", "TO_VERIFY"] as const;
export type ListingParking = (typeof LISTING_PARKING_VALUES)[number];

export function isListingParking(value: string): value is ListingParking {
  return (LISTING_PARKING_VALUES as readonly string[]).includes(value);
}

export const DEFAULT_LISTING_PARKING: ListingParking = "TO_VERIFY";

export const LISTING_PARKING_TYPES = [
  "SHARED_YARD",
  "PRIVATE_YARD",
  "UNDERGROUND",
  "GARAGE",
] as const;
export type ListingParkingType = (typeof LISTING_PARKING_TYPES)[number];

export function isListingParkingType(value: string): value is ListingParkingType {
  return (LISTING_PARKING_TYPES as readonly string[]).includes(value);
}

export type PropertyListingImage = {
  id?: string;
  url: string;
  originalName: string;
};

export const EXTERNAL_ID_PLATFORMS = ["MYHOME", "SS_GE"] as const;
export type ExternalIdPlatform = (typeof EXTERNAL_ID_PLATFORMS)[number];

export function isExternalIdPlatform(value: string): value is ExternalIdPlatform {
  return (EXTERNAL_ID_PLATFORMS as readonly string[]).includes(value);
}

export function parseExternalIdPlatform(value: unknown): ExternalIdPlatform | null {
  if (value === "MYHOME") {
    return "MYHOME";
  }
  if (value === "SS_GE" || value === "SSGE") {
    return "SS_GE";
  }
  return null;
}

export type PropertyExternalId = {
  id: string;
  platform: ExternalIdPlatform;
  value: string;
  enteredAt: string;
  archivedAt: string | null;
};

export type PropertyApartment = {
  id: string;
  propertyId: string;
  buildingNumber?: string | null;
  buildingCondition: BuildingCondition;
  buildingAgeType: BuildingAgeType | null;
  totalArea: number | null;
  project: string | null;
  renovation: string | null;
  rooms: number;
  bedrooms: number;
  floor: number;
  totalFloors: number;
  ceilingHeight: number | null;
  balconyCount: number | null;
  balconyArea: number | null;
  veranda: boolean;
  needsVerification: string[];
  elevator: boolean | null;
  centralHeating: boolean | null;
  airConditioner: boolean | null;
  kitchenType: KitchenType;
  furnished: boolean | null;
  parking: ListingParking;
  parkingTypes: ListingParkingType[];
  parkingSpaces: number | null;
  petsAllowed: boolean | null;
  minRentalPeriod: number | null;
  goodView: boolean | null;
  bathrooms: number | null;
};

export type PropertyPrivateHouse = {
  id: string;
  propertyId: string;
  buildingCondition: BuildingCondition;
  houseArea: number | null;
  yardArea: number;
  totalArea: number | null;
  renovation: string | null;
  rooms: number;
  bedrooms: number;
  balconyCount: number | null;
  balconyArea: number | null;
  veranda: boolean;
  needsVerification: string[];
  centralHeating: boolean;
  airConditioner: boolean;
  furnished: boolean;
  parking: ListingParking;
  parkingTypes: ListingParkingType[];
  parkingSpaces: number | null;
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
  landArea: number | null;
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
  area: number | null;
  status: CommercialStatus;
  floor: number;
  totalFloors: number | null;
  ceilingHeight: number | null;
  renovation: string | null;
  needsVerification: string[];
  centralHeating: boolean;
  airConditioner: boolean;
  parking: ListingParking;
  parkingTypes: ListingParkingType[];
  parkingSpaces: number | null;
  electricity: boolean;
  water: boolean;
  gas: boolean;
  sewage: boolean;
  minRentalPeriod: number | null;
};

export type Property = EntityVerificationFields & {
  id: string;
  propertyType: PropertyType;
  hotelScope?: HotelScope | null;
  dealType: DealType;
  status: PropertyStatus;
  city: string;
  district: string;
  address: string;
  streetId: string | null;
  title?: string | null;
  cadastralCode: string | null;
  pricePublic: number;
  currency: SupportedListingCurrency;
  priceInternal?: number | null;
  ownerName?: string;
  ownerPhones?: string[];
  ownerWhatsapp?: string | null;
  ownerId?: string | null;
  propertyOwner?: PropertyOwnerSummary | null;
  ourSiteId: string | null;
  myHomeId?: string | null;
  ssGeId?: string | null;
  externalIds?: PropertyExternalId[];
  description: string | null;
  publicComment: string | null;
  privateComment?: string | null;
  internalText?: string | null;
  comment?: string | null;
  internalComment?: string | null;
  commentDate: string | null;
  tenantClientId: string | null;
  rentalDurationMonths: number | null;
  archivedAt: string | null;
  labels?: LabelDto[];
  images: PropertyListingImage[];
  createdAt: string;
  updatedAt: string;
  noteLastOpenedAt?: string | null;
  deletedAt: string | null;
  userId?: string;
  managingAgent?: ManagingAgentSummary | null;
  ownedByViewer: boolean | null;
  viewerPendingVerificationRequest?: boolean;
  hideFromOthers?: boolean;
  readyToUpload?: boolean;
  color?: RecordColor;

  apartment: PropertyApartment | null;
  privateHouse: PropertyPrivateHouse | null;
  landPlot: PropertyLandPlot | null;
  commercial: PropertyCommercial | null;
  reminderSummary?: ReminderSummary;
};
