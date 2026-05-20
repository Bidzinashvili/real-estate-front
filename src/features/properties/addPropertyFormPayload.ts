import type { LabelSelection } from "@/features/labels/labelTypes";
import type { CreatePropertyDto } from "@/features/properties/types";
import { GEORGIAN_CITY_OPTIONS } from "@/features/properties/addPropertyFormOptions";
import { datetimeLocalValueToIso } from "@/shared/lib/datetimeLocalIso";
import { isCommercialStatus, isLandCategory } from "@/features/properties/types";
import type {
  AddPropertyActiveSubtype,
  FormState,
} from "@/features/properties/addPropertyFormState";

function normalizeLabels(labels: LabelSelection[]): string[] {
  const uniqueLabels = new Map<string, string>();

  for (const labelSelection of labels) {
    const normalizedName = labelSelection.name.trim().replace(/\s+/g, " ");
    if (normalizedName === "") {
      continue;
    }

    uniqueLabels.set(normalizedName.toLocaleLowerCase(), normalizedName);
  }

  return Array.from(uniqueLabels.values());
}

function parseNumber(value: string, field: string, errors: string[]): number {
  const trimmed = value.trim();
  if (!trimmed) {
    errors.push(`${field} is required.`);
    return 0;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    errors.push(`${field} must be a valid number.`);
    return 0;
  }
  return parsed;
}

function parseIntegerAtLeastOne(
  value: string,
  field: string,
  errors: string[],
): number {
  const trimmed = value.trim();
  if (!trimmed) {
    errors.push(`${field} is required.`);
    return 0;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    errors.push(`${field} must be a whole number.`);
    return 0;
  }
  if (parsed < 1) {
    errors.push(`${field} must be at least 1.`);
    return 0;
  }
  return parsed;
}

function parseOptionalNumber(value: string, field: string, errors: string[]): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    errors.push(`${field} must be a valid number.`);
    return undefined;
  }
  if (parsed < 0) {
    errors.push(`${field} must be at least 0.`);
    return undefined;
  }
  return parsed;
}

function parseMinRentalPeriodForPayload(value: string, field: string, errors: string[]): number {
  const trimmed = value.trim();
  if (!trimmed) {
    errors.push(`${field} is required.`);
    return 0;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    errors.push(`${field} must be a whole number of months.`);
    return 0;
  }
  if (parsed < 1) {
    errors.push(`${field} must be at least 1 month.`);
    return 0;
  }
  return parsed;
}

