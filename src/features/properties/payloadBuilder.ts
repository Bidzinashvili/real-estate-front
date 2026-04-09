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
  minRentalPeriod?: number;
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

export function buildPropertyUpdatePayload(
  initial: PropertyFormValues,
  current: PropertyFormValues,
): PropertyUpdatePayload {
  const payload: PropertyUpdatePayload = {};

  if (initial.dealType !== current.dealType) {
    payload.dealType = current.dealType;
  }

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

  const apartmentPatch = mergeMinRentalPeriodIntoPatch(
    initial.apartment,
    current.apartment,
    addIfChanged(initial.apartment, current.apartment),
  );
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

  return payload;
}

