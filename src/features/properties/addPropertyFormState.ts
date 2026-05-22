import type { DealType } from "@/features/properties/dealType";
import type { GeorgianCity } from "@/features/properties/addPropertyFormOptions";
import type { LabelSelection } from "@/features/labels/labelTypes";
import type {
  BuildingCondition,
  CommercialStatus,
  HotelScope,
  KitchenType,
  LandCategory,
  PropertyStatus,
  PropertyType,
  Renovation,
} from "@/features/properties/types";

export type AddPropertyActiveSubtype =
  | "apartment"
  | "privateHouse"
  | "landPlot"
  | "commercial";

export type ExternalIdPlatform = "MYHOME" | "SSGE";

export type ExternalIdFormRow = {
  localId: string;
  platform: ExternalIdPlatform;
  value: string;
  enteredAt: string;
  archivedAt: string | null;
};

export type FormState = {
  propertyType: PropertyType;
  hotelScope: HotelScope | "";
  dealType: DealType;
  listingLifecycleStatus: PropertyStatus | "";
  verificationReminderLocal: string;
  city: GeorgianCity;
  district: string;
  districtGroup: string;
  address: string;
  selectedStreetId: string | null;
  labels: LabelSelection[];
  pricePublic: string;
  ownerName: string;
  ownerPhones: string[];
  cadastralCode: string;
  priceInternal: string;
  ownerWhatsapp: string;
  myHomeId: string;
  ssGeId: string;
  externalIds: ExternalIdFormRow[];
  publicComment: string;
  internalText: string;
  privateComment: string;
  apartment: {
    buildingCondition: BuildingCondition;
    totalArea: string;
    rooms: string;
    bedrooms: string;
    floor: string;
    totalFloors: string;
    ceilingHeight: string;
    balconyArea: string;
    needsVerification: string[];
    elevator: boolean;
    centralHeating: boolean;
    airConditioner: boolean;
    kitchenType: KitchenType;
    furnished: boolean;
    parkingSpaces: string;
    buildingNumber: string;
    project: string;
    renovation: Renovation | "";
    petsAllowed: boolean;
    minRentalPeriod: string;
  };
  privateHouse: {
    buildingCondition: BuildingCondition;
    houseArea: string;
    yardArea: string;
    totalArea: string;
    rooms: string;
    bedrooms: string;
    balconyArea: string;
    needsVerification: string[];
    centralHeating: boolean;
    airConditioner: boolean;
    furnished: boolean;
    parkingSpaces: string;
    pool: boolean;
    fruitTrees: boolean;
    electricity: boolean;
    water: boolean;
    gas: boolean;
    sewage: boolean;
    renovation: Renovation | "";
    petsAllowed: boolean;
    minRentalPeriod: string;
  };
  landPlot: {
    landArea: string;
    landCategory: LandCategory | "";
    landUsage: CommercialStatus | "";
    forInvestment: boolean;
    approvedProject: boolean;
    canBeDivided: boolean;
    fruitTrees: boolean;
    electricity: boolean;
    water: boolean;
    gas: boolean;
    sewage: boolean;
    minRentalPeriod: string;
  };
  commercial: {
    area: string;
    status: CommercialStatus;
    floor: string;
    totalFloors: string;
    ceilingHeight: string;
    centralHeating: boolean;
    airConditioner: boolean;
    parkingSpaces: string;
    needsVerification: string[];
    electricity: boolean;
    water: boolean;
    gas: boolean;
    sewage: boolean;
    renovation: Renovation | "";
    minRentalPeriod: string;
  };
};

export function initialFormState(): FormState {
  return {
    propertyType: "APARTMENT",
    hotelScope: "",
    dealType: "RENT",
    listingLifecycleStatus: "",
    verificationReminderLocal: "",
    city: "თბილისი",
    district: "",
    districtGroup: "",
    address: "",
    selectedStreetId: null,
    labels: [],
    pricePublic: "",
    ownerName: "",
    ownerPhones: ["+995"],
    cadastralCode: "",
    priceInternal: "",
    ownerWhatsapp: "+995",
    myHomeId: "",
    ssGeId: "",
    externalIds: [],
    publicComment: "",
    internalText: "",
    privateComment: "",
    apartment: {
      buildingCondition: "NEW",
      totalArea: "",
      rooms: "",
      bedrooms: "",
      floor: "",
      totalFloors: "",
      ceilingHeight: "",
      balconyArea: "",
      needsVerification: [],
      elevator: false,
      centralHeating: false,
      airConditioner: false,
      kitchenType: "SEPARATE",
      furnished: false,
      parkingSpaces: "",
      buildingNumber: "",
      project: "Non-standard",
      renovation: "NEW_RENOVATED",
      petsAllowed: false,
      minRentalPeriod: "",
    },
    privateHouse: {
      buildingCondition: "NEW",
      houseArea: "",
      yardArea: "",
      totalArea: "",
      rooms: "",
      bedrooms: "",
      balconyArea: "",
      needsVerification: [],
      centralHeating: false,
      airConditioner: false,
      furnished: false,
      parkingSpaces: "",
      pool: false,
      fruitTrees: false,
      electricity: false,
      water: false,
      gas: false,
      sewage: false,
      renovation: "NEW_RENOVATED",
      petsAllowed: false,
      minRentalPeriod: "",
    },
    landPlot: {
      landArea: "",
      landCategory: "",
      landUsage: "",
      forInvestment: false,
      approvedProject: false,
      canBeDivided: false,
      fruitTrees: false,
      electricity: false,
      water: false,
      gas: false,
      sewage: false,
      minRentalPeriod: "",
    },
    commercial: {
      area: "",
      status: "UNIVERSAL",
      floor: "",
      totalFloors: "",
      ceilingHeight: "",
      centralHeating: false,
      airConditioner: false,
      parkingSpaces: "",
      needsVerification: [],
      electricity: false,
      water: false,
      gas: false,
      sewage: false,
      renovation: "NEW_RENOVATED",
      minRentalPeriod: "",
    },
  };
}

export function subtypeFromPropertyType(
  propertyType: PropertyType,
): AddPropertyActiveSubtype {
  if (propertyType === "APARTMENT") return "apartment";
  if (
    propertyType === "PRIVATE_HOUSE" ||
    propertyType === "COTTAGE" ||
    propertyType === "HOTEL"
  ) {
    return "privateHouse";
  }
  if (propertyType === "LAND_PLOT") return "landPlot";
  return "commercial";
}
