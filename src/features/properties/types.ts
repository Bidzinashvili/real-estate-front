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
  propertyType: string;
  dealType: DealType;
  city: string;
  district: string;
  address: string;
  cadastralCode: string;
  pricePublic: number;
  priceInternal: number;
  ownerName: string;
  ownerPhone: string;
  ownerWhatsapp: string;
  ourSiteId: string;
  myHomeId: string;
  ssGeId: string;
  description: string;
  comment: string | null;
  internalComment: string | null;
  reminderDate: string | null;
  commentDate: string | null;
  images: string[];
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
  priceInternal?: number;
  description?: string;

  apartment?: PropertyApartmentUpdate;
  privateHouse?: PropertyPrivateHouseUpdate;
  landPlot?: PropertyLandPlotUpdate;
  commercial?: PropertyCommercialUpdate;
};

