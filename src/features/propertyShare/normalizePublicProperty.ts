import { isDealType, parseDealType } from "@/features/properties/dealType";
import {
  isHotelScope,
  isPropertyType,
  parseBuildingAgeType,
  parsePropertyType,
} from "@/features/properties/propertyModelTypes";
import {
  isPropertyStatus,
  parsePropertyStatus,
} from "@/features/properties/propertyStatus";
import {
  asBoolean,
  asNullableString,
  asNumber,
  asString,
  isJsonObject,
} from "@/shared/lib/jsonValue";
import type { JsonValue } from "@/shared/lib/jsonValue";
import type {
  PublicApartment,
  PublicCommercial,
  PublicLandPlot,
  PublicPrivateHouse,
  PublicProperty,
  PublicPropertyImage,
} from "@/features/propertyShare/publicPropertyTypes";

function asNullableBoolean(value: JsonValue | undefined): boolean | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "boolean") {
    return value;
  }
  return null;
}

function asNullableNumber(value: JsonValue | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsedNumber = Number(value.trim());
    if (Number.isFinite(parsedNumber)) {
      return parsedNumber;
    }
  }
  return null;
}

function legacyImageIdFromUrl(url: string): string {
  const pathOnly = url.split("?")[0] ?? url;
  const segment = pathOnly.split("/").pop();
  return segment && segment.length > 0 ? segment : url;
}

function normalizeImages(value: unknown): PublicPropertyImage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item): PublicPropertyImage | null => {
      if (typeof item === "string") {
        const url = item.trim();
        if (!url) {
          return null;
        }
        return {
          id: legacyImageIdFromUrl(url),
          url,
          originalName: "",
        };
      }
      if (!isJsonObject(item)) {
        return null;
      }
      const url = asString(item.url).trim();
      if (!url) {
        return null;
      }
      const imageId = asString(item.id).trim();
      return {
        id: imageId || legacyImageIdFromUrl(url),
        url,
        originalName: asString(item.originalName),
      };
    })
    .filter((item): item is PublicPropertyImage => item !== null);
}

function normalizeApartment(value: unknown): PublicApartment | null {
  if (!isJsonObject(value)) {
    return null;
  }

  return {
    buildingCondition: asNullableString(value.buildingCondition),
    buildingAgeType: parseBuildingAgeType(value.buildingAgeType),
    totalArea: asNullableNumber(value.totalArea),
    renovation: asNullableString(value.renovation),
    rooms: asNullableNumber(value.rooms),
    bedrooms: asNullableNumber(value.bedrooms),
    floor: asNullableNumber(value.floor),
    totalFloors: asNullableNumber(value.totalFloors),
    ceilingHeight: asNullableNumber(value.ceilingHeight),
    balconyArea: asNullableNumber(value.balconyArea ?? value.balcony),
    elevator: asNullableBoolean(value.elevator),
    goodView: asNullableBoolean(value.goodView),
    bathrooms: asNullableNumber(value.bathrooms),
    centralHeating: asNullableBoolean(value.centralHeating),
    airConditioner: asNullableBoolean(value.airConditioner),
    kitchenType: asNullableString(value.kitchenType),
    furnished: asNullableBoolean(value.furnished),
    parkingSpaces: asNullableNumber(value.parkingSpaces),
    petsAllowed: asNullableBoolean(value.petsAllowed),
    minRentalPeriod: asNullableNumber(value.minRentalPeriod),
    project: asNullableString(value.project),
    buildingNumber: asNullableString(value.buildingNumber),
  };
}

