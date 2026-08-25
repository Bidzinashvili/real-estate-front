import type { DealType } from "@/features/properties/dealType";
import type { LabelDto } from "@/features/labels/labelTypes";
import type { PropertyStatus } from "@/features/properties/propertyStatus";
import type {
  BuildingCondition,
  CommercialStatus,
  HotelScope,
  KitchenType,
  LandCategory,
  PropertyType,
} from "@/features/properties/propertyModelTypes";
import type { PropertyFieldLocks } from "@/features/matching/matchingEnums";
import type {
  EntityVerificationFields,
  OutcomeSource,
  ReminderConfigPayload,
} from "@/features/lifecycle/lifecycleEnums";

export type PropertySortBy = "createdAt" | "pricePublic";

export type SortOrder = "asc" | "desc";

export type GetPropertiesQueryApi = {
  search?: string;
  type?: PropertyType;
  dealType?: DealType;
  status?: PropertyStatus;
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
  labelIds?: string[];
  labelNames?: string[];
  archived?: boolean;
};

export type PropertyImageEntry = {
  id: string;
  url: string;
  originalName: string;
};

export type PropertyExternalIdApi = {
  id: string;
  platform: "MYHOME" | "SSGE";
  value: string;
  enteredAt: string;
  archivedAt: string | null;
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
  totalFloors: number;
  ceilingHeight: number | null;
  balconyArea: number | null;
  needsVerification: string[];
  elevator: boolean | null;
  centralHeating: boolean | null;
  airConditioner: boolean | null;
  kitchenType: KitchenType;
  furnished: boolean | null;
  parkingSpaces: number | null;
  petsAllowed: boolean | null;
  minRentalPeriod: number | null;
  goodView: boolean | null;
  bathrooms: number | null;
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
  balconyArea: number | null;
  needsVerification: string[];
  centralHeating: boolean;
  airConditioner: boolean;
  furnished: boolean;
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
  minRentalPeriod: number | null;
};

export type CommercialApi = {
  id: string;
  propertyId: string;
  area: number;
  status: CommercialStatus;
  floor: number;
  totalFloors: number | null;
  ceilingHeight: number | null;
  renovation: string | null;
  needsVerification: string[];
  centralHeating: boolean;
  airConditioner: boolean;
  parkingSpaces: number | null;
  electricity: boolean;
  water: boolean;
  gas: boolean;
  sewage: boolean;
  minRentalPeriod: number | null;
};

export type PropertyApi = EntityVerificationFields & {
  id: string;
  propertyType: PropertyType;
  hotelScope?: HotelScope | null;
  dealType: DealType;
  status: PropertyStatus;
  city: string;
  district: string;
  address: string;
  streetId?: string | null;
  title: string | null;
  cadastralCode: string | null;
  pricePublic: number;
  priceInternal: number | null;
  ownerName: string;
  ownerPhones: string[];
  ownerWhatsapp: string | null;
  ourSiteId: string | null;
  myHomeId: string | null;
  ssGeId: string | null;
  externalIds: PropertyExternalIdApi[];
  description: string | null;
  publicComment: string | null;
  privateComment: string | null;
  internalText: string | null;
  comment: string | null;
  internalComment: string | null;
  commentDate: string | null;
  tenantClientId?: string | null;
  rentalDurationMonths?: number | null;
  archivedAt: string | null;
  labels?: LabelDto[];
  images: PropertyImageEntry[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: string;
  apartment: ApartmentApi | null;
  privateHouse: PrivateHouseApi | null;
  landPlot: LandPlotApi | null;
  commercial: CommercialApi | null;
  fieldLocks?: PropertyFieldLocks;
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
  status?: PropertyStatus;
  reminder?: ReminderConfigPayload;
  city: string;
  district?: string;
  address: string;
  cadastralCode?: string;
  pricePublic: number;
  priceInternal?: number;
  ownerName: string;
  ownerPhones: string[];
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
  images?: PropertyImageInputWire[];
  fieldLocks?: PropertyFieldLocks;
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
  totalFloors: number;
  ceilingHeight?: number;
  balconyArea?: number;
  needsVerification?: string[];
  elevator?: boolean | null;
  centralHeating?: boolean | null;
  airConditioner?: boolean | null;
  kitchenType: KitchenType;
  furnished?: boolean | null;
  parkingSpaces?: number;
  petsAllowed?: boolean | null;
  minRentalPeriod?: number;
  goodView?: boolean | null;
  bathrooms?: number;
};

export type CreatePrivateHousePayload = {
  buildingCondition: BuildingCondition;
  houseArea: number;
  yardArea: number;
  totalArea: number;
  renovation?: string;
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
  minRentalPeriod?: number;
};

export type CreateCommercialPayload = {
  area: number;
  status: CommercialStatus;
  floor: number;
  totalFloors: number;
  ceilingHeight?: number;
  renovation?: string;
  needsVerification?: string[];
  centralHeating: boolean;
  airConditioner: boolean;
  parkingSpaces?: number;
  electricity: boolean;
  water: boolean;
  gas: boolean;
  sewage: boolean;
  minRentalPeriod?: number;
};

export type CreatePropertyRequestBody = CreatePropertyBase &
  (
    | { propertyType?: "APARTMENT"; apartment: CreateApartmentPayload }
    | {
        propertyType: "PRIVATE_HOUSE" | "COTTAGE";
        privateHouse: CreatePrivateHousePayload;
      }
    | {
        propertyType: "HOTEL";
        hotelScope: HotelScope;
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
  status?: PropertyStatus;
  outcomeSource?: OutcomeSource;
  reminder?: ReminderConfigPayload;
  tenantClientId?: string | null;
  rentalDurationMonths?: number | null;
  dealType?: DealType;
  hotelScope?: HotelScope;
  city?: string;
  district?: string;
  address?: string;
  pricePublic?: number;
  priceInternal?: number;
  publicComment?: string;
  privateComment?: string;
  internalText?: string;
  addLabels?: string[];
  removeLabelIds?: string[];
  images?: PropertyImageInputWire[];
  apartment?: {
    project?: string;
    totalArea?: number;
    rooms?: number;
    bedrooms?: number;
    totalFloors?: number;
    ceilingHeight?: number;
    balconyArea?: number | null;
    needsVerification?: string[];
    floor?: number;
    renovation?: string;
    buildingCondition?: BuildingCondition;
    furnished?: boolean | null;
    parkingSpaces?: number | null;
    minRentalPeriod?: number | null;
    elevator?: boolean | null;
    centralHeating?: boolean | null;
    airConditioner?: boolean | null;
    kitchenType?: KitchenType;
    goodView?: boolean | null;
    bathrooms?: number | null;
    petsAllowed?: boolean | null;
  };
  fieldLocks?: PropertyFieldLocks;
  privateHouse?: {
    houseArea?: number;
    yardArea?: number;
    balconyArea?: number | null;
    parkingSpaces?: number | null;
    needsVerification?: string[];
    pool?: boolean;
    fruitTrees?: boolean;
    renovation?: string;
    furnished?: boolean;
    minRentalPeriod?: number | null;
  };
  landPlot?: {
    landArea?: number;
    landCategory?: LandCategory;
    landUsage?: CommercialStatus;
    forInvestment?: boolean;
    canBeDivided?: boolean;
    minRentalPeriod?: number | null;
  };
  commercial?: {
    area?: number;
    totalFloors?: number;
    ceilingHeight?: number;
    parkingSpaces?: number | null;
    needsVerification?: string[];
    airConditioner?: boolean;
    renovation?: string;
    minRentalPeriod?: number | null;
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
