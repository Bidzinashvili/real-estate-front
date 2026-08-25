import type { LabelSelection } from "@/features/labels/labelTypes";
import type { CreatePropertyDto } from "@/features/properties/types";
import {
  GEORGIAN_CITY_OPTIONS,
  isTbilisiCity,
} from "@/features/properties/addPropertyFormOptions";
import { isCommercialStatus, isLandCategory } from "@/features/properties/types";
import type {
  AddPropertyActiveSubtype,
  FormState,
} from "@/features/properties/addPropertyFormState";
import type { PropertyFieldLocks } from "@/features/matching/matchingEnums";
import { persistPropertyFieldLocks } from "@/features/matching/persistEntityLock";
import {
  omitUnspecifiedBoolean,
  sanitizeNeedsVerification,
} from "@/features/properties/apartmentVerification";
import { buildOwnerWritePayload } from "@/features/propertyOwners/ownerContactDrafts";
import {
  atLeastOneMessage,
  atLeastOneMonthMessage,
  atLeastZeroMessage,
  invalidNumberMessage,
  requiredFieldMessage,
  wholeNumberMessage,
  wholeNumberOfMonthsMessage,
} from "@/shared/i18n/ui";

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
    errors.push(requiredFieldMessage(field));
    return 0;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    errors.push(invalidNumberMessage(field));
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
    errors.push(requiredFieldMessage(field));
    return 0;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    errors.push(wholeNumberMessage(field));
    return 0;
  }
  if (parsed < 1) {
    errors.push(atLeastOneMessage(field));
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
    errors.push(invalidNumberMessage(field));
    return undefined;
  }
  if (parsed < 0) {
    errors.push(atLeastZeroMessage(field));
    return undefined;
  }
  return parsed;
}

function isRentalDealType(dealType: FormState["dealType"]): boolean {
  return dealType === "RENT" || dealType === "DAILY_RENT";
}

