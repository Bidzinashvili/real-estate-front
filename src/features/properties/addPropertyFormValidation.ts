import type { AddPropertyActiveSubtype, FormState } from "@/features/properties/addPropertyFormState";

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
  const optionalNumber = (key: string, value: string, label: string) => {
    if (!value.trim()) return;
    if (!Number.isFinite(Number(value))) {
      errors[key] = `${label} must be a valid number.`;
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

  requireString("city", form.city, "City");
  requireString("district", form.district, "District");
  requireString("address", form.address, "Address");
  requireString("ownerName", form.ownerName, "Owner name");
  requireInternationalPhone("ownerPhone", form.ownerPhone);
  optionalInternationalPhone("ownerWhatsapp", form.ownerWhatsapp);
  requireNumber("pricePublic", form.pricePublic, "Public price");
  optionalNumber("priceInternal", form.priceInternal, "Internal price");

  if (activeSubtype === "apartment") {
    requireNumber("apartment.totalArea", form.apartment.totalArea, "Apartment total area");
    requireNumber("apartment.rooms", form.apartment.rooms, "Apartment rooms");
    requireNumber("apartment.bedrooms", form.apartment.bedrooms, "Apartment bedrooms");
    requireNumber("apartment.floor", form.apartment.floor, "Apartment floor");
    if (form.dealType === "RENT") {
      optionalNumber(
        "apartment.minRentalPeriod",
        form.apartment.minRentalPeriod,
        "Apartment minimum rental period",
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
      optionalNumber(
        "privateHouse.minRentalPeriod",
        form.privateHouse.minRentalPeriod,
        "Private house minimum rental period",
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
  }

  if (activeSubtype === "commercial") {
    requireNumber("commercial.area", form.commercial.area, "Commercial area");
    requireNumber("commercial.floor", form.commercial.floor, "Commercial floor");
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
