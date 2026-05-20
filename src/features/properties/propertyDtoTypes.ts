import type { DealType } from "@/features/properties/dealType";
import type { PropertyStatus } from "@/features/properties/propertyStatus";
import type { UpdatePropertyRequestBody } from "@/features/properties/propertyApiTypes";
import type { LabelDto } from "@/features/labels/labelTypes";
import type {
  BuildingCondition,
  CommercialStatus,
  HotelScope,
  KitchenType,
  LandCategory,
  PropertyType,
} from "@/features/properties/propertyModelTypes";

export type PropertyUpdatePayload = UpdatePropertyRequestBody;
export type { LabelDto };

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
  totalFloors: number;
  ceilingHeight?: number;
  balconyArea?: number;
  needsVerification?: string[];
  elevator: boolean;
  centralHeating: boolean;
  airConditioner: boolean;
  kitchenType: KitchenType;
  furnished: boolean;
  parkingSpaces?: number;
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
  balconyArea?: number;
  needsVerification?: string[];
  centralHeating: boolean;
  airConditioner: boolean;
  furnished: boolean;
  parkingSpaces?: number;
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
  totalFloors: number;
  ceilingHeight?: number;
  needsVerification?: string[];
  centralHeating: boolean;
  airConditioner: boolean;
  parkingSpaces?: number;
  electricity: boolean;
  water: boolean;
  gas: boolean;
  sewage: boolean;
  renovation?: string;
  minRentalPeriod?: number;
};

export type CreatePropertyDto = {
  propertyType?: PropertyType;
  hotelScope?: HotelScope;
  dealType?: DealType;
  status?: PropertyStatus;
  reminderDate?: string;
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
  externalIds?: Array<{
    platform: "MYHOME" | "SSGE";
    value: string;
    enteredAt?: string;
  }>;
  publicComment?: string;
  privateComment?: string;
  internalText?: string;
  labels?: string[];
  images?: PropertyImageInput[];
  apartment?: PropertyApartmentCreate;
  privateHouse?: PropertyPrivateHouseCreate;
  landPlot?: PropertyLandPlotCreate;
  commercial?: PropertyCommercialCreate;
};