function appendPersistedFieldLocks(
  payload: CreatePropertyDto,
  fieldLocks: PropertyFieldLocks,
): void {
  const persisted = persistPropertyFieldLocks(fieldLocks);
  if (persisted) {
    payload.fieldLocks = persisted;
  }
}
function parseMinRentalPeriodForPayload(value: string, field: string, errors: string[]): number {
  const trimmed = value.trim();
  if (!trimmed) {
    errors.push(requiredFieldMessage(field));
    return 0;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    errors.push(wholeNumberOfMonthsMessage(field));
    return 0;
  }
  if (parsed < 1) {
    errors.push(atLeastOneMonthMessage(field));
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
  const district = isTbilisiCity(city) ? form.district.trim() : "";
  const address = form.address.trim();
  const ownerWrite = buildOwnerWritePayload(form.ownerAssignment);

  if (!city) errors.push("ქალაქი სავალდებულოა.");
  if (city && !GEORGIAN_CITY_OPTIONS.some((option) => option.value === city)) {
    errors.push("ქალაქი უნდა იყოს თბილისი, ბათუმი, ქუთაისი ან ბორჯომი.");
  }
  if (isTbilisiCity(city) && !district) {
    errors.push("უბანი სავალდებულოა.");
  }
  if (!address) errors.push("მისამართი სავალდებულოა.");
  if (ownerWrite.error || !ownerWrite.payload) {
    errors.push(ownerWrite.error ?? "მესაკუთრის მონაცემები სავალდებულოა.");
  }

  const pricePublic = parseNumber(form.pricePublic, "საჯარო ფასი", errors);
  const payload: CreatePropertyDto = {
    propertyType: form.propertyType,
    dealType: form.dealType,
    city,
    address,
    pricePublic,
  };
  if (ownerWrite.payload && "ownerId" in ownerWrite.payload) {
    payload.ownerId = ownerWrite.payload.ownerId;
  } else if (ownerWrite.payload && "owner" in ownerWrite.payload) {
    payload.owner = ownerWrite.payload.owner;
  }
  if (district !== "") {
    payload.district = district;
  }
  const labels = normalizeLabels(form.labels);

  if (form.cadastralCode.trim()) payload.cadastralCode = form.cadastralCode.trim();
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

  if (form.priceInternal.trim()) {
    payload.priceInternal = parseNumber(form.priceInternal, "შიდა ფასი", errors);
  }

  if (activeSubtype === "apartment") {
    const apartment = form.apartment;
    const createNeedsVerification = sanitizeNeedsVerification(
      apartment.needsVerification,
    ).filter((fieldKey) => {
      if (fieldKey === "petsAllowed" && form.dealType !== "RENT") {
        return false;
      }
      return true;
    });
    payload.apartment = {
      buildingCondition: apartment.buildingCondition,
      totalArea: parseNumber(apartment.totalArea, "ბინის საერთო ფართობი", errors),
      rooms: parseNumber(apartment.rooms, "ბინის ოთახები", errors),
      bedrooms: parseNumber(apartment.bedrooms, "ბინის საძინებლები", errors),
      floor: parseNumber(apartment.floor, "ბინის სართული", errors),
      totalFloors: parseIntegerAtLeastOne(
        apartment.totalFloors,
        "ბინის სართულიანობა",
        errors,
      ),
      ceilingHeight: parseOptionalNumber(
        apartment.ceilingHeight,
        "ბინის ჭერის სიმაღლე",
        errors,
      ),
      kitchenType: apartment.kitchenType,
    };
    if (!createNeedsVerification.includes("balconyArea")) {
      payload.apartment.balconyArea = parseOptionalNumber(
        apartment.balconyArea,
        "ბინის აივნის ფართობი",
        errors,
      );
    }
    if (!createNeedsVerification.includes("parkingSpaces")) {
      payload.apartment.parkingSpaces = parseOptionalNumber(
        apartment.parkingSpaces,
        "ბინის პარკინგის ადგილები",
        errors,
      );
    }
    const elevatorValue = omitUnspecifiedBoolean(apartment.elevator);
    if (elevatorValue !== undefined) payload.apartment.elevator = elevatorValue;
    const centralHeatingValue = omitUnspecifiedBoolean(apartment.centralHeating);
    if (centralHeatingValue !== undefined) {
      payload.apartment.centralHeating = centralHeatingValue;
    }
    const airConditionerValue = omitUnspecifiedBoolean(apartment.airConditioner);
    if (airConditionerValue !== undefined) {
      payload.apartment.airConditioner = airConditionerValue;
    }
    const furnishedValue = omitUnspecifiedBoolean(apartment.furnished);
    if (furnishedValue !== undefined) payload.apartment.furnished = furnishedValue;
    const goodViewValue = omitUnspecifiedBoolean(apartment.goodView);
    if (goodViewValue !== undefined) payload.apartment.goodView = goodViewValue;
    const bathroomsValue = parseOptionalNumber(
      apartment.bathrooms,
      "ბინის სველი წერტილები",
      errors,
    );
    if (bathroomsValue !== undefined) payload.apartment.bathrooms = bathroomsValue;
    if (createNeedsVerification.length > 0) {
      payload.apartment.needsVerification = createNeedsVerification;
    }
    if (apartment.buildingNumber.trim()) {
      payload.apartment.buildingNumber = apartment.buildingNumber.trim();
    }
    if (apartment.project.trim()) payload.apartment.project = apartment.project.trim();
    if (apartment.renovation.trim()) {
      payload.apartment.renovation = apartment.renovation.trim();
    }
    if (form.dealType === "RENT") {
      const petsAllowedValue = omitUnspecifiedBoolean(apartment.petsAllowed);
      if (petsAllowedValue !== undefined) {
        payload.apartment.petsAllowed = petsAllowedValue;
      }
    }
    if (isRentalDealType(form.dealType)) {
      payload.apartment.minRentalPeriod = parseMinRentalPeriodForPayload(
        apartment.minRentalPeriod,
        "ბინის მინიმალური ქირის ვადა (თვე)",
        errors,
      );
    }
  } else if (activeSubtype === "privateHouse") {
    const privateHouse = form.privateHouse;
    payload.privateHouse = {
      buildingCondition: privateHouse.buildingCondition,
      houseArea: parseNumber(privateHouse.houseArea, "სახლის ფართობი", errors),
      yardArea: parseNumber(privateHouse.yardArea, "ეზოს ფართობი", errors),
      totalArea: parseNumber(privateHouse.totalArea, "საერთო ფართობი", errors),
      rooms: parseNumber(privateHouse.rooms, "კერძო სახლის ოთახები", errors),
      bedrooms: parseNumber(privateHouse.bedrooms, "კერძო სახლის საძინებლები", errors),
      balconyArea: parseOptionalNumber(
        privateHouse.balconyArea,
        "კერძო სახლის აივნის ფართობი",
        errors,
      ),
      needsVerification: privateHouse.needsVerification,
      centralHeating: privateHouse.centralHeating,
      airConditioner: privateHouse.airConditioner,
      furnished: privateHouse.furnished,
      parkingSpaces: parseOptionalNumber(
        privateHouse.parkingSpaces,
        "კერძო სახლის პარკინგის ადგილები",
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
    }
    if (isRentalDealType(form.dealType)) {
      payload.privateHouse.minRentalPeriod = parseMinRentalPeriodForPayload(
        privateHouse.minRentalPeriod,
        "კერძო სახლის მინიმალური ქირის ვადა (თვე)",
        errors,
      );
    }
  } else if (activeSubtype === "landPlot") {
    const landPlot = form.landPlot;
    if (!isLandCategory(landPlot.landCategory)) {
      errors.push("მიწის კატეგორია სავალდებულოა.");
    }
    if (!isCommercialStatus(landPlot.landUsage)) {
      errors.push("მიწის დანიშნულება სავალდებულოა.");
    }
    payload.landPlot = {
      landArea: parseNumber(landPlot.landArea, "მიწის ფართობი", errors),
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
    if (isRentalDealType(form.dealType)) {
      payload.landPlot.minRentalPeriod = parseMinRentalPeriodForPayload(
        landPlot.minRentalPeriod,
        "მიწის ნაკვეთის მინიმალური ქირის ვადა (თვე)",
        errors,
      );
    }
  } else {
    const commercial = form.commercial;
    payload.commercial = {
      area: parseNumber(commercial.area, "კომერციული ფართობი", errors),
      status: commercial.status,
      floor: parseNumber(commercial.floor, "კომერციული სართული", errors),
      totalFloors: parseIntegerAtLeastOne(
        commercial.totalFloors,
        "კომერციული სართულიანობა",
        errors,
      ),
      ceilingHeight: parseOptionalNumber(
        commercial.ceilingHeight,
        "კომერციული ჭერის სიმაღლე",
        errors,
      ),
      centralHeating: commercial.centralHeating,
      airConditioner: commercial.airConditioner,
      parkingSpaces: parseOptionalNumber(
        commercial.parkingSpaces,
        "კომერციული პარკინგის ადგილები",
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
    if (isRentalDealType(form.dealType)) {
      payload.commercial.minRentalPeriod = parseMinRentalPeriodForPayload(
        commercial.minRentalPeriod,
        "კომერციულის მინიმალური ქირის ვადა (თვე)",
        errors,
      );
    }
  }

  if (form.propertyType === "HOTEL") {
    if (form.hotelScope === "WHOLE_HOTEL" || form.hotelScope === "HOTEL_ROOM") {
      payload.hotelScope = form.hotelScope;
    } else {
      errors.push("სასტუმროს ტიპი სავალდებულოა.");
    }
  }

  appendPersistedFieldLocks(payload, form.fieldLocks);

  return { payload: errors.length === 0 ? payload : null, errors };
}
