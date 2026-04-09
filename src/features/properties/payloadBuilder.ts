import type { DealType } from "@/features/properties/dealType";
import type {
  CommercialStatus,
  LandCategory,
  PropertyApartmentUpdate,
  PropertyCommercialUpdate,
  PropertyLandPlotUpdate,
  PropertyPrivateHouseUpdate,
  PropertyUpdatePayload,
} from "@/features/properties/types";

export type PropertyFormLandPlot = {
  landArea: number;
  forInvestment: boolean;
  canBeDivided: boolean;
  landCategory: LandCategory | "";
  landUsage: CommercialStatus | "";
};

export type PropertyFormValues = {
  dealType: DealType;
  city: string;
  district: string;
  address: string;
  pricePublic: number | undefined;
  priceInternal: number | undefined;
  description: string;
  apartment: PropertyApartmentUpdate | null;
  privateHouse: PropertyPrivateHouseUpdate | null;
  landPlot: PropertyFormLandPlot | null;
  commercial: PropertyCommercialUpdate | null;
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

  return Object.keys(patch).length > 0 ? patch : undefined;
}

export function buildPropertyUpdatePayload(
  initial: PropertyFormValues,
  current: PropertyFormValues,
): PropertyUpdatePayload {
  const payload: PropertyUpdatePayload = {};

  if (initial.city !== current.city) payload.city = current.city;
  if (initial.district !== current.district) payload.district = current.district;
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
  if (initial.description !== current.description) payload.description = current.description;

  const apartment = addIfChanged(initial.apartment, current.apartment);
  if (apartment) payload.apartment = apartment;

  const privateHouse = addIfChanged(initial.privateHouse, current.privateHouse);
  if (privateHouse) payload.privateHouse = privateHouse;

  const landPlot = buildLandPlotPatch(initial.landPlot, current.landPlot);
  if (landPlot) payload.landPlot = landPlot;

  const commercial = addIfChanged(initial.commercial, current.commercial);
  if (commercial) payload.commercial = commercial;

  return payload;
}