export function buildCreatePropertyPayload(
  form: FormState,
  activeSubtype: AddPropertyActiveSubtype,
): { payload: CreatePropertyDto | null; errors: string[] } {
  const errors: string[] = [];
  const city = form.city.trim();
  const district = form.district.trim();
  const address = form.address.trim();
  const ownerName = form.ownerName.trim();
  const ownerPhone = (form.ownerPhones[0] ?? "").trim();

  if (!city) errors.push("City is required.");
  if (city && !GEORGIAN_CITY_OPTIONS.some((option) => option.value === city)) {
    errors.push("City must be one of თბილისი, ბათუმი, ქუთაისი, or ბორჯომი.");
  }
  if (!district) errors.push("District is required.");
  if (!address) errors.push("Address is required.");
  if (!ownerName) errors.push("Owner name is required.");
  if (!ownerPhone) errors.push("Owner phone is required.");

  const pricePublic = parseNumber(form.pricePublic, "Public price", errors);
  const payload: CreatePropertyDto = {
    propertyType: form.propertyType,
    dealType: form.dealType,
    city,
    district,
    address,
    pricePublic,
    ownerName,
    ownerPhone,
  };
  const labels = normalizeLabels(form.labels);

  if (form.cadastralCode.trim()) payload.cadastralCode = form.cadastralCode.trim();
  if (form.ownerWhatsapp.trim()) payload.ownerWhatsapp = form.ownerWhatsapp.trim();
  const externalIds = form.externalIds
    .filter((externalId) => externalId.archivedAt === null && externalId.value.trim() !== "")
    .map((externalId) => ({
      platform: externalId.platform,
      value: externalId.value.trim(),
      enteredAt: externalId.enteredAt,
    }));
  const myHomeId =
    externalIds.find((externalId) => externalId.platform === "MYHOME")?.value ??
    form.myHomeId.trim();
  const ssGeId =
    externalIds.find((externalId) => externalId.platform === "SSGE")?.value ??
    form.ssGeId.trim();

  if (myHomeId) payload.myHomeId = myHomeId;
  if (ssGeId) payload.ssGeId = ssGeId;
  if (externalIds.length > 0) payload.externalIds = externalIds;
  if (form.publicComment.trim()) payload.publicComment = form.publicComment.trim();
  if (form.privateComment.trim()) payload.privateComment = form.privateComment.trim();
  if (form.internalText.trim()) payload.internalText = form.internalText.trim();
  if (labels.length > 0) payload.labels = labels;

  if (form.listingLifecycleStatus) {
    payload.status = form.listingLifecycleStatus;
  }
  if (form.listingLifecycleStatus === "TO_BE_VERIFIED") {
    const reminderIso = datetimeLocalValueToIso(form.verificationReminderLocal);
    if (reminderIso) {
      payload.reminderDate = reminderIso;
    }
  }

  if (form.priceInternal.trim()) {
    payload.priceInternal = parseNumber(form.priceInternal, "Internal price", errors);
  }

  if (activeSubtype === "apartment") {
    const apartment = form.apartment;
    payload.apartment = {
      buildingCondition: apartment.buildingCondition,
      totalArea: parseNumber(apartment.totalArea, "Apartment total area", errors),
      rooms: parseNumber(apartment.rooms, "Apartment rooms", errors),
      bedrooms: parseNumber(apartment.bedrooms, "Apartment bedrooms", errors),
      floor: parseNumber(apartment.floor, "Apartment floor", errors),
      totalFloors: parseIntegerAtLeastOne(
        apartment.totalFloors,
        "Apartment total floors",
        errors,
      ),
      ceilingHeight: parseOptionalNumber(
        apartment.ceilingHeight,
        "Apartment ceiling height",
        errors,
      ),
      balconyArea: parseOptionalNumber(
        apartment.balconyArea,
        "Apartment balcony area",
        errors,
      ),
      needsVerification: apartment.needsVerification,
      elevator: apartment.elevator,
      centralHeating: apartment.centralHeating,
      airConditioner: apartment.airConditioner,
      kitchenType: apartment.kitchenType,
      furnished: apartment.furnished,
      parkingSpaces: parseOptionalNumber(
        apartment.parkingSpaces,
        "Apartment parking spaces",
        errors,
      ),
    };
    if (apartment.buildingNumber.trim()) {
      payload.apartment.buildingNumber = apartment.buildingNumber.trim();
    }
    if (apartment.project.trim()) payload.apartment.project = apartment.project.trim();
    if (apartment.renovation.trim()) {
      payload.apartment.renovation = apartment.renovation.trim();
    }
    if (form.dealType === "RENT") {
      payload.apartment.petsAllowed = apartment.petsAllowed;
      payload.apartment.minRentalPeriod = parseMinRentalPeriodForPayload(
        apartment.minRentalPeriod,
        "Apartment Min Rental Period (months)",
        errors,
      );
    }
  } else if (activeSubtype === "privateHouse") {
    const privateHouse = form.privateHouse;
    payload.privateHouse = {
      buildingCondition: privateHouse.buildingCondition,
      houseArea: parseNumber(privateHouse.houseArea, "House area", errors),
      yardArea: parseNumber(privateHouse.yardArea, "Yard area", errors),
      totalArea: parseNumber(privateHouse.totalArea, "Total area", errors),
      rooms: parseNumber(privateHouse.rooms, "Private house rooms", errors),
      bedrooms: parseNumber(privateHouse.bedrooms, "Private house bedrooms", errors),
      balconyArea: parseOptionalNumber(
        privateHouse.balconyArea,
        "Private house balcony area",
        errors,
      ),
      needsVerification: privateHouse.needsVerification,
      centralHeating: privateHouse.centralHeating,
      airConditioner: privateHouse.airConditioner,
      furnished: privateHouse.furnished,
      parkingSpaces: parseOptionalNumber(
        privateHouse.parkingSpaces,
        "Private house parking spaces",
        errors,
      ),
      pool: privateHouse.pool,
      fruitTrees: privateHouse.fruitTrees,
      electricity: privateHouse.electricity,
      water: privateHouse.water,
      gas: privateHouse.gas,
      sewage: privateHouse.sewage,
    };
    if (privateHouse.renovation.trim()) {
      payload.privateHouse.renovation = privateHouse.renovation.trim();
    }
    if (form.dealType === "RENT") {
      payload.privateHouse.petsAllowed = privateHouse.petsAllowed;
      payload.privateHouse.minRentalPeriod = parseMinRentalPeriodForPayload(
        privateHouse.minRentalPeriod,
        "Private house Min Rental Period (months)",
        errors,
      );
    }
  } else if (activeSubtype === "landPlot") {
    const landPlot = form.landPlot;
    if (!isLandCategory(landPlot.landCategory)) {
      errors.push("Land category is required.");
    }
    if (!isCommercialStatus(landPlot.landUsage)) {
      errors.push("Land usage is required.");
    }
    payload.landPlot = {
      landArea: parseNumber(landPlot.landArea, "Land area", errors),
      landCategory: isLandCategory(landPlot.landCategory)
        ? landPlot.landCategory
        : "AGRICULTURAL",
      landUsage: isCommercialStatus(landPlot.landUsage) ? landPlot.landUsage : "UNIVERSAL",
      forInvestment: landPlot.forInvestment,
      approvedProject: landPlot.approvedProject,
      canBeDivided: landPlot.canBeDivided,
      fruitTrees: landPlot.fruitTrees,
      electricity: landPlot.electricity,
      water: landPlot.water,
      gas: landPlot.gas,
      sewage: landPlot.sewage,
    };
    if (form.dealType === "RENT") {
      payload.landPlot.minRentalPeriod = parseMinRentalPeriodForPayload(
        landPlot.minRentalPeriod,
        "Land plot Min Rental Period (months)",
        errors,
      );
    }
  } else {
    const commercial = form.commercial;
    payload.commercial = {
      area: parseNumber(commercial.area, "Commercial area", errors),
      status: commercial.status,
      floor: parseNumber(commercial.floor, "Commercial floor", errors),
      totalFloors: parseIntegerAtLeastOne(
        commercial.totalFloors,
        "Commercial total floors",
        errors,
      ),
      ceilingHeight: parseOptionalNumber(
        commercial.ceilingHeight,
        "Commercial ceiling height",
        errors,
      ),
      centralHeating: commercial.centralHeating,
      airConditioner: commercial.airConditioner,
      parkingSpaces: parseOptionalNumber(
        commercial.parkingSpaces,
        "Commercial parking spaces",
        errors,
      ),
      needsVerification: commercial.needsVerification,
      electricity: commercial.electricity,
      water: commercial.water,
      gas: commercial.gas,
      sewage: commercial.sewage,
    };
    if (commercial.renovation.trim()) {
      payload.commercial.renovation = commercial.renovation.trim();
    }
    if (form.dealType === "RENT") {
      payload.commercial.minRentalPeriod = parseMinRentalPeriodForPayload(
        commercial.minRentalPeriod,
        "Commercial Min Rental Period (months)",
        errors,
      );
    }
  }

  if (form.propertyType === "HOTEL") {
    if (form.hotelScope === "WHOLE_HOTEL" || form.hotelScope === "HOTEL_ROOM") {
      payload.hotelScope = form.hotelScope;
    } else {
      errors.push("Hotel scope is required.");
    }
  }

  return { payload: errors.length === 0 ? payload : null, errors };
}
