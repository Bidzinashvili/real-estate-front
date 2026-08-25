import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import type {
  CreateClientPayload,
  LockState,
  LockedOptional,
  UpdateClientPayload,
} from "@/features/clients/clientApi.types";
import {
  BUILDING_CONDITIONS,
  KITCHEN_TYPES,
} from "@/features/clients/clientEnums";
import type { ClientPreferenceValue } from "@/features/matching/matchingEnums";
import { persistEntityLock } from "@/features/matching/persistEntityLock";
import { normalizeGeorgianPhone } from "@/shared/lib/normalizeGeorgianPhone";

function toSubmittedWhatsapp(rawWhatsapp: string | undefined): string | undefined {
  const trimmedWhatsapp = rawWhatsapp?.trim() ?? "";
  if (!trimmedWhatsapp) {
    return undefined;
  }
  return normalizeGeorgianPhone(trimmedWhatsapp);
}

function parseReminderDateToIso(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }
  return parsed.toISOString();
}

function shouldEmitLockedPartial(lock: LockState, hasMeaningfulValue: boolean): boolean {
  return hasMeaningfulValue || persistEntityLock(lock) !== "none";
}

function appendLockedPartialNumber(
  dto: CreateClientPayload | UpdateClientPayload,
  key: "budgetMin" | "budgetMax" | "minRentalPeriod",
  field: ClientFormValues[typeof key],
): void {
  const persistedLock = persistEntityLock(field.lock);
  const hasValue = field.value !== undefined && !Number.isNaN(field.value);
  if (!shouldEmitLockedPartial(persistedLock, hasValue)) {
    return;
  }
  const payload: LockedOptional<number> = { lock: persistedLock };
  if (hasValue) {
    payload.value = field.value;
  }
  dto[key] = payload;
}

function appendLockedNumber(
  dto: CreateClientPayload | UpdateClientPayload,
  key:
    | "minRooms"
    | "maxRooms"
    | "minBedrooms"
    | "maxBedrooms"
    | "minFloor"
    | "maxFloor"
    | "minArea"
    | "maxArea"
    | "balconyAreaMin"
    | "balconyAreaMax"
    | "minBathrooms"
    | "maxBathrooms",
  field: ClientFormValues[typeof key],
): void {
  const hasValue = field.value !== undefined && !Number.isNaN(field.value);
  if (!hasValue) {
    return;
  }
  dto[key] = { value: field.value as number, lock: persistEntityLock(field.lock) };
}

function appendLockedBoolean(
  dto: CreateClientPayload | UpdateClientPayload,
  key: "excludeLastFloor",
  field: ClientFormValues["excludeLastFloor"],
): void {
  const hasValue = field.value !== undefined;
  if (!hasValue) {
    return;
  }
  dto[key] = { value: field.value === true, lock: persistEntityLock(field.lock) };
}

function appendLockedPreference(
  dto: CreateClientPayload | UpdateClientPayload,
  key:
    | "hasBalcony"
    | "goodView"
    | "elevator"
    | "centralHeating"
    | "airConditioner"
    | "furnished"
    | "parking",
  field: ClientFormValues[typeof key],
): void {
  dto[key] = {
    value: field.value as ClientPreferenceValue,
    lock: persistEntityLock(field.lock),
  };
}

function appendLockedPartialBuildingCondition(
  dto: CreateClientPayload | UpdateClientPayload,
  field: ClientFormValues["buildingCondition"],
): void {
  const raw = field.value;
  const persistedLock = persistEntityLock(field.lock);
  const hasEnumValue =
    raw !== undefined &&
    raw !== "" &&
    (BUILDING_CONDITIONS as readonly string[]).includes(raw);
  if (!shouldEmitLockedPartial(persistedLock, hasEnumValue)) {
    return;
  }
  const payload: LockedOptional<(typeof BUILDING_CONDITIONS)[number]> = {
    lock: persistedLock,
  };
  if (hasEnumValue) {
    payload.value = raw;
  }
  dto.buildingCondition = payload;
}

function appendLockedPartialKitchenTypeField(
  dto: CreateClientPayload | UpdateClientPayload,
  field: ClientFormValues["kitchenType"],
): void {
  const raw = field.value;
  const persistedLock = persistEntityLock(field.lock);
  const hasEnumValue =
    raw !== undefined &&
    raw !== "" &&
    (KITCHEN_TYPES as readonly string[]).includes(raw);
  if (!shouldEmitLockedPartial(persistedLock, hasEnumValue)) {
    return;
  }
  const payload: LockedOptional<(typeof KITCHEN_TYPES)[number]> = {
    lock: persistedLock,
  };
  if (hasEnumValue) {
    payload.value = raw;
  }
  dto.kitchenType = payload;
}

function appendPet(
  dto: CreateClientPayload | UpdateClientPayload,
  pet: ClientFormValues["pet"],
): void {
  const trimmed = pet.value?.trim();
  const persistedLock = persistEntityLock(pet.lock);
  const hasValue = Boolean(trimmed);
  if (!shouldEmitLockedPartial(persistedLock, hasValue)) {
    return;
  }
  const payload: LockedOptional<string> = { lock: persistedLock };
  if (hasValue && trimmed) {
    payload.value = trimmed;
  }
  dto.pet = payload;
}

