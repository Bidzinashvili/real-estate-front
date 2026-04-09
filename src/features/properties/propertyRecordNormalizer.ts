import { parseDealType } from "@/features/properties/dealType";
import {
  isBuildingCondition,
  isCommercialStatus,
  isKitchenType,
  isLandCategory,
  parsePropertyType,
} from "@/features/properties/propertyModelTypes";
import type {
  BuildingCondition,
  CommercialStatus,
  KitchenType,
  LandCategory,
  Property,
  PropertyApartment,
  PropertyCommercial,
  PropertyLandPlot,
  PropertyListingImage,
  PropertyPrivateHouse,
} from "@/features/properties/propertyModelTypes";
import {
  asBoolean,
  asNullableString,
  asNumber,
  asString,
  isJsonObject,
} from "@/shared/lib/jsonValue";
import type { JsonValue } from "@/shared/lib/jsonValue";

function parseBuildingCondition(value: JsonValue | undefined): BuildingCondition {
  const candidate = typeof value === "string" ? value.trim() : "";
  return isBuildingCondition(candidate) ? candidate : "NEW";
}

function parseKitchenType(value: JsonValue | undefined): KitchenType {
  const candidate = typeof value === "string" ? value.trim() : "";
  return isKitchenType(candidate) ? candidate : "SEPARATE";
}

function parseLandCategory(value: JsonValue | undefined): LandCategory {
  const candidate = typeof value === "string" ? value.trim() : "";
  return isLandCategory(candidate) ? candidate : "AGRICULTURAL";
}

function parseCommercialStatus(value: JsonValue | undefined): CommercialStatus {
  const candidate = typeof value === "string" ? value.trim() : "";
  return isCommercialStatus(candidate) ? candidate : "UNIVERSAL";
}

function asBalconyCount(value: JsonValue | undefined): number {
  if (value === undefined || value === null) {
    return 0;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  const parsed = asNumber(value, 0);
  return Math.max(0, Math.trunc(parsed));
}

function asNullableBoolean(value: JsonValue | undefined): boolean | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return value;
  return null;
}

function asNullableNumber(value: JsonValue | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function legacyImageIdFromUrl(url: string): string {
  const pathOnly = url.split("?")[0] ?? url;
  const segment = pathOnly.split("/").pop();
  return segment && segment.length > 0 ? segment : url;
}

function normalizeImages(value: JsonValue | undefined): PropertyListingImage[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item): PropertyListingImage | null => {
      if (typeof item === "string") {
        const url = item.trim();
        if (!url) return null;
        return {
          id: legacyImageIdFromUrl(url),
          url,
          originalName: "",
        };
      }
      if (!isJsonObject(item)) return null;

      const url = asString(item.url);
      if (!url) return null;

      const idRaw = asString(item.id).trim();
      return {
        id: idRaw || legacyImageIdFromUrl(url),
        url,
        originalName: asString(item.originalName),
      };
    })
    .filter((item): item is PropertyListingImage => item !== null);
}

function normalizeApartment(value: JsonValue | undefined): PropertyApartment | null {
  if (value === undefined) return null;
  if (!isJsonObject(value)) return null;

  return {
    id: asString(value.id),
    propertyId: asString(value.propertyId),
    buildingNumber: asNullableString(value.buildingNumber),
    buildingCondition: parseBuildingCondition(value.buildingCondition),
    totalArea: asNumber(value.totalArea),
    project: asNullableString(value.project),
    renovation: asNullableString(value.renovation),
    rooms: asNumber(value.rooms),
    bedrooms: asNumber(value.bedrooms),
    floor: asNumber(value.floor),
    balcony: asBalconyCount(value.balcony),
    elevator: asBoolean(value.elevator),
    centralHeating: asBoolean(value.centralHeating),
    airConditioner: asBoolean(value.airConditioner),
    kitchenType: parseKitchenType(value.kitchenType),
    furniture: asBoolean(value.furniture),
    appliances: asBoolean(value.appliances),
    parking: asBoolean(value.parking),
    petsAllowed: asNullableBoolean(value.petsAllowed),
    minRentalPeriod: asNullableNumber(value.minRentalPeriod),
  };
}

