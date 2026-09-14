import { isTbilisiCity } from "@/features/properties/addPropertyFormOptions";
import type { DealType } from "@/features/properties/dealType";
import type { LabelSelection } from "@/features/labels/labelTypes";
import type { PropertyFieldLocks } from "@/features/matching/matchingEnums";
import { persistPropertyFieldLocks, buildPropertyFieldLocksUpdate } from "@/features/matching/persistEntityLock";
import { buildPatchNeedsVerification } from "@/features/properties/apartmentVerification";
import type {
  CommercialStatus,
  HotelScope,
  LandCategory,
  PropertyApartmentUpdate,
  PropertyCommercialUpdate,
  PropertyLandPlotUpdate,
  PropertyPrivateHouseUpdate,
  PropertyType,
  PropertyUpdatePayload,
} from "@/features/properties/types";

export type PropertyFormLandPlot = {
  landArea?: number;
  forInvestment: boolean;
  canBeDivided: boolean;
  landCategory: LandCategory | "";
  landUsage: CommercialStatus | "";
  minRentalPeriod?: number;
};

export type PropertyFormValues = {
  propertyType: PropertyType;
  hotelScope: HotelScope | null;
  dealType: DealType;
  city: string;
  district: string;
  address: string;
  selectedStreetId: string | null;
  pricePublic: number | undefined;
  priceInternal: number | undefined;
  publicComment: string;
  privateComment: string;
  internalText: string;
  labels: LabelSelection[];
  apartment: PropertyApartmentUpdate | null;
  privateHouse: PropertyPrivateHouseUpdate | null;
  landPlot: PropertyFormLandPlot | null;
  commercial: PropertyCommercialUpdate | null;
  fieldLocks: PropertyFieldLocks;
};

function addIfChanged<T extends Record<string, unknown>>(
  base: T | null,
  current: T | null,
): T | undefined {
  if (!current) return undefined;

  const result: Record<string, unknown> = {};
  const keys = Object.keys(current) as Array<keyof T>;

  for (const key of keys) {
    const next = current[key];
    const prev = base?.[key];
    if (next === undefined) continue;
    if (typeof next === "number" && Number.isNaN(next)) continue;
    if (next !== prev) {
      result[String(key)] = next;
    }
  }

  return Object.keys(result).length > 0 ? (result as T) : undefined;
}

function collectVerifiedApartmentKeys(
  patch: PropertyApartmentUpdate,
): string[] {
  const verifiedKeys: string[] = [];
  if (patch.elevator === true || patch.elevator === false) verifiedKeys.push("elevator");
  if (patch.centralHeating === true || patch.centralHeating === false) {
    verifiedKeys.push("centralHeating");
  }
  if (patch.airConditioner === true || patch.airConditioner === false) {
    verifiedKeys.push("airConditioner");
  }
  if (patch.furnished === true || patch.furnished === false) verifiedKeys.push("furnished");
  if (patch.petsAllowed === true || patch.petsAllowed === false) {
    verifiedKeys.push("petsAllowed");
  }
  if (patch.goodView === true || patch.goodView === false) verifiedKeys.push("goodView");
  if (typeof patch.parkingSpaces === "number") verifiedKeys.push("parkingSpaces");
  if (typeof patch.balconyArea === "number") verifiedKeys.push("balconyArea");
  return verifiedKeys;
}

function buildApartmentPatch(
  initial: PropertyApartmentUpdate | null,
  current: PropertyApartmentUpdate | null,
): PropertyApartmentUpdate | undefined {
  if (!current) {
    return undefined;
  }

  const initialWithoutNv = initial
    ? { ...initial, needsVerification: undefined }
    : null;
  const currentWithoutNv = { ...current, needsVerification: undefined };
  const valuePatch = addIfChanged(initialWithoutNv, currentWithoutNv);
  const merged = mergeMinRentalPeriodIntoPatch(initial, current, valuePatch) ?? {};
  const verifiedKeysInPatch = collectVerifiedApartmentKeys(merged);
  const needsVerification = buildPatchNeedsVerification({
    initialNeedsVerification: initial?.needsVerification ?? [],
    currentNeedsVerification: current.needsVerification ?? [],
    verifiedKeysInPatch,
  });
  if (needsVerification !== undefined) {
    merged.needsVerification = needsVerification;
  }

  return Object.keys(merged).length > 0 ? merged : undefined;
}

function mergeMinRentalPeriodIntoPatch<T extends Record<string, unknown>>(
  initial: T | null,
  current: T | null,
  patch: Partial<T> | undefined,
): Partial<T> | undefined {
  if (!current) return patch;

  const initialMin = initial?.minRentalPeriod ?? null;
  const currentMin = current.minRentalPeriod ?? null;
  if (initialMin === currentMin) return patch;

  const minPatch = {
    minRentalPeriod:
      current.minRentalPeriod === undefined || current.minRentalPeriod === null
        ? null
        : current.minRentalPeriod,
  } as unknown as Partial<T>;

  return { ...(patch ?? {}), ...minPatch };
}