function normalizePrivateHouse(value: unknown): PublicPrivateHouse | null {
  if (!isJsonObject(value)) {
    return null;
  }

  return {
    buildingCondition: asNullableString(value.buildingCondition),
    houseArea: asNullableNumber(value.houseArea),
    yardArea: asNullableNumber(value.yardArea),
    totalArea: asNullableNumber(value.totalArea),
    renovation: asNullableString(value.renovation),
    rooms: asNullableNumber(value.rooms),
    bedrooms: asNullableNumber(value.bedrooms),
    balconyArea: asNullableNumber(value.balconyArea ?? value.balcony),
    centralHeating: asNullableBoolean(value.centralHeating),
    airConditioner: asNullableBoolean(value.airConditioner),
    furnished: asNullableBoolean(value.furnished),
    parkingSpaces: asNullableNumber(value.parkingSpaces),
    pool: asNullableBoolean(value.pool),
    fruitTrees: asNullableBoolean(value.fruitTrees),
    electricity: asNullableBoolean(value.electricity),
    water: asNullableBoolean(value.water),
    gas: asNullableBoolean(value.gas),
    sewage: asNullableBoolean(value.sewage),
    petsAllowed: asNullableBoolean(value.petsAllowed),
    minRentalPeriod: asNullableNumber(value.minRentalPeriod),
  };
}

function normalizeLandPlot(value: unknown): PublicLandPlot | null {
  if (!isJsonObject(value)) {
    return null;
  }

  return {
    landArea: asNullableNumber(value.landArea),
    landCategory: asNullableString(value.landCategory),
    landUsage: asNullableString(value.landUsage),
    forInvestment: asNullableBoolean(value.forInvestment),
    approvedProject: asNullableBoolean(value.approvedProject),
    canBeDivided: asNullableBoolean(value.canBeDivided),
    fruitTrees: asNullableBoolean(value.fruitTrees),
    electricity: asNullableBoolean(value.electricity),
    water: asNullableBoolean(value.water),
    gas: asNullableBoolean(value.gas),
    sewage: asNullableBoolean(value.sewage),
    minRentalPeriod: asNullableNumber(value.minRentalPeriod),
  };
}

function normalizeCommercial(value: unknown): PublicCommercial | null {
  if (!isJsonObject(value)) {
    return null;
  }

  return {
    area: asNullableNumber(value.area),
    status: asNullableString(value.status),
    floor: asNullableNumber(value.floor),
    totalFloors: asNullableNumber(value.totalFloors),
    ceilingHeight: asNullableNumber(value.ceilingHeight),
    renovation: asNullableString(value.renovation),
    centralHeating: asNullableBoolean(value.centralHeating),
    airConditioner: asNullableBoolean(value.airConditioner),
    furnished: asNullableBoolean(value.furnished),
    parkingSpaces: asNullableNumber(value.parkingSpaces),
    electricity: asNullableBoolean(value.electricity),
    water: asNullableBoolean(value.water),
    gas: asNullableBoolean(value.gas),
    sewage: asNullableBoolean(value.sewage),
    minRentalPeriod: asNullableNumber(value.minRentalPeriod),
  };
}

export function normalizePublicProperty(value: unknown): PublicProperty | null {
  if (!isJsonObject(value)) {
    return null;
  }

  const id = asString(value.id).trim();
  if (!id) {
    return null;
  }

  const shareId = asString(value.shareId).trim() || id;
  const propertyTypeRaw = asString(value.propertyType).trim();
  const dealTypeRaw = asString(value.dealType).trim();
  const statusRaw = asString(value.status).trim();
  const hotelScopeRaw = asString(value.hotelScope).trim();

  return {
    id,
    shareId,
    available: asBoolean(value.available, false),
    status: isPropertyStatus(statusRaw) ? statusRaw : parsePropertyStatus(value.status),
    propertyType: isPropertyType(propertyTypeRaw)
      ? propertyTypeRaw
      : parsePropertyType(value.propertyType),
    dealType: isDealType(dealTypeRaw) ? dealTypeRaw : parseDealType(value.dealType),
    hotelScope: isHotelScope(hotelScopeRaw) ? hotelScopeRaw : null,
    city: asString(value.city),
    district: asString(value.district),
    address: asString(value.address),
    pricePublic: asNumber(value.pricePublic),
    publicComment: asNullableString(value.publicComment),
    images: normalizeImages(value.images),
    apartment: normalizeApartment(value.apartment),
    privateHouse: normalizePrivateHouse(value.privateHouse),
    landPlot: normalizeLandPlot(value.landPlot),
    commercial: normalizeCommercial(value.commercial),
  };
}
