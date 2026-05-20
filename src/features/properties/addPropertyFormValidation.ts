import type { AddPropertyActiveSubtype, FormState } from "@/features/properties/addPropertyFormState";
import { GEORGIAN_CITY_OPTIONS } from "@/features/properties/addPropertyFormOptions";
import { isHotelScope } from "@/features/properties/types";

export type FormErrors = Partial<Record<string, string>>;

const internationalPhoneRegex = /^\+\d{10,15}$/;
const internationalPhoneError =
  "Phone number must be in international format, e.g. +995555111222";

export function validateFormInputs(
  form: FormState,
  activeSubtype: AddPropertyActiveSubtype,
): FormErrors {
  const errors: FormErrors = {};

  const requireString = (key: string, value: string, label: string) => {
    if (!value.trim()) errors[key] = `${label} is required.`;
  };
  const requireNumber = (key: string, value: string, label: string) => {
    if (!value.trim()) {
      errors[key] = `${label} is required.`;
      return;
    }
    if (!Number.isFinite(Number(value))) {
      errors[key] = `${label} must be a valid number.`;
    }
  };
  const requireIntegerAtLeastOne = (key: string, value: string, label: string) => {
    if (!value.trim()) {
      errors[key] = `${label} is required.`;
      return;
    }
    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue) || !Number.isInteger(parsedValue)) {
      errors[key] = `${label} must be a whole number.`;
      return;
    }
    if (parsedValue < 1) {
      errors[key] = `${label} must be at least 1.`;
    }
  };
  const optionalNumber = (key: string, value: string, label: string) => {
    if (!value.trim()) return;
    if (!Number.isFinite(Number(value))) {
      errors[key] = `${label} must be a valid number.`;
    }
  };
  const requireMinRentalPeriodMonths = (key: string, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      errors[key] = "Min Rental Period (months) is required.";
      return;
    }
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
      errors[key] = "Min Rental Period must be a whole number of months.";
      return;
    }
    if (parsed < 1) {
      errors[key] = "Min Rental Period must be at least 1 month.";
    }
  };
  const requireInternationalPhone = (key: string, value: string) => {
    const normalized = value.trim();
    if (!normalized) {
      errors[key] = "Owner phone is required.";
      return;
    }
    if (!internationalPhoneRegex.test(normalized)) {
      errors[key] = internationalPhoneError;
    }
  };
  const optionalInternationalPhone = (key: string, value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    if (!internationalPhoneRegex.test(normalized)) {
      errors[key] = internationalPhoneError;
    }
  };

  if (!GEORGIAN_CITY_OPTIONS.some((option) => option.value === form.city)) {
    errors.city = "City must be one of თბილისი, ბათუმი, ქუთაისი, or ბორჯომი.";
  }
  requireString("district", form.district, "District");
  requireString("address", form.address, "Address");
  requireString("ownerName", form.ownerName, "Owner name");
  if (form.ownerPhones.length === 0) {
    errors["ownerPhones"] = "At least one phone number is required.";
  } else {
    requireInternationalPhone("ownerPhones.0", form.ownerPhones[0] ?? "");
    form.ownerPhones.slice(1).forEach((phone, relativeIndex) => {
      optionalInternationalPhone(`ownerPhones.${relativeIndex + 1}`, phone);
    });
  }
  optionalInternationalPhone("ownerWhatsapp", form.ownerWhatsapp);
  requireNumber("pricePublic", form.pricePublic, "Public price");
  optionalNumber("priceInternal", form.priceInternal, "Internal price");

  if (form.propertyType === "HOTEL") {
    if (!isHotelScope(form.hotelScope)) {
      errors.hotelScope = "Select whole hotel or hotel room.";
    }
  }

  if (activeSubtype === "apartment") {
    requireNumber("apartment.totalArea", form.apartment.totalArea, "Apartment total area");
    requireNumber("apartment.rooms", form.apartment.rooms, "Apartment rooms");
    requireNumber("apartment.bedrooms", form.apartment.bedrooms, "Apartment bedrooms");
    requireNumber("apartment.floor", form.apartment.floor, "Apartment floor");
    requireIntegerAtLeastOne(
      "apartment.totalFloors",
      form.apartment.totalFloors,
      "Apartment total floors",
    );
    if (form.dealType === "RENT") {
      requireMinRentalPeriodMonths(
        "apartment.minRentalPeriod",
        form.apartment.minRentalPeriod,
      );
    }
  }

  if (activeSubtype === "privateHouse") {
    requireNumber("privateHouse.houseArea", form.privateHouse.houseArea, "House area");
    requireNumber("privateHouse.yardArea", form.privateHouse.yardArea, "Yard area");
    requireNumber("privateHouse.totalArea", form.privateHouse.totalArea, "Total area");
    requireNumber("privateHouse.rooms", form.privateHouse.rooms, "Private house rooms");
    requireNumber(
      "privateHouse.bedrooms",
      form.privateHouse.bedrooms,
      "Private house bedrooms",
    );
    if (form.dealType === "RENT") {
      requireMinRentalPeriodMonths(
        "privateHouse.minRentalPeriod",
        form.privateHouse.minRentalPeriod,
      );
    }
  }

  if (activeSubtype === "landPlot") {
    requireNumber("landPlot.landArea", form.landPlot.landArea, "Land area");
    if (form.landPlot.landCategory === "") {
      errors["landPlot.landCategory"] = "Land category is required.";
    }
    if (form.landPlot.landUsage === "") {
      errors["landPlot.landUsage"] = "Land usage is required.";
    }
    if (form.dealType === "RENT") {
      requireMinRentalPeriodMonths(
        "landPlot.minRentalPeriod",
        form.landPlot.minRentalPeriod,
      );
    }
  }

  if (activeSubtype === "commercial") {
    requireNumber("commercial.area", form.commercial.area, "Commercial area");
    requireNumber("commercial.floor", form.commercial.floor, "Commercial floor");
    if (form.dealType === "RENT") {
      requireMinRentalPeriodMonths(
        "commercial.minRentalPeriod",
        form.commercial.minRentalPeriod,
      );
    }
  }

  return errors;
}

export function validateAddPropertyImages(files: File[]): string | null {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  if (files.length > 10) {
    return "You can upload at most 10 images.";
  }
  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) {
      return `Image ${file.name} exceeds 10MB.`;
    }
    if (!allowedMimeTypes.includes(file.type)) {
      return `Image ${file.name} is not a supported type (jpg, jpeg, png, webp).`;
    }
  }
  return null;
}
