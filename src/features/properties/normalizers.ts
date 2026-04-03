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

function normalizeImages(
  value: unknown,
): Array<{ url: string; originalName: string }> {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") {
        return { url: item, originalName: "" };
      }
      if (!isRecord(item)) return null;

      const url = asString(item.url);
      if (!url) return null;

      return {
        url,
        originalName: asString(item.originalName),
      };
    })
    .filter(
      (item): item is { url: string; originalName: string } =>
        item !== null,
    );
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

  const images = normalizeImages(value.images);

  return {
    id: asString(value.id),
    propertyType: asString(value.propertyType) as Property["propertyType"],
    dealType: parseDealType(value.dealType),
    city: asString(value.city),
    district: asString(value.district),
    address: asString(value.address),
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

/**
 * Normalizes POST /properties response bodies: plain row, single-element array,
 * or common wrapper keys (`property`, `data`).
 */
export function normalizeCreatePropertyResponse(data: unknown): Property | null {
  if (data == null) {
    return null;
  }

  if (Array.isArray(data)) {
    if (data.length !== 1) {
      return null;
    }
    return normalizeProperty(data[0]);
  }

  if (!isRecord(data)) {
    return null;
  }

  const nested = data.property ?? data.data;
  if (nested !== undefined && nested !== null) {
    return normalizeProperty(nested);
  }

  return normalizeProperty(data);
}

