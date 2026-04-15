import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import type {
  CreateClientPayload,
  LockState,
  LockedPartial,
  UpdateClientPayload,
} from "@/features/clients/clientApi.types";
import {
  BUILDING_CONDITIONS,
  KITCHEN_TYPES,
  RENOVATION_VALUES,
} from "@/features/clients/clientEnums";

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
  return hasMeaningfulValue || lock !== "none";
}

function appendLockedPartialNumber(
  dto: CreateClientPayload,
  key: "budgetMin" | "budgetMax" | "minRentalPeriod",
  field: ClientFormValues[typeof key],
): void {
  const hasValue = field.value !== undefined && !Number.isNaN(field.value);
  if (!shouldEmitLockedPartial(field.lock, hasValue)) {
    return;
  }
  const payload: LockedPartial<number> = { lock: field.lock };
  if (hasValue) {
    payload.value = field.value;
  }
  dto[key] = payload;
}

function appendLockedNumber(
  dto: CreateClientPayload,
  key:
    | "minRooms"
    | "minBedrooms"
    | "minFloor"
    | "maxFloor"
    | "minArea"
    | "balconyAreaMin"
    | "balconyAreaMax"
    | "minBathrooms",
  field: ClientFormValues[typeof key],
): void {
  const hasValue = field.value !== undefined && !Number.isNaN(field.value);
  if (!hasValue) {
    return;
  }
  dto[key] = { value: field.value as number, lock: field.lock };
}

function appendLockedBoolean(
  dto: CreateClientPayload,
  key:
    | "excludeLastFloor"
    | "hasBalcony"
    | "goodView"
    | "elevator"
    | "centralHeating"
    | "airConditioner"
    | "furnished"
    | "parking",
  field: ClientFormValues[typeof key],
): void {
  const hasValue = field.value !== undefined;
  if (!hasValue) {
    return;
  }
  dto[key] = { value: field.value as boolean, lock: field.lock };
}

function appendLockedPartialRenovation(
  dto: CreateClientPayload,
  field: ClientFormValues["renovation"],
): void {
  const raw = field.value;
  const hasEnumValue =
    raw !== undefined &&
    raw !== "" &&
    (RENOVATION_VALUES as readonly string[]).includes(raw);
  if (!shouldEmitLockedPartial(field.lock, hasEnumValue)) {
    return;
  }
  const payload: LockedPartial<(typeof RENOVATION_VALUES)[number]> = {
    lock: field.lock,
  };
  if (hasEnumValue) {
    payload.value = raw;
  }
  dto.renovation = payload;
}

function appendLockedPartialBuildingCondition(
  dto: CreateClientPayload,
  field: ClientFormValues["buildingCondition"],
): void {
  const raw = field.value;
  const hasEnumValue =
    raw !== undefined &&
    raw !== "" &&
    (BUILDING_CONDITIONS as readonly string[]).includes(raw);
  if (!shouldEmitLockedPartial(field.lock, hasEnumValue)) {
    return;
  }
  const payload: LockedPartial<(typeof BUILDING_CONDITIONS)[number]> = {
    lock: field.lock,
  };
  if (hasEnumValue) {
    payload.value = raw;
  }
  dto.buildingCondition = payload;
}

function appendLockedPartialKitchenTypeField(
  dto: CreateClientPayload,
  field: ClientFormValues["kitchenType"],
): void {
  const raw = field.value;
  const hasEnumValue =
    raw !== undefined &&
    raw !== "" &&
    (KITCHEN_TYPES as readonly string[]).includes(raw);
  if (!shouldEmitLockedPartial(field.lock, hasEnumValue)) {
    return;
  }
  const payload: LockedPartial<(typeof KITCHEN_TYPES)[number]> = {
    lock: field.lock,
  };
  if (hasEnumValue) {
    payload.value = raw;
  }
  dto.kitchenType = payload;
}

