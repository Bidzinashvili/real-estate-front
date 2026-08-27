import type { DealType } from "@/features/properties/dealType";
import type { HotelScope, PropertyType } from "@/features/properties/propertyModelTypes";
import type { PropertyStatus } from "@/features/properties/propertyStatus";

export type PublicPropertyImage = {
  id?: string;
  url: string;
  originalName: string;
};

export type PublicApartment = {
  buildingCondition: string | null;
  buildingAgeType: string | null;
  totalArea: number | null;
  renovation: string | null;
  rooms: number | null;
  bedrooms: number | null;
  floor: number | null;
  totalFloors: number | null;
  ceilingHeight: number | null;
  balconyArea: number | null;
  elevator: boolean | null;
  goodView: boolean | null;
  bathrooms: number | null;
  centralHeating: boolean | null;
  airConditioner: boolean | null;
  kitchenType: string | null;
  furnished: boolean | null;
  parkingSpaces: number | null;
  petsAllowed: boolean | null;
  minRentalPeriod: number | null;
  project: string | null;
  buildingNumber: string | null;
};

export type PublicPrivateHouse = {
  buildingCondition: string | null;
  houseArea: number | null;
  yardArea: number | null;
  totalArea: number | null;
  renovation: string | null;
  rooms: number | null;
  bedrooms: number | null;
  balconyArea: number | null;
  centralHeating: boolean | null;
  airConditioner: boolean | null;
  furnished: boolean | null;
  parkingSpaces: number | null;
  pool: boolean | null;
  fruitTrees: boolean | null;
  electricity: boolean | null;
  water: boolean | null;
  gas: boolean | null;
  sewage: boolean | null;
  petsAllowed: boolean | null;
  minRentalPeriod: number | null;
};

export type PublicLandPlot = {
  landArea: number | null;
  landCategory: string | null;
  landUsage: string | null;
  forInvestment: boolean | null;
  approvedProject: boolean | null;
  canBeDivided: boolean | null;
  fruitTrees: boolean | null;
  electricity: boolean | null;
  water: boolean | null;
  gas: boolean | null;
  sewage: boolean | null;
  minRentalPeriod: number | null;
};

export type PublicCommercial = {
  area: number | null;
  status: string | null;
  floor: number | null;
  totalFloors: number | null;
  ceilingHeight: number | null;
  renovation: string | null;
  centralHeating: boolean | null;
  airConditioner: boolean | null;
  furnished: boolean | null;
  parkingSpaces: number | null;
  electricity: boolean | null;
  water: boolean | null;
  gas: boolean | null;
  sewage: boolean | null;
  minRentalPeriod: number | null;
};

export type PublicProperty = {
  id: string;
  shareId: string;
  available: boolean;
  status: PropertyStatus;
  propertyType: PropertyType;
  dealType: DealType;
  hotelScope: HotelScope | null;
  city: string;
  district: string;
  address: string;
  pricePublic: number;
  publicComment: string | null;
  images: PublicPropertyImage[];
  apartment: PublicApartment | null;
  privateHouse: PublicPrivateHouse | null;
  landPlot: PublicLandPlot | null;
  commercial: PublicCommercial | null;
};
