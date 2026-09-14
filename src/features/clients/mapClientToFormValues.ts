import type { ClientDetail } from "@/features/clients/types";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import { emptyClientFormDefaults } from "@/features/clients/clientFormSchema";
import type { ClientPreferenceValue } from "@/features/matching/matchingEnums";
import { isClientPreferenceValue } from "@/features/matching/matchingEnums";
import { persistEntityLock } from "@/features/matching/persistEntityLock";
import { normalizeGeorgianPhone } from "@/shared/lib/normalizeGeorgianPhone";

function isoToDatetimeLocal(iso: string | null): string {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const pad = (part: number) => String(part).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function wrapLockedNumber(
  value: number | null | undefined,
  lock: ClientFormValues["minRooms"]["lock"] | undefined,
): ClientFormValues["minRooms"] {
  return {
    value: value ?? undefined,
    lock: persistEntityLock(lock ?? "none"),
  };
}

function wrapLockedPreference(
  value: ClientPreferenceValue | undefined,
  lock: ClientFormValues["hasBalcony"]["lock"] | undefined,
): ClientFormValues["hasBalcony"] {
  return {
    value: value && isClientPreferenceValue(value) ? value : "NOT_SET",
    lock: persistEntityLock(lock ?? "none"),
  };
}

export function mapClientDetailToFormValues(client: ClientDetail): ClientFormValues {
  const req = client.requirements;
  return {
    ...emptyClientFormDefaults,
    name: client.name,
    phones: client.phones.length > 0 ? [...client.phones] : [""],
    whatsapp: client.whatsapp ? normalizeGeorgianPhone(client.whatsapp) : "",
    budgetMin: { value: client.budgetMin ?? undefined, lock: persistEntityLock(client.budgetMinLock ?? "none") },
    budgetMax: { value: client.budgetMax ?? undefined, lock: persistEntityLock(client.budgetMaxLock ?? "none") },
    dealType: client.dealType,
    description: client.description,
    pet: { value: client.pet ?? "", lock: persistEntityLock(client.petLock ?? "none") },
    districts: { value: client.districts, lock: persistEntityLock(client.districtsLock ?? "none") },
    addresses: { value: client.addresses, lock: persistEntityLock(client.addressesLock ?? "none") },
    labels: { value: client.labels, lock: persistEntityLock(client.labelsLock ?? "none") },
    status: client.status,
    outcomeSource: client.outcomeSource ?? "",
    reminderDate: isoToDatetimeLocal(client.reminderDate),
    relatedPersons: client.relatedPersons.map((person) => ({
      name: person.name,
      phone: person.phone ?? "",
      whatsapp: person.whatsapp ?? "",
      relationship: person.relationship ?? "",
      note: person.note ?? "",
    })),
    minRooms: wrapLockedNumber(req?.minRooms, req?.minRoomsLock),
    maxRooms: wrapLockedNumber(req?.maxRooms, req?.maxRoomsLock),
    minBedrooms: wrapLockedNumber(req?.minBedrooms, req?.minBedroomsLock),
    maxBedrooms: wrapLockedNumber(req?.maxBedrooms, req?.maxBedroomsLock),
    minFloor: wrapLockedNumber(req?.minFloor, req?.minFloorLock),
    maxFloor: wrapLockedNumber(req?.maxFloor, req?.maxFloorLock),
    excludeLastFloor: req
      ? { value: req.excludeLastFloor, lock: persistEntityLock(req.excludeLastFloorLock ?? "none") }
      : { value: false, lock: "none" },
    renovations: {
      value: req?.renovations ?? [],
      lock: persistEntityLock(req?.renovationsLock ?? "none"),
    },
    buildingCondition: {
      value: req?.buildingCondition ?? "",
      lock: persistEntityLock(req?.buildingConditionLock ?? "none"),
    },
    projectExclude: {
      value: req?.projectExclude ?? [],
      lock: persistEntityLock(req?.projectExcludeLock ?? "none"),
    },
    minArea: wrapLockedNumber(req?.minArea, req?.minAreaLock),
    maxArea: wrapLockedNumber(req?.maxArea, req?.maxAreaLock),
    hasBalcony: wrapLockedPreference(req?.hasBalcony, req?.hasBalconyLock),
    balconyAreaMin: wrapLockedNumber(req?.balconyAreaMin, req?.balconyAreaMinLock),
    balconyAreaMax: wrapLockedNumber(req?.balconyAreaMax, req?.balconyAreaMaxLock),
    goodView: wrapLockedPreference(req?.goodView, req?.goodViewLock),
    elevator: wrapLockedPreference(req?.elevator, req?.elevatorLock),
    centralHeating: wrapLockedPreference(req?.centralHeating, req?.centralHeatingLock),
    airConditioner: wrapLockedPreference(req?.airConditioner, req?.airConditionerLock),
    kitchenType: {
      value: req?.kitchenType ?? "",
      lock: persistEntityLock(req?.kitchenTypeLock ?? "none"),
    },
    furnished: wrapLockedPreference(req?.furnished, req?.furnishedLock),
    minBathrooms: wrapLockedNumber(req?.minBathrooms, req?.minBathroomsLock),
    maxBathrooms: wrapLockedNumber(req?.maxBathrooms, req?.maxBathroomsLock),
    parking: wrapLockedPreference(req?.parking, req?.parkingLock),
    minRentalPeriod: {
      value: req?.minRentalPeriod ?? undefined,
      lock: persistEntityLock(req?.minRentalPeriodLock ?? "none"),
    },
  };
}