function appendProjectExclude(
  dto: CreateClientPayload | UpdateClientPayload,
  field: ClientFormValues["projectExclude"],
): void {
  const persistedLock = persistEntityLock(field.lock);
  const hasValue = field.value.length > 0;
  if (!shouldEmitLockedPartial(persistedLock, hasValue)) {
    return;
  }
  const payload: LockedOptional<string[]> = { lock: persistedLock };
  if (hasValue) {
    payload.value = field.value;
  }
  dto.projectExclude = payload;
}

function filterStringList(values: string[]): string[] {
  return values.map((value) => value.trim()).filter((value) => value.length > 0);
}

function appendMatchingFields(
  dto: CreateClientPayload | UpdateClientPayload,
  values: ClientFormValues,
): void {
  appendLockedPartialNumber(dto, "budgetMin", values.budgetMin);
  appendLockedPartialNumber(dto, "budgetMax", values.budgetMax);
  appendPet(dto, values.pet);

  appendLockedNumber(dto, "minRooms", values.minRooms);
  appendLockedNumber(dto, "maxRooms", values.maxRooms);
  appendLockedNumber(dto, "minBedrooms", values.minBedrooms);
  appendLockedNumber(dto, "maxBedrooms", values.maxBedrooms);
  appendLockedNumber(dto, "minFloor", values.minFloor);
  appendLockedNumber(dto, "maxFloor", values.maxFloor);
  appendLockedBoolean(dto, "excludeLastFloor", values.excludeLastFloor);

  dto.renovations = {
    value: values.renovations.value,
    lock: persistEntityLock(values.renovations.lock),
  };

  appendLockedPartialBuildingCondition(dto, values.buildingCondition);
  appendLockedPartialKitchenTypeField(dto, values.kitchenType);
  appendProjectExclude(dto, values.projectExclude);

  appendLockedNumber(dto, "minArea", values.minArea);
  appendLockedNumber(dto, "maxArea", values.maxArea);
  appendLockedPreference(dto, "hasBalcony", values.hasBalcony);
  appendLockedNumber(dto, "balconyAreaMin", values.balconyAreaMin);
  appendLockedNumber(dto, "balconyAreaMax", values.balconyAreaMax);
  appendLockedPreference(dto, "goodView", values.goodView);
  appendLockedPreference(dto, "elevator", values.elevator);
  appendLockedPreference(dto, "centralHeating", values.centralHeating);
  appendLockedPreference(dto, "airConditioner", values.airConditioner);
  appendLockedPreference(dto, "furnished", values.furnished);
  appendLockedNumber(dto, "minBathrooms", values.minBathrooms);
  appendLockedNumber(dto, "maxBathrooms", values.maxBathrooms);
  appendLockedPreference(dto, "parking", values.parking);
  appendLockedPartialNumber(dto, "minRentalPeriod", values.minRentalPeriod);
}

export function buildCreateClientDto(values: ClientFormValues): CreateClientPayload {
  const dto: CreateClientPayload = {
    name: values.name,
    phones: values.phones.map((phoneNumber) => normalizeGeorgianPhone(phoneNumber)),
    dealType: values.dealType,
    description: values.description,
    districts: {
      value: filterStringList(values.districts.value),
      lock: persistEntityLock(values.districts.lock),
    },
    addresses: {
      value: filterStringList(values.addresses.value),
      lock: persistEntityLock(values.addresses.lock),
    },
    labels: {
      value: filterStringList(values.labels.value),
      lock: persistEntityLock(values.labels.lock),
    },
  };

  const submittedWhatsapp = toSubmittedWhatsapp(values.whatsapp);
  if (submittedWhatsapp) {
    dto.whatsapp = submittedWhatsapp;
  }

  if (values.status) {
    dto.status = values.status;
  }

  const validPersons = (values.relatedPersons ?? []).filter(
    (person) => person.name?.trim(),
  );
  if (validPersons.length > 0) {
    dto.relatedPersons = validPersons;
  }

  appendMatchingFields(dto, values);

  const reminderIso = parseReminderDateToIso(values.reminderDate ?? "");
  if (reminderIso) {
    dto.reminder = {
      type: "CUSTOM_DATE",
      notifyAt: reminderIso,
      repeats: false,
    };
  }

  return dto;
}

export function buildUpdateClientDto(values: ClientFormValues): UpdateClientPayload {
  const dto: UpdateClientPayload = {
    name: values.name,
    phones: values.phones.map((phoneNumber) => normalizeGeorgianPhone(phoneNumber)),
    dealType: values.dealType,
    description: values.description,
    districts: {
      value: filterStringList(values.districts.value),
      lock: persistEntityLock(values.districts.lock),
    },
    addresses: {
      value: filterStringList(values.addresses.value),
      lock: persistEntityLock(values.addresses.lock),
    },
    labels: {
      value: filterStringList(values.labels.value),
      lock: persistEntityLock(values.labels.lock),
    },
    status: values.status ? values.status : undefined,
    outcomeSource:
      values.status === "INACTIVE" && values.outcomeSource
        ? values.outcomeSource
        : undefined,
  };

  const submittedWhatsapp = toSubmittedWhatsapp(values.whatsapp);
  if (submittedWhatsapp) {
    dto.whatsapp = submittedWhatsapp;
  }

  const validPersons = (values.relatedPersons ?? []).filter(
    (person) => person.name?.trim(),
  );
  if (validPersons.length > 0) {
    dto.relatedPersons = validPersons;
  }

  appendMatchingFields(dto, values);

  return dto;
}
