import type { ClientDetail } from "@/features/clients/types";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import { emptyClientFormDefaults } from "@/features/clients/clientFormSchema";

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
    lock: lock ?? "none",
  };
}

function wrapLockedBoolean(
  value: boolean | null | undefined,
  lock: ClientFormValues["hasBalcony"]["lock"] | undefined,
): ClientFormValues["hasBalcony"] {
  return {
    value: value ?? undefined,
    lock: lock ?? "none",
  };
}

export function mapClientDetailToFormValues(client: ClientDetail): ClientFormValues {
  const req = client.requirements;
  return {
    ...emptyClientFormDefaults,
    name: client.name,
    phones: client.phones.length > 0 ? client.phones : [""],
    whatsapp: client.whatsapp ?? "",
    budgetMin: { value: client.budgetMin ?? undefined, lock: client.budgetMinLock ?? "none" },
    budgetMax: { value: client.budgetMax ?? undefined, lock: client.budgetMaxLock ?? "none" },
    dealType: client.dealType,
    description: client.description,
    pet: { value: client.pet ?? "", lock: client.petLock ?? "none" },
    districts: { value: client.districts, lock: client.districtsLock ?? "none" },
    addresses: { value: client.addresses, lock: client.addressesLock ?? "none" },
    status: client.status,
    reminderDate: isoToDatetimeLocal(client.reminderDate),
    relatedPersons: client.relatedPersons.map((person) => ({
      name: person.name,
      phone: person.phone ?? "",
      whatsapp: person.whatsapp ?? "",
      relationship: person.relationship ?? "",
      note: person.note ?? "",
    })),
    minRooms: wrapLockedNumber(req?.minRooms, req?.minRoomsLock),
    minBedrooms: wrapLockedNumber(req?.minBedrooms, req?.minBedroomsLock),
    minFloor: wrapLockedNumber(req?.minFloor, req?.minFloorLock),
    maxFloor: wrapLockedNumber(req?.maxFloor, req?.maxFloorLock),
    excludeLastFloor: req
      ? { value: req.excludeLastFloor, lock: req.excludeLastFloorLock ?? "none" }
      : { value: undefined, lock: "none" },
    renovation: {
      value: req?.renovation ?? "",
      lock: req?.renovationLock ?? "none",
    },
    buildingCondition: {
      value: req?.buildingCondition ?? "",
      lock: req?.buildingConditionLock ?? "none",
    },
    projectExclude: {
      value: req?.projectExclude ?? [],
      lock: req?.projectExcludeLock ?? "none",
    },
    minArea: wrapLockedNumber(req?.minArea, req?.minAreaLock),
    hasBalcony: wrapLockedBoolean(req?.hasBalcony ?? undefined, req?.hasBalconyLock),
    balconyAreaMin: wrapLockedNumber(req?.balconyAreaMin, req?.balconyAreaMinLock),
    balconyAreaMax: wrapLockedNumber(req?.balconyAreaMax, req?.balconyAreaMaxLock),
    goodView: wrapLockedBoolean(req?.goodView ?? undefined, req?.goodViewLock),
    elevator: wrapLockedBoolean(req?.elevator ?? undefined, req?.elevatorLock),
    centralHeating: wrapLockedBoolean(req?.centralHeating ?? undefined, req?.centralHeatingLock),
    airConditioner: wrapLockedBoolean(req?.airConditioner ?? undefined, req?.airConditionerLock),
    kitchenType: {
      value: req?.kitchenType ?? "",
      lock: req?.kitchenTypeLock ?? "none",
    },
    furnished: wrapLockedBoolean(req?.furnished ?? undefined, req?.furnishedLock),
    minBathrooms: wrapLockedNumber(req?.minBathrooms, req?.minBathroomsLock),
    parking: wrapLockedBoolean(req?.parking ?? undefined, req?.parkingLock),
    minRentalPeriod: {
      value: req?.minRentalPeriod ?? undefined,
      lock: req?.minRentalPeriodLock ?? "none",
    },
  };
}
