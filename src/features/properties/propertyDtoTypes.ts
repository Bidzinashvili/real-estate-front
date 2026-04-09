import type { DealType } from "@/features/properties/dealType";
import type { UpdatePropertyRequestBody } from "@/features/properties/propertyApiTypes";
import type {
  BuildingCondition,
  CommercialStatus,
  KitchenType,
  LandCategory,
  PropertyType,
} from "@/features/properties/propertyModelTypes";

export type PropertyUpdatePayload = UpdatePropertyRequestBody;

export type PropertyApartmentUpdate = NonNullable<
  UpdatePropertyRequestBody["apartment"]
>;

export type PropertyPrivateHouseUpdate = NonNullable<
  UpdatePropertyRequestBody["privateHouse"]
>;

export type PropertyLandPlotUpdate = NonNullable<
  UpdatePropertyRequestBody["landPlot"]
>;

export type PropertyCommercialUpdate = NonNullable<
  UpdatePropertyRequestBody["commercial"]
>;

export type PropertyImageInput =
  | string
  | {
      id?: string;
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
  minRentalPeriod?: number;
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
  minRentalPeriod?: number;
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
