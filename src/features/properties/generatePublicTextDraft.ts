import { omitUnspecifiedBoolean } from "@/features/properties/apartmentVerification";
import type { FormState } from "@/features/properties/addPropertyFormState";
import type { PropertyFormValues } from "@/features/properties/payloadBuilder";
import {
  isBuildingAgeType,
  isKitchenType,
  type BuildingAgeType,
  type KitchenType,
} from "@/features/properties/types";
import type {
  GeneratePublicTextApartmentDraft,
  GeneratePublicTextDraft,
} from "@/features/properties/propertyApiTypes";

function parseOptionalFiniteNumber(
  rawValue: string | number | null | undefined,
): number | undefined {
  if (typeof rawValue === "number") {
    return Number.isFinite(rawValue) ? rawValue : undefined;
  }
  if (typeof rawValue !== "string") {
    return undefined;
  }
  const trimmedValue = rawValue.trim();
  if (trimmedValue === "") {
    return undefined;
  }
  const parsedNumber = Number(trimmedValue);
  return Number.isFinite(parsedNumber) ? parsedNumber : undefined;
}

function parseOptionalInteger(
  rawValue: string | number | null | undefined,
): number | undefined {
  const parsedNumber = parseOptionalFiniteNumber(rawValue);
  if (parsedNumber === undefined || !Number.isInteger(parsedNumber)) {
    return undefined;
  }
  return parsedNumber;
}

type ApartmentDraftSource = {
  buildingAgeType?: BuildingAgeType | "" | null;
  rooms?: string | number | null;
  bedrooms?: string | number | null;
  kitchenType?: KitchenType | null;
  balconyArea?: string | number | null;
  goodView?: boolean | null;
  furnished?: boolean | null;
  airConditioner?: boolean | null;
};

function buildApartmentDraft(
  source: ApartmentDraftSource,
): GeneratePublicTextApartmentDraft | undefined {
  const apartment: GeneratePublicTextApartmentDraft = {};

  if (source.buildingAgeType && isBuildingAgeType(source.buildingAgeType)) {
    apartment.buildingAgeType = source.buildingAgeType;
  }

  const rooms = parseOptionalInteger(source.rooms);
  if (rooms !== undefined) {
    apartment.rooms = rooms;
  }

  const bedrooms = parseOptionalInteger(source.bedrooms);
  if (bedrooms !== undefined) {
    apartment.bedrooms = bedrooms;
  }

  if (source.kitchenType && isKitchenType(source.kitchenType)) {
    apartment.kitchenType = source.kitchenType;
  }

  const balconyArea = parseOptionalFiniteNumber(source.balconyArea);
  if (balconyArea !== undefined) {
    apartment.balconyArea = balconyArea;
  }

  const goodView = omitUnspecifiedBoolean(source.goodView);
  if (goodView !== undefined) {
    apartment.goodView = goodView;
  }

  const furnished = omitUnspecifiedBoolean(source.furnished);
  if (furnished !== undefined) {
    apartment.furnished = furnished;
  }

  const airConditioner = omitUnspecifiedBoolean(source.airConditioner);
  if (airConditioner !== undefined) {
    apartment.airConditioner = airConditioner;
  }

  return Object.keys(apartment).length > 0 ? apartment : undefined;
}

function buildBaseDraft(input: {
  propertyType: GeneratePublicTextDraft["propertyType"];
  dealType: GeneratePublicTextDraft["dealType"];
  district: string;
  pricePublic: string | number | null | undefined;
  ourSiteId?: string | null;
}): GeneratePublicTextDraft {
  const draft: GeneratePublicTextDraft = {
    propertyType: input.propertyType,
    dealType: input.dealType,
  };

  const district = input.district.trim();
  if (district !== "") {
    draft.district = district;
  }

  const pricePublic = parseOptionalFiniteNumber(input.pricePublic);
  if (pricePublic !== undefined) {
    draft.pricePublic = pricePublic;
  }

  const ourSiteId = input.ourSiteId?.trim();
  if (ourSiteId) {
    draft.ourSiteId = ourSiteId;
  }

  return draft;
}

export function buildGeneratePublicTextDraftFromCreateForm(
  form: FormState,
): GeneratePublicTextDraft {
  const draft = buildBaseDraft({
    propertyType: form.propertyType,
    dealType: form.dealType,
    district: form.district,
    pricePublic: form.pricePublic,
  });

  if (form.propertyType === "APARTMENT") {
    const apartment = buildApartmentDraft(form.apartment);
    if (apartment) {
      draft.apartment = apartment;
    }
  }

  return draft;
}

export function buildGeneratePublicTextDraftFromEditForm(
  values: PropertyFormValues,
  ourSiteId?: string | null,
): GeneratePublicTextDraft {
  const draft = buildBaseDraft({
    propertyType: values.propertyType,
    dealType: values.dealType,
    district: values.district,
    pricePublic: values.pricePublic,
    ourSiteId,
  });

  if (values.propertyType === "APARTMENT" && values.apartment) {
    const apartment = buildApartmentDraft(values.apartment);
    if (apartment) {
      draft.apartment = apartment;
    }
  }

  return draft;
}
