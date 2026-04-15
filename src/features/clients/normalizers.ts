import type {
  Client,
  ClientDetail,
  ClientRequirements,
  ClientsListResponse,
} from "@/features/clients/types";
import type {
  ClientApi,
  ClientDetailApi,
  ClientRequirementsApi,
  GetClientsResponse,
  LockState,
} from "@/features/clients/clientApi.types";
import type { JsonObject } from "@/shared/lib/jsonValue";
import {
  coalesceLock,
  readParallelLock,
} from "@/features/clients/parseClientApiLocks";

function mergeRequirementLock(
  parsedLock: LockState,
  requirementsRecord: JsonObject,
  clientRecord: JsonObject | undefined,
  fieldKey: string,
): LockState {
  const fromRequirements = readParallelLock(requirementsRecord, fieldKey);
  const fromClientRoot = clientRecord
    ? readParallelLock(clientRecord, fieldKey)
    : undefined;
  return coalesceLock(coalesceLock(parsedLock, fromRequirements), fromClientRoot);
}

function normalizeRequirements(
  requirements: ClientRequirementsApi | null,
  clientRecord: JsonObject | undefined,
): ClientRequirements | null {
  if (!requirements) {
    return null;
  }
  const record: JsonObject = requirements as JsonObject;

  return {
    ...requirements,
    minRooms: requirements.minRooms.value,
    minRoomsLock: mergeRequirementLock(requirements.minRooms.lock, record, clientRecord, "minRooms"),
    minBedrooms: requirements.minBedrooms.value,
    minBedroomsLock: mergeRequirementLock(
      requirements.minBedrooms.lock,
      record,
      clientRecord,
      "minBedrooms",
    ),
    minFloor: requirements.minFloor.value,
    minFloorLock: mergeRequirementLock(requirements.minFloor.lock, record, clientRecord, "minFloor"),
    maxFloor: requirements.maxFloor.value,
    maxFloorLock: mergeRequirementLock(requirements.maxFloor.lock, record, clientRecord, "maxFloor"),
    excludeLastFloor: requirements.excludeLastFloor.value ?? false,
    excludeLastFloorLock: mergeRequirementLock(
      requirements.excludeLastFloor.lock,
      record,
      clientRecord,
      "excludeLastFloor",
    ),
    renovation: requirements.renovation.value,
    renovationLock: mergeRequirementLock(requirements.renovation.lock, record, clientRecord, "renovation"),
    buildingCondition: requirements.buildingCondition.value,
    buildingConditionLock: mergeRequirementLock(
      requirements.buildingCondition.lock,
      record,
      clientRecord,
      "buildingCondition",
    ),
    projectExclude: requirements.projectExclude.value ?? [],
    projectExcludeLock: mergeRequirementLock(
      requirements.projectExclude.lock,
      record,
      clientRecord,
      "projectExclude",
    ),
    minArea: requirements.minArea.value,
    minAreaLock: mergeRequirementLock(requirements.minArea.lock, record, clientRecord, "minArea"),
    hasBalcony: requirements.hasBalcony.value,
    hasBalconyLock: mergeRequirementLock(requirements.hasBalcony.lock, record, clientRecord, "hasBalcony"),
    balconyAreaMin: requirements.balconyAreaMin.value,
    balconyAreaMinLock: mergeRequirementLock(
      requirements.balconyAreaMin.lock,
      record,
      clientRecord,
      "balconyAreaMin",
    ),
    balconyAreaMax: requirements.balconyAreaMax.value,
    balconyAreaMaxLock: mergeRequirementLock(
      requirements.balconyAreaMax.lock,
      record,
      clientRecord,
      "balconyAreaMax",
    ),
    goodView: requirements.goodView.value,
    goodViewLock: mergeRequirementLock(requirements.goodView.lock, record, clientRecord, "goodView"),
    elevator: requirements.elevator.value,
    elevatorLock: mergeRequirementLock(requirements.elevator.lock, record, clientRecord, "elevator"),
    centralHeating: requirements.centralHeating.value,
    centralHeatingLock: mergeRequirementLock(
      requirements.centralHeating.lock,
      record,
      clientRecord,
      "centralHeating",
    ),
    airConditioner: requirements.airConditioner.value,
    airConditionerLock: mergeRequirementLock(
      requirements.airConditioner.lock,
      record,
      clientRecord,
      "airConditioner",
    ),
    kitchenType: requirements.kitchenType.value,
    kitchenTypeLock: mergeRequirementLock(
      requirements.kitchenType.lock,
      record,
      clientRecord,
      "kitchenType",
    ),
    furnished: requirements.furnished.value,
    furnishedLock: mergeRequirementLock(requirements.furnished.lock, record, clientRecord, "furnished"),
    minBathrooms: requirements.minBathrooms.value,
    minBathroomsLock: mergeRequirementLock(
      requirements.minBathrooms.lock,
      record,
      clientRecord,
      "minBathrooms",
    ),
    parking: requirements.parking.value,
    parkingLock: mergeRequirementLock(requirements.parking.lock, record, clientRecord, "parking"),
    minRentalPeriod: requirements.minRentalPeriod.value,
    minRentalPeriodLock: mergeRequirementLock(
      requirements.minRentalPeriod.lock,
      record,
      clientRecord,
      "minRentalPeriod",
    ),
  };
}

export function normalizeClient(client: ClientApi): Client {
  const record: JsonObject = client as JsonObject;

  return {
    ...client,
    phones: client.phones ?? [],
    districts: client.districts.value ?? [],
    districtsLock: coalesceLock(client.districts.lock, readParallelLock(record, "districts")),
    addresses: client.addresses.value ?? [],
    addressesLock: coalesceLock(client.addresses.lock, readParallelLock(record, "addresses")),
    budgetMin: client.budgetMin.value,
    budgetMinLock: coalesceLock(client.budgetMin.lock, readParallelLock(record, "budgetMin")),
    budgetMax: client.budgetMax.value,
    budgetMaxLock: coalesceLock(client.budgetMax.lock, readParallelLock(record, "budgetMax")),
    pet: client.pet.value,
    petLock: coalesceLock(client.pet.lock, readParallelLock(record, "pet")),
    relatedPersons: client.relatedPersons ?? [],
    requirements: normalizeRequirements(client.requirements, record),
  };
}

export function normalizeClientDetail(detail: ClientDetailApi): ClientDetail {
  const base = normalizeClient(detail);
  return {
    ...base,
    comments: detail.comments ?? [],
    internalComments: detail.internalComments ?? [],
  };
}

export function normalizeClientsListResponse(
  response: GetClientsResponse,
): ClientsListResponse {
  return {
    ...response,
    clients: response.clients.map((client) => normalizeClient(client)),
  };
}
