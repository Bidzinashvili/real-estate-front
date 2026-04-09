import type { DealType } from "@/features/properties/dealType";
import type {
  BuildingCondition,
  CommercialStatus,
  KitchenType,
  LandCategory,
  PropertyType,
} from "@/features/properties/propertyModelTypes";

export type {
  BuildingCondition,
  CommercialStatus,
  KitchenType,
  LandCategory,
  PropertyType,
};
export type { DealType };

export type PropertySortBy = "createdAt" | "pricePublic";

export type SortOrder = "asc" | "desc";

export type GetPropertiesQueryApi = {
  search?: string;
  type?: PropertyType;
  dealType?: DealType;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  bedrooms?: number;
  minArea?: number;
  maxArea?: number;
  floor?: number;
  yardArea?: number;
  houseArea?: number;
  landArea?: number;
  area?: number;
  sortBy?: PropertySortBy;
  order?: SortOrder;
  page?: number;
  limit?: number;
};

export type PropertyImageEntry = {
  id: string;
  url: string;
  originalName: string;
};

export type PropertyImageInputWire =
  | string
  | { id?: string; url: string; originalName?: string };

export type ApartmentApi = {
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

export type PrivateHouseApi = {
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

export type LandPlotApi = {
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
};

export type CommercialApi = {
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
};

export type PropertyApi = {
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
  images: PropertyImageEntry[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: string;
  apartment: ApartmentApi | null;
  privateHouse: PrivateHouseApi | null;
  landPlot: LandPlotApi | null;
  commercial: CommercialApi | null;
};

export type PropertyListResponse = {
  total: number;
  page: number;
  limit: number;
  properties: PropertyApi[];
};

export type CreatePropertyBase = {
  propertyType?: PropertyType;
  dealType?: DealType;
  city: string;
  district: string;
  address: string;
  cadastralCode?: string;
  pricePublic: number;
  priceInternal?: number;
  ownerName: string;
  ownerPhone: string;
  ownerWhatsapp?: string;
  myHomeId?: string;
  ssGeId?: string;
  description?: string;
  images?: PropertyImageInputWire[];
};

export type CreateApartmentPayload = {
  buildingNumber?: string;
  buildingCondition: BuildingCondition;
  totalArea: number;
  project?: string;
  renovation?: string;
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
  petsAllowed?: boolean;
  minRentalPeriod?: number;
};

export type CreatePrivateHousePayload = {
  buildingCondition: BuildingCondition;
  houseArea: number;
  yardArea: number;
  totalArea: number;
  renovation?: string;
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
  petsAllowed?: boolean;
  minRentalPeriod?: number;
};

export type CreateLandPlotPayload = {
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
};

export type CreateCommercialPayload = {
  area: number;
  status: CommercialStatus;
  floor: number;
  renovation?: string;
  centralHeating: boolean;
  airConditioner: boolean;
  parking: boolean;
  electricity: boolean;
  water: boolean;
  gas: boolean;
  sewage: boolean;
};

export type CreatePropertyRequestBody = CreatePropertyBase &
  (
    | { propertyType?: "APARTMENT"; apartment: CreateApartmentPayload }
    | {
        propertyType: "PRIVATE_HOUSE" | "COTTAGE" | "HOTEL";
        privateHouse: CreatePrivateHousePayload;
      }
    | { propertyType?: "LAND_PLOT"; landPlot: CreateLandPlotPayload }
    | { propertyType?: "COMMERCIAL"; commercial: CreateCommercialPayload }
  );

export type CreatePropertyResponse = Omit<
  PropertyApi,
  "apartment" | "privateHouse" | "landPlot" | "commercial"
> &
  Partial<Pick<PropertyApi, "apartment" | "privateHouse" | "landPlot" | "commercial">>;

export type UpdatePropertyRequestBody = {
  dealType?: DealType;
  city?: string;
  district?: string;
  address?: string;
  pricePublic?: number;
  priceInternal?: number;
  description?: string;
  images?: PropertyImageInputWire[];
  apartment?: {
    totalArea?: number;
    rooms?: number;
    balcony?: number;
    floor?: number;
    renovation?: string;
  };
  privateHouse?: {
    houseArea?: number;
    yardArea?: number;
    pool?: boolean;
    fruitTrees?: boolean;
    renovation?: string;
  };
  landPlot?: {
    landArea?: number;
    landCategory?: LandCategory;
    landUsage?: CommercialStatus;
    forInvestment?: boolean;
    canBeDivided?: boolean;
  };
  commercial?: {
    area?: number;
    parking?: boolean;
    airConditioner?: boolean;
    renovation?: string;
  };
};

export type DeletePropertyImageResponse = {
  message: string;
};

export type NestHttpExceptionBody = {
  statusCode: number;
  message: string | string[];
  error: string;
};