function normalizePrivateHouse(
  value: JsonValue | undefined,
): PropertyPrivateHouse | null {
  if (value === undefined) return null;
  if (!isJsonObject(value)) return null;

  return {
    id: asString(value.id),
    propertyId: asString(value.propertyId),
    buildingCondition: parseBuildingCondition(value.buildingCondition),
    houseArea: asNumber(value.houseArea),
    yardArea: asNumber(value.yardArea),
    totalArea: asNumber(value.totalArea),
    renovation: asNullableString(value.renovation),
    rooms: asNumber(value.rooms),
    bedrooms: asNumber(value.bedrooms),
    balcony: asBalconyCount(value.balcony),
    centralHeating: asBoolean(value.centralHeating),
    airConditioner: asBoolean(value.airConditioner),
    furniture: asBoolean(value.furniture),
    appliances: asBoolean(value.appliances),
    parking: asBoolean(value.parking),
    pool: asBoolean(value.pool),
    fruitTrees: asBoolean(value.fruitTrees),
    electricity: asBoolean(value.electricity),
    water: asBoolean(value.water),
    gas: asBoolean(value.gas),
    sewage: asBoolean(value.sewage),
    petsAllowed: asNullableBoolean(value.petsAllowed),
    minRentalPeriod: asNullableNumber(value.minRentalPeriod),
  };
}

function normalizeLandPlot(value: JsonValue | undefined): PropertyLandPlot | null {
  if (value === undefined) return null;
  if (!isJsonObject(value)) return null;

  return {
    id: asString(value.id),
    propertyId: asString(value.propertyId),
    landArea: asNumber(value.landArea),
    landCategory: parseLandCategory(value.landCategory),
    landUsage: parseCommercialStatus(value.landUsage),
    forInvestment: asBoolean(value.forInvestment),
    approvedProject: asBoolean(value.approvedProject),
    canBeDivided: asBoolean(value.canBeDivided),
    fruitTrees: asBoolean(value.fruitTrees),
    electricity: asBoolean(value.electricity),
    water: asBoolean(value.water),
    gas: asBoolean(value.gas),
    sewage: asBoolean(value.sewage),
  };
}

function normalizeCommercial(value: JsonValue | undefined): PropertyCommercial | null {
  if (value === undefined) return null;
  if (!isJsonObject(value)) return null;

  return {
    id: asString(value.id),
    propertyId: asString(value.propertyId),
    area: asNumber(value.area),
    status: parseCommercialStatus(value.status),
    floor: asNumber(value.floor),
    renovation: asNullableString(value.renovation),
    centralHeating: asBoolean(value.centralHeating),
    airConditioner: asBoolean(value.airConditioner),
    parking: asBoolean(value.parking),
    electricity: asBoolean(value.electricity),
    water: asBoolean(value.water),
    gas: asBoolean(value.gas),
    sewage: asBoolean(value.sewage),
  };
}

export function normalizeProperty(value: JsonValue): Property | null {
  if (!isJsonObject(value)) return null;

  const images = normalizeImages(value.images);

  return {
    id: asString(value.id),
    propertyType: parsePropertyType(value.propertyType),
    dealType: parseDealType(value.dealType),
    city: asString(value.city),
    district: asString(value.district),
    address: asString(value.address),
    title: asNullableString(value.title),
    cadastralCode: asNullableString(value.cadastralCode),
    pricePublic: asNumber(value.pricePublic),
    priceInternal:
      value.priceInternal === null || value.priceInternal === undefined
        ? null
        : asNumber(value.priceInternal),
    ownerName: asString(value.ownerName),
    ownerPhone: asString(value.ownerPhone),
    ownerWhatsapp: asNullableString(value.ownerWhatsapp),
    ourSiteId: asNullableString(value.ourSiteId),
    myHomeId: asNullableString(value.myHomeId),
    ssGeId: asNullableString(value.ssGeId),
    description: asNullableString(value.description),
    comment: asNullableString(value.comment),
    internalComment: asNullableString(value.internalComment),
    reminderDate: asNullableString(value.reminderDate),
    commentDate: asNullableString(value.commentDate),
    images,
    createdAt: asNullableString(value.createdAt) ?? "",
    updatedAt: asNullableString(value.updatedAt) ?? "",
    deletedAt: asNullableString(value.deletedAt),
    userId: asString(value.userId),
    apartment: normalizeApartment(value.apartment),
    privateHouse: normalizePrivateHouse(value.privateHouse),
    landPlot: normalizeLandPlot(value.landPlot),
    commercial: normalizeCommercial(value.commercial),
  };
}
