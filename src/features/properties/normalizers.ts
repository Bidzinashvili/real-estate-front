import { parseDealType } from "@/features/properties/dealType";
import type {
  Property,
  PropertyApartment,
  PropertyCommercial,
  PropertyLandPlot,
  PropertyPrivateHouse,
} from "@/features/properties/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return fallback;
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asNullableString(value: unknown): string | null {
  if (value === null) return null;
  return typeof value === "string" ? value : null;
}

function normalizeApartment(value: unknown): PropertyApartment | null {
  if (!isRecord(value)) return null;

  return {
    id: asString(value.id),
    propertyId: asString(value.propertyId),
    buildingNumber: asString(value.buildingNumber),
    buildingCondition: asString(value.buildingCondition),
    totalArea: asNumber(value.totalArea),
    project: asString(value.project),
    renovation: asString(value.renovation),
    rooms: asNumber(value.rooms),
    bedrooms: asNumber(value.bedrooms),
    floor: asNumber(value.floor),
    balcony: asBoolean(value.balcony),
    elevator: asBoolean(value.elevator),
    centralHeating: asBoolean(value.centralHeating),
    airConditioner: asBoolean(value.airConditioner),
    kitchenType: asString(value.kitchenType),
    furniture: asBoolean(value.furniture),
    appliances: asBoolean(value.appliances),
    parking: asBoolean(value.parking),
    petsAllowed: asBoolean(value.petsAllowed),
    minRentalPeriod: asNumber(value.minRentalPeriod),
  };
}

function normalizePrivateHouse(value: unknown): PropertyPrivateHouse | null {
  if (!isRecord(value)) return null;

  return {
    id: asString(value.id),
    propertyId: asString(value.propertyId),
    houseArea: asNumber(value.houseArea),
    yardArea: asNumber(value.yardArea),
    pool: asBoolean(value.pool),
    fruitTrees: asBoolean(value.fruitTrees),
  };
}

function normalizeLandPlot(value: unknown): PropertyLandPlot | null {
  if (!isRecord(value)) return null;

  return {
    id: asString(value.id),
    propertyId: asString(value.propertyId),
    landArea: asNumber(value.landArea),
    forInvestment: asBoolean(value.forInvestment),
    canBeDivided: asBoolean(value.canBeDivided),
  };
}

function normalizeCommercial(value: unknown): PropertyCommercial | null {
  if (!isRecord(value)) return null;

  return {
    id: asString(value.id),
    propertyId: asString(value.propertyId),
    area: asNumber(value.area),
    parking: asBoolean(value.parking),
    airConditioner: asBoolean(value.airConditioner),
  };
}

export function normalizeProperty(value: unknown): Property | null {
  if (!isRecord(value)) return null;

  const rawImages = Array.isArray(value.images) ? value.images : [];
  const images = rawImages.filter((item): item is string => typeof item === "string");

  return {
    id: asString(value.id),
    propertyType: asString(value.propertyType),
    dealType: parseDealType(value.dealType),
    city: asString(value.city),
    district: asString(value.district),
    address: asString(value.address),
    cadastralCode: asString(value.cadastralCode),
    pricePublic: asNumber(value.pricePublic),
    priceInternal: asNumber(value.priceInternal),
    ownerName: asString(value.ownerName),
    ownerPhone: asString(value.ownerPhone),
    ownerWhatsapp: asString(value.ownerWhatsapp),
    ourSiteId: asString(value.ourSiteId),
    myHomeId: asString(value.myHomeId),
    ssGeId: asString(value.ssGeId),
    description: asString(value.description),
    comment: asNullableString(value.comment),
    internalComment: asNullableString(value.internalComment),
    reminderDate: asNullableString(value.reminderDate),
    commentDate: asNullableString(value.commentDate),
    images,
    createdAt: asNullableString(value.createdAt) ?? "",
    updatedAt: asNullableString(value.updatedAt) ?? "",
    userId: asString(value.userId),
    apartment: normalizeApartment(value.apartment),
    privateHouse: normalizePrivateHouse(value.privateHouse),
    landPlot: normalizeLandPlot(value.landPlot),
    commercial: normalizeCommercial(value.commercial),
  };
}

export function normalizePropertiesResponse(data: unknown): Property[] {
  const list = Array.isArray(data)
    ? data
    : isRecord(data) && Array.isArray(data.properties)
      ? data.properties
      : null;

  if (!list) {
    throw new Error("Invalid properties response format.");
  }

  return list
    .map((item) => normalizeProperty(item))
    .filter((item): item is Property => item !== null);
}

