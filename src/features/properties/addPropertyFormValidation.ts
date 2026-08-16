import type { AddPropertyActiveSubtype, FormState } from "@/features/properties/addPropertyFormState";
import {
  GEORGIAN_CITY_OPTIONS,
  isTbilisiCity,
} from "@/features/properties/addPropertyFormOptions";
import { isHotelScope } from "@/features/properties/types";
import {
  invalidNumberMessage,
  requiredFieldMessage,
  wholeNumberMessage,
  atLeastOneMessage,
} from "@/shared/i18n/ui";

export type FormErrors = Partial<Record<string, string>>;

const internationalPhoneRegex = /^\+\d{10,15}$/;
const internationalPhoneError =
  "ტელეფონი უნდა იყოს საერთაშორისო ფორმატში, მაგ. +995555111222";

export function validateFormInputs(
  form: FormState,
  activeSubtype: AddPropertyActiveSubtype,
): FormErrors {
  const errors: FormErrors = {};

  const requireString = (key: string, value: string, label: string) => {
    if (!value.trim()) errors[key] = requiredFieldMessage(label);
  };
  const requireNumber = (key: string, value: string, label: string) => {
    if (!value.trim()) {
      errors[key] = requiredFieldMessage(label);
      return;
    }
    if (!Number.isFinite(Number(value))) {
      errors[key] = invalidNumberMessage(label);
    }
  };
  const requireIntegerAtLeastOne = (key: string, value: string, label: string) => {
    if (!value.trim()) {
      errors[key] = requiredFieldMessage(label);
      return;
    }
    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue) || !Number.isInteger(parsedValue)) {
      errors[key] = wholeNumberMessage(label);
      return;
    }
    if (parsedValue < 1) {
      errors[key] = atLeastOneMessage(label);
    }
  };
  const optionalNumber = (key: string, value: string, label: string) => {
    if (!value.trim()) return;
    if (!Number.isFinite(Number(value))) {
      errors[key] = invalidNumberMessage(label);
    }
  };
  const requireMinRentalPeriodMonths = (key: string, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      errors[key] = "მინიმალური ქირის ვადა (თვეებში) სავალდებულოა.";
      return;
    }
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
      errors[key] = "მინიმალური ქირის ვადა უნდა იყოს მთელი რიცხვი თვეებში.";
      return;
    }
    if (parsed < 1) {
      errors[key] = "მინიმალური ქირის ვადა უნდა იყოს მინიმუმ 1 თვე.";
    }
  };
  const requireInternationalPhone = (key: string, value: string) => {
    const normalized = value.trim();
    if (!normalized) {
      errors[key] = "მესაკუთრის ტელეფონი სავალდებულოა.";
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
    errors.city = "ქალაქი უნდა იყოს თბილისი, ბათუმი, ქუთაისი ან ბორჯომი.";
  }
  if (isTbilisiCity(form.city)) {
    requireString("district", form.district, "უბანი");
  }
  requireString("address", form.address, "მისამართი");
  requireString("ownerName", form.ownerName, "მესაკუთრის სახელი");
  if (form.ownerPhones.length === 0) {
    errors["ownerPhones"] = "საჭიროა მინიმუმ ერთი ტელეფონის ნომერი.";
  } else {
    requireInternationalPhone("ownerPhones.0", form.ownerPhones[0] ?? "");
    form.ownerPhones.slice(1).forEach((phone, relativeIndex) => {
      optionalInternationalPhone(`ownerPhones.${relativeIndex + 1}`, phone);
    });
  }
  optionalInternationalPhone("ownerWhatsapp", form.ownerWhatsapp);
  requireNumber("pricePublic", form.pricePublic, "საჯარო ფასი");
  optionalNumber("priceInternal", form.priceInternal, "შიდა ფასი");

  if (form.propertyType === "HOTEL") {
    if (!isHotelScope(form.hotelScope)) {
      errors.hotelScope = "აირჩიეთ მთელი სასტუმრო ან ნომერი.";
    }
  }

  if (activeSubtype === "apartment") {
    requireNumber("apartment.totalArea", form.apartment.totalArea, "ბინის საერთო ფართობი");
    requireNumber("apartment.rooms", form.apartment.rooms, "ბინის ოთახები");
    requireNumber("apartment.bedrooms", form.apartment.bedrooms, "ბინის საძინებლები");
    requireNumber("apartment.floor", form.apartment.floor, "ბინის სართული");
    requireIntegerAtLeastOne(
      "apartment.totalFloors",
      form.apartment.totalFloors,
      "ბინის სართულიანობა",
    );
    optionalNumber(
      "apartment.ceilingHeight",
      form.apartment.ceilingHeight,
      "ბინის ჭერის სიმაღლე",
    );
    optionalNumber(
      "apartment.balconyArea",
      form.apartment.balconyArea,
      "ბინის აივნის ფართობი",
    );
    optionalNumber(
      "apartment.parkingSpaces",
      form.apartment.parkingSpaces,
      "ბინის პარკინგის ადგილები",
    );
    if (form.dealType === "RENT" || form.dealType === "DAILY_RENT") {
      requireMinRentalPeriodMonths(
        "apartment.minRentalPeriod",
        form.apartment.minRentalPeriod,
      );
    }
    optionalNumber("apartment.bathrooms", form.apartment.bathrooms, "ბინის სველი წერტილები");
  }

  if (activeSubtype === "privateHouse") {
    requireNumber("privateHouse.houseArea", form.privateHouse.houseArea, "სახლის ფართობი");
    requireNumber("privateHouse.yardArea", form.privateHouse.yardArea, "ეზოს ფართობი");
    requireNumber("privateHouse.totalArea", form.privateHouse.totalArea, "საერთო ფართობი");
    requireNumber("privateHouse.rooms", form.privateHouse.rooms, "კერძო სახლის ოთახები");
    requireNumber(
      "privateHouse.bedrooms",
      form.privateHouse.bedrooms,
      "კერძო სახლის საძინებლები",
    );
    optionalNumber(
      "privateHouse.balconyArea",
      form.privateHouse.balconyArea,
      "კერძო სახლის აივნის ფართობი",
    );
    optionalNumber(
      "privateHouse.parkingSpaces",
      form.privateHouse.parkingSpaces,
      "კერძო სახლის პარკინგის ადგილები",
    );
    if (form.dealType === "RENT" || form.dealType === "DAILY_RENT") {
      requireMinRentalPeriodMonths(
        "privateHouse.minRentalPeriod",
        form.privateHouse.minRentalPeriod,
      );
    }
  }

  if (activeSubtype === "landPlot") {
    requireNumber("landPlot.landArea", form.landPlot.landArea, "მიწის ფართობი");
    if (form.landPlot.landCategory === "") {
      errors["landPlot.landCategory"] = "მიწის კატეგორია სავალდებულოა.";
    }
    if (form.landPlot.landUsage === "") {
      errors["landPlot.landUsage"] = "მიწის დანიშნულება სავალდებულოა.";
    }
    if (form.dealType === "RENT" || form.dealType === "DAILY_RENT") {
      requireMinRentalPeriodMonths(
        "landPlot.minRentalPeriod",
        form.landPlot.minRentalPeriod,
      );
    }
  }

  if (activeSubtype === "commercial") {
    requireNumber("commercial.area", form.commercial.area, "კომერციული ფართობი");
    requireNumber("commercial.floor", form.commercial.floor, "კომერციული სართული");
    requireIntegerAtLeastOne(
      "commercial.totalFloors",
      form.commercial.totalFloors,
      "კომერციული სართულიანობა",
    );
    optionalNumber(
      "commercial.ceilingHeight",
      form.commercial.ceilingHeight,
      "კომერციული ჭერის სიმაღლე",
    );
    optionalNumber(
      "commercial.parkingSpaces",
      form.commercial.parkingSpaces,
      "კომერციული პარკინგის ადგილები",
    );
    if (form.dealType === "RENT" || form.dealType === "DAILY_RENT") {
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
  const maxImageCount = 50;
  if (files.length > maxImageCount) {
    return "შეგიძლიათ ატვირთოთ მაქსიმუმ 50 ფოტო.";
  }
  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) {
      return `ფოტო ${file.name} აღემატება 10MB-ს.`;
    }
    if (!allowedMimeTypes.includes(file.type)) {
      return `ფოტო ${file.name} მხარდაჭერილი ტიპი არ არის (jpg, jpeg, png, webp).`;
    }
  }
  return null;
}
