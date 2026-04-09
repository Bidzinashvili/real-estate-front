import type { CreatePropertyDto } from "@/features/properties/types";
import { isCommercialStatus, isLandCategory } from "@/features/properties/types";
import type {
  AddPropertyActiveSubtype,
  FormState,
} from "@/features/properties/addPropertyFormState";

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

export function buildCreatePropertyPayload(
  form: FormState,
  activeSubtype: AddPropertyActiveSubtype,
): { payload: CreatePropertyDto | null; errors: string[] } {
  const errors: string[] = [];
  const city = form.city.trim();
  const district = form.district.trim();
  const address = form.address.trim();
  const ownerName = form.ownerName.trim();
  const ownerPhone = form.ownerPhone.trim();

  if (!city) errors.push("City is required.");
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

  if (form.cadastralCode.trim()) payload.cadastralCode = form.cadastralCode.trim();
  if (form.ownerWhatsapp.trim()) payload.ownerWhatsapp = form.ownerWhatsapp.trim();
  if (form.myHomeId.trim()) payload.myHomeId = form.myHomeId.trim();
  if (form.ssGeId.trim()) payload.ssGeId = form.ssGeId.trim();
  if (form.description.trim()) payload.description = form.description.trim();
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
      balcony: apartment.balcony > 0,
      elevator: apartment.elevator,
      centralHeating: apartment.centralHeating,
      airConditioner: apartment.airConditioner,
      kitchenType: apartment.kitchenType,
      furniture: apartment.furniture,
      appliances: apartment.appliances,
      parking: apartment.parking,
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
      if (apartment.minRentalPeriod.trim()) {
        payload.apartment.minRentalPeriod = parseNumber(
          apartment.minRentalPeriod,
          "Apartment minimum rental period",
          errors,
        );
      }
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
      balcony: privateHouse.balcony > 0,
      centralHeating: privateHouse.centralHeating,
      airConditioner: privateHouse.airConditioner,
      furniture: privateHouse.furniture,
      appliances: privateHouse.appliances,
      parking: privateHouse.parking,
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
      if (privateHouse.minRentalPeriod.trim()) {
        payload.privateHouse.minRentalPeriod = parseNumber(
          privateHouse.minRentalPeriod,
          "Private house minimum rental period",
          errors,
        );
      }
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
  } else {
    const commercial = form.commercial;
    payload.commercial = {
      area: parseNumber(commercial.area, "Commercial area", errors),
      status: commercial.status,
      floor: parseNumber(commercial.floor, "Commercial floor", errors),
      centralHeating: commercial.centralHeating,
      airConditioner: commercial.airConditioner,
      parking: commercial.parking,
      electricity: commercial.electricity,
      water: commercial.water,
      gas: commercial.gas,
      sewage: commercial.sewage,
    };
    if (commercial.renovation.trim()) {
      payload.commercial.renovation = commercial.renovation.trim();
    }
  }

  return { payload: errors.length === 0 ? payload : null, errors };
}
