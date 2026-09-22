import type { DealType } from "@/features/properties/dealType";
import {
  DEFAULT_NEW_APARTMENT_BATHROOM_COUNT,
  DEFAULT_NEW_APARTMENT_KITCHEN_TYPE,
  TBILISI_CITY,
  type GeorgianCity,
} from "@/features/properties/addPropertyFormOptions";
import type { LabelSelection } from "@/features/labels/labelTypes";
import type { PropertyFieldLocks } from "@/features/matching/matchingEnums";
import type { SupportedListingCurrency } from "@/features/currency/types";
import { DEFAULT_PROPERTY_CURRENCY } from "@/features/currency/types";
import {
  DEFAULT_LISTING_PARKING,
  type BuildingAgeType,
  type BuildingCondition,
  type CommercialStatus,
  type ExternalIdPlatform,
  type HotelScope,
  type KitchenType,
  type LandCategory,
  type ListingParking,
  type ListingParkingType,
  type PropertyType,
  type Renovation,
} from "@/features/properties/types";
import type { PropertyOwnerAssignment } from "@/features/propertyOwners/types";
import { emptyOwnerAssignment } from "@/features/propertyOwners/ownerContactDrafts";
import { INTERNAL_NON_STANDARD_PROJECT } from "@/features/properties/projectName";
import { DEFAULT_NEW_BALCONY_NEEDS_VERIFICATION } from "@/features/properties/listingBalcony";

export type { ExternalIdPlatform };

export type AddPropertyActiveSubtype =
  | "apartment"
  | "privateHouse"
  | "landPlot"
  | "commercial";

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
  hideFromOthers: boolean;
  city: GeorgianCity;
  district: string;
  districtGroup: string;
  address: string;
  selectedStreetId: string | null;
  labels: LabelSelection[];
  pricePublic: string;
  currency: SupportedListingCurrency;
  ownerAssignment: PropertyOwnerAssignment;
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
  fieldLocks: PropertyFieldLocks;
  apartment: {
    buildingCondition: BuildingCondition;
    buildingAgeType: BuildingAgeType | "";
    totalArea: string;
    rooms: string;
    bedrooms: string;
    floor: string;
    totalFloors: string;
    ceilingHeight: string;
    balconyCount: number | null;
    balconyArea: string;
    veranda: boolean;
    needsVerification: string[];
    elevator: boolean | null;
    centralHeating: boolean | null;
    airConditioner: boolean | null;
    kitchenType: KitchenType;
    furnished: boolean | null;
    parking: ListingParking;
    parkingTypes: ListingParkingType[];
    parkingSpaces: string;
    buildingNumber: string;
    project: string;
    renovation: Renovation | "";
    petsAllowed: boolean | null;
    minRentalPeriod: string;
    goodView: boolean | null;
    bathrooms: string;
  };
  privateHouse: {
    buildingCondition: BuildingCondition;
    houseArea: string;
    yardArea: string;
    totalArea: string;
    rooms: string;
    bedrooms: string;
    balconyCount: number | null;
    balconyArea: string;
    veranda: boolean;
    needsVerification: string[];
    centralHeating: boolean;
    airConditioner: boolean;
    furnished: boolean;
    parking: ListingParking;
    parkingTypes: ListingParkingType[];
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
    parking: ListingParking;
    parkingTypes: ListingParkingType[];
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
    hideFromOthers: false,
    city: TBILISI_CITY,
    district: "",
    districtGroup: "",
    address: "",
    selectedStreetId: null,
    labels: [],
    pricePublic: "",
    currency: DEFAULT_PROPERTY_CURRENCY,
    ownerAssignment: emptyOwnerAssignment(),
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
    fieldLocks: {},
    apartment: {
      buildingCondition: "NEW",
      buildingAgeType: "",
      totalArea: "",
      rooms: "",
      bedrooms: "",
      floor: "",
      totalFloors: "",
      ceilingHeight: "",
      balconyCount: null,
      balconyArea: "",
      veranda: false,
      needsVerification: [...DEFAULT_NEW_BALCONY_NEEDS_VERIFICATION],
      elevator: null,
      centralHeating: null,
      airConditioner: null,
      kitchenType: DEFAULT_NEW_APARTMENT_KITCHEN_TYPE,
      furnished: null,
      parking: DEFAULT_LISTING_PARKING,
      parkingTypes: [],
      parkingSpaces: "",
      buildingNumber: "",
      project: INTERNAL_NON_STANDARD_PROJECT,
      renovation: "NEW_RENOVATED",
      petsAllowed: null,
      minRentalPeriod: "",
      goodView: null,
      bathrooms: DEFAULT_NEW_APARTMENT_BATHROOM_COUNT,
    },
    privateHouse: {
      buildingCondition: "NEW",
      houseArea: "",
      yardArea: "",
      totalArea: "",
      rooms: "",
      bedrooms: "",
      balconyCount: null,
      balconyArea: "",
      veranda: false,
      needsVerification: [...DEFAULT_NEW_BALCONY_NEEDS_VERIFICATION],
      centralHeating: false,
      airConditioner: false,
      furnished: false,
      parking: DEFAULT_LISTING_PARKING,
      parkingTypes: [],
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
      parking: DEFAULT_LISTING_PARKING,
      parkingTypes: [],
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
