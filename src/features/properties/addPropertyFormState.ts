import type { DealType } from "@/features/properties/dealType";
import type {
  BuildingCondition,
  CommercialStatus,
  KitchenType,
  LandCategory,
  PropertyType,
  Renovation,
} from "@/features/properties/types";

export type AddPropertyActiveSubtype =
  | "apartment"
  | "privateHouse"
  | "landPlot"
  | "commercial";

export type FormState = {
  propertyType: PropertyType;
  dealType: DealType;
  city: string;
  district: string;
  address: string;
  pricePublic: string;
  ownerName: string;
  ownerPhone: string;
  cadastralCode: string;
  priceInternal: string;
  ownerWhatsapp: string;
  myHomeId: string;
  ssGeId: string;
  description: string;
  apartment: {
    buildingCondition: BuildingCondition;
    totalArea: string;
    rooms: string;
    bedrooms: string;
    floor: string;
    balcony: number;
    elevator: boolean;
    centralHeating: boolean;
    airConditioner: boolean;
    kitchenType: KitchenType;
    furniture: boolean;
    appliances: boolean;
    parking: boolean;
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
  };
  commercial: {
    area: string;
    status: CommercialStatus;
    floor: string;
    centralHeating: boolean;
    airConditioner: boolean;
    parking: boolean;
    electricity: boolean;
    water: boolean;
    gas: boolean;
    sewage: boolean;
    renovation: Renovation | "";
  };
};

export function initialFormState(): FormState {
  return {
    propertyType: "APARTMENT",
    dealType: "RENT",
    city: "Tbilisi",
    district: "",
    address: "",
    pricePublic: "",
    ownerName: "",
    ownerPhone: "",
    cadastralCode: "",
    priceInternal: "",
    ownerWhatsapp: "",
    myHomeId: "",
    ssGeId: "",
    description: "",
    apartment: {
      buildingCondition: "NEW",
      totalArea: "",
      rooms: "",
      bedrooms: "",
      floor: "",
      balcony: 0,
      elevator: false,
      centralHeating: false,
      airConditioner: false,
      kitchenType: "SEPARATE",
      furniture: false,
      appliances: false,
      parking: false,
      buildingNumber: "",
      project: "",
      renovation: "",
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
      balcony: 0,
      centralHeating: false,
      airConditioner: false,
      furniture: false,
      appliances: false,
      parking: false,
      pool: false,
      fruitTrees: false,
      electricity: false,
      water: false,
      gas: false,
      sewage: false,
      renovation: "",
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
    },
    commercial: {
      area: "",
      status: "UNIVERSAL",
      floor: "",
      centralHeating: false,
      airConditioner: false,
      parking: false,
      electricity: false,
      water: false,
      gas: false,
      sewage: false,
      renovation: "",
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
