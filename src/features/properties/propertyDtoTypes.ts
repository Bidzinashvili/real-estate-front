import type { DealType } from "@/features/properties/dealType";
import type {
  BuildingCondition,
  CommercialStatus,
  KitchenType,
  LandStatus,
  PropertyType,
} from "@/features/properties/propertyModelTypes";

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