function appendPet(dto: CreateClientPayload, pet: ClientFormValues["pet"]): void {
  const trimmed = pet.value?.trim();
  const hasValue = Boolean(trimmed);
  if (!shouldEmitLockedPartial(pet.lock, hasValue)) {
    return;
  }
  const payload: LockedPartial<string> = { lock: pet.lock };
  if (hasValue && trimmed) {
    payload.value = trimmed;
  }
  dto.pet = payload;
}

function appendProjectExclude(
  dto: CreateClientPayload,
  field: ClientFormValues["projectExclude"],
): void {
  const hasValue = field.value.length > 0;
  if (!shouldEmitLockedPartial(field.lock, hasValue)) {
    return;
  }
  const payload: LockedPartial<string[]> = { lock: field.lock };
  if (hasValue) {
    payload.value = field.value;
  }
  dto.projectExclude = payload;
}

export function buildCreateClientDto(values: ClientFormValues): CreateClientPayload {
  const dto: CreateClientPayload = {
    name: values.name,
    phones: values.phones,
    dealType: values.dealType,
    description: values.description,
    districts: { value: values.districts.value, lock: values.districts.lock },
    addresses: { value: values.addresses.value, lock: values.addresses.lock },
  };

  if (values.whatsapp?.trim()) {
    dto.whatsapp = values.whatsapp.trim();
  }

  appendLockedPartialNumber(dto, "budgetMin", values.budgetMin);
  appendLockedPartialNumber(dto, "budgetMax", values.budgetMax);

  if (values.status) {
    dto.status = values.status;
  }

  appendPet(dto, values.pet);

  const validPersons = (values.relatedPersons ?? []).filter(
    (person) => person.name?.trim(),
  );
  if (validPersons.length > 0) {
    dto.relatedPersons = validPersons;
  }

  appendLockedNumber(dto, "minRooms", values.minRooms);
  appendLockedNumber(dto, "minBedrooms", values.minBedrooms);
  appendLockedNumber(dto, "minFloor", values.minFloor);
  appendLockedNumber(dto, "maxFloor", values.maxFloor);
  appendLockedBoolean(dto, "excludeLastFloor", values.excludeLastFloor);

  appendLockedPartialRenovation(dto, values.renovation);
  appendLockedPartialBuildingCondition(dto, values.buildingCondition);
  appendLockedPartialKitchenTypeField(dto, values.kitchenType);

  appendProjectExclude(dto, values.projectExclude);

  appendLockedNumber(dto, "minArea", values.minArea);
  appendLockedBoolean(dto, "hasBalcony", values.hasBalcony);
  appendLockedNumber(dto, "balconyAreaMin", values.balconyAreaMin);
  appendLockedNumber(dto, "balconyAreaMax", values.balconyAreaMax);
  appendLockedBoolean(dto, "goodView", values.goodView);
  appendLockedBoolean(dto, "elevator", values.elevator);
  appendLockedBoolean(dto, "centralHeating", values.centralHeating);
  appendLockedBoolean(dto, "airConditioner", values.airConditioner);
  appendLockedBoolean(dto, "furnished", values.furnished);
  appendLockedNumber(dto, "minBathrooms", values.minBathrooms);
  appendLockedBoolean(dto, "parking", values.parking);
  appendLockedPartialNumber(dto, "minRentalPeriod", values.minRentalPeriod);

  const reminderIso = parseReminderDateToIso(values.reminderDate ?? "");
  if (reminderIso) {
    dto.reminderDate = reminderIso;
  }

  return dto;
}

export function buildUpdateClientDto(values: ClientFormValues): UpdateClientPayload {
  const payload = buildCreateClientDto(values) as UpdateClientPayload;
  payload.reminderDate = values.reminderDate?.trim()
    ? parseReminderDateToIso(values.reminderDate)
    : null;
  payload.status = values.status ? values.status : undefined;
  return payload;
}
