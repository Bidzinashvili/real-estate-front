import type { DealType } from "@/features/properties/dealType";

export type { DealType };

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

export type PropertyApartmentUpdate = {
  totalArea?: number;
  rooms?: number;
  balcony?: boolean;
  floor?: number;
};

export type PropertyPrivateHouseUpdate = {
  houseArea?: number;
  yardArea?: number;
  pool?: boolean;
  fruitTrees?: boolean;
};

export type PropertyLandPlotUpdate = {
  landArea?: number;
  forInvestment?: boolean;
  canBeDivided?: boolean;
};

export type PropertyCommercialUpdate = {
  area?: number;
  parking?: boolean;
  airConditioner?: boolean;
};

export type PropertyUpdatePayload = {
  dealType?: DealType;
  city?: string;
  district?: string;
  address?: string;
  pricePublic?: number;
  priceInternal?: number | null;
  description?: string;

  apartment?: PropertyApartmentUpdate;
  privateHouse?: PropertyPrivateHouseUpdate;
  landPlot?: PropertyLandPlotUpdate;
  commercial?: PropertyCommercialUpdate;
};

export const PROPERTY_TYPES = [
  "APARTMENT",
  "PRIVATE_HOUSE",
  "LAND_PLOT",
  "COMMERCIAL",
  "COTTAGE",
  "HOTEL",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

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

export type PropertyImageInput =
  | string
  | {
      url: string;
      originalName?: string;
    };

export type PropertyApartmentCreate = {
  buildingCondition: BuildingCondition;
  totalArea: number;
  rooms: number;
  bedrooms: number;
  floor: number;
  balcony: boolean;
  elevator: boolean;
  centralHeating: boolean;
  airConditioner: boolean;
  kitchenType: KitchenType;
  furniture: boolean;
  appliances: boolean;
  parking: boolean;
  buildingNumber?: string;
  project?: string;
  renovation?: string;
  petsAllowed?: boolean;
  minRentalPeriod?: number;
};

export type PropertyPrivateHouseCreate = {
  buildingCondition: BuildingCondition;
  houseArea: number;
  yardArea: number;
  totalArea: number;
  rooms: number;
  bedrooms: number;
  balcony: boolean;
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
  renovation?: string;
  petsAllowed?: boolean;
  minRentalPeriod?: number;
};

export type PropertyLandPlotCreate = {
  landArea: number;
  status: LandStatus;
  forInvestment: boolean;
  approvedProject: boolean;
  canBeDivided: boolean;
  fruitTrees: boolean;
  electricity: boolean;
  water: boolean;
  gas: boolean;
  sewage: boolean;
};

export type PropertyCommercialCreate = {
  area: number;
  status: CommercialStatus;
  floor: number;
  centralHeating: boolean;
  airConditioner: boolean;
  parking: boolean;
  electricity: boolean;
  water: boolean;
  gas: boolean;
  sewage: boolean;
  renovation?: string;
};

export type CreatePropertyDto = {
  propertyType?: PropertyType;
  dealType?: DealType;
  city: string;
  district: string;
  address: string;
  pricePublic: number;
  ownerName: string;
  ownerPhone: string;
  cadastralCode?: string;
  priceInternal?: number;
  ownerWhatsapp?: string;
  myHomeId?: string;
  ssGeId?: string;
  description?: string;
  images?: PropertyImageInput[];
  apartment?: PropertyApartmentCreate;
  privateHouse?: PropertyPrivateHouseCreate;
  landPlot?: PropertyLandPlotCreate;
  commercial?: PropertyCommercialCreate;
};