function buildLandPlotPatch(
  initial: PropertyFormLandPlot | null,
  current: PropertyFormLandPlot | null,
): PropertyLandPlotUpdate | undefined {
  if (!current) return undefined;

  const patch: PropertyLandPlotUpdate = {};

  if (initial?.landArea !== current.landArea) {
    patch.landArea = current.landArea;
  }
  if (initial?.forInvestment !== current.forInvestment) {
    patch.forInvestment = current.forInvestment;
  }
  if (initial?.canBeDivided !== current.canBeDivided) {
    patch.canBeDivided = current.canBeDivided;
  }
  if (
    current.landCategory !== "" &&
    current.landCategory !== initial?.landCategory
  ) {
    patch.landCategory = current.landCategory;
  }
  if (current.landUsage !== "" && current.landUsage !== initial?.landUsage) {
    patch.landUsage = current.landUsage;
  }

  const initialMin = initial?.minRentalPeriod ?? null;
  const currentMin = current.minRentalPeriod ?? null;
  if (initialMin !== currentMin) {
    patch.minRentalPeriod =
      current.minRentalPeriod === undefined || current.minRentalPeriod === null
        ? null
        : current.minRentalPeriod;
  }

  return Object.keys(patch).length > 0 ? patch : undefined;
}

function normalizeLabelName(labelName: string): string {
  return labelName.trim().replace(/\s+/g, " ");
}

function buildLabelUpdatePayload(
  initialLabels: LabelSelection[],
  currentLabels: LabelSelection[],
): Pick<PropertyUpdatePayload, "addLabels" | "removeLabelIds"> {
  const initialLabelIds = new Set(
    initialLabels
      .map((label) => label.id)
      .filter((labelId): labelId is string => typeof labelId === "string" && labelId !== ""),
  );

  const currentLabelIds = new Set(
    currentLabels
      .map((label) => label.id)
      .filter((labelId): labelId is string => typeof labelId === "string" && labelId !== ""),
  );

  const removeLabelIds = initialLabels
    .map((label) => label.id)
    .filter((labelId): labelId is string => typeof labelId === "string" && !currentLabelIds.has(labelId));

  const addLabelsMap = new Map<string, string>();
  for (const label of currentLabels) {
    const normalizedName = normalizeLabelName(label.name);
    if (normalizedName === "") {
      continue;
    }

    if (label.id !== null && initialLabelIds.has(label.id)) {
      continue;
    }

    addLabelsMap.set(normalizedName.toLocaleLowerCase(), normalizedName);
  }

  return {
    addLabels: addLabelsMap.size > 0 ? Array.from(addLabelsMap.values()) : undefined,
    removeLabelIds: removeLabelIds.length > 0 ? removeLabelIds : undefined,
  };
}

export function buildPropertyUpdatePayload(
  initial: PropertyFormValues,
  current: PropertyFormValues,
  listingPropertyType: PropertyType,
): PropertyUpdatePayload {
  const payload: PropertyUpdatePayload = {};

  if (initial.dealType !== current.dealType) {
    payload.dealType = current.dealType;
  }

  if (listingPropertyType === "HOTEL") {
    const initialScope = initial.hotelScope ?? null;
    const currentScope = current.hotelScope ?? null;
    if (initialScope !== currentScope && currentScope !== null) {
      payload.hotelScope = currentScope;
    }
  }

  const nextDistrict = isTbilisiCity(current.city) ? current.district : "";
  if (initial.city !== current.city) payload.city = current.city;
  if (initial.district !== nextDistrict) payload.district = nextDistrict;
  if (initial.address !== current.address) payload.address = current.address;
  if (initial.pricePublic !== current.pricePublic) {
    if (current.pricePublic !== undefined) {
      payload.pricePublic = current.pricePublic;
    }
  }
  if (initial.priceInternal !== current.priceInternal) {
    if (current.priceInternal !== undefined) {
      payload.priceInternal = current.priceInternal;
    }
  }
  if (initial.publicComment !== current.publicComment) {
    payload.publicComment = current.publicComment;
  }
  if (initial.privateComment !== current.privateComment) {
    payload.privateComment = current.privateComment;
  }
  if (initial.internalText !== current.internalText) {
    payload.internalText = current.internalText;
  }

  const labelPatch = buildLabelUpdatePayload(initial.labels, current.labels);
  if (labelPatch.addLabels) {
    payload.addLabels = labelPatch.addLabels;
  }
  if (labelPatch.removeLabelIds) {
    payload.removeLabelIds = labelPatch.removeLabelIds;
  }

  const apartmentPatch = buildApartmentPatch(initial.apartment, current.apartment);
  if (apartmentPatch) payload.apartment = apartmentPatch;

  const privateHousePatch = mergeMinRentalPeriodIntoPatch(
    initial.privateHouse,
    current.privateHouse,
    addIfChanged(initial.privateHouse, current.privateHouse),
  );
  if (privateHousePatch) payload.privateHouse = privateHousePatch;

  const landPlot = buildLandPlotPatch(initial.landPlot, current.landPlot);
  if (landPlot) payload.landPlot = landPlot;

  const commercialPatch = mergeMinRentalPeriodIntoPatch(
    initial.commercial,
    current.commercial,
    addIfChanged(initial.commercial, current.commercial),
  );
  if (commercialPatch) payload.commercial = commercialPatch;

  const currentLocks = buildPropertyFieldLocksUpdate(initial.fieldLocks, current.fieldLocks);
  const initialLocks = persistPropertyFieldLocks(initial.fieldLocks);
  const initialLockJson = JSON.stringify(initialLocks ?? {});
  const currentLockJson = JSON.stringify(currentLocks ?? {});
  if (initialLockJson !== currentLockJson) {
    payload.fieldLocks = currentLocks ?? {};
  }

  return payload;
}

