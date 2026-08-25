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
import { asNullableString } from "@/shared/lib/jsonValue";
import {
  coalesceLock,
  readParallelLock,
} from "@/features/clients/parseClientApiLocks";
import { isClientPreferenceValue } from "@/features/matching/matchingEnums";
import type { ClientPreferenceValue } from "@/features/matching/matchingEnums";
import { persistEntityLock } from "@/features/matching/persistEntityLock";
import { parseEntityVerificationFields } from "@/features/lifecycle/parseVerificationFields";
import { parseClientStatus } from "@/features/clients/clientEnums";
import { normalizeClientProfileCompact } from "@/features/clientProfiles/normalizers";

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
  return persistEntityLock(
    coalesceLock(coalesceLock(parsedLock, fromRequirements), fromClientRoot),
  );
}

function readPreferenceValue(
  value: ClientPreferenceValue | string | undefined | null,
): ClientPreferenceValue {
  if (typeof value === "string" && isClientPreferenceValue(value)) {
    return value;
  }
  return "NOT_SET";
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
    maxRooms: requirements.maxRooms?.value ?? null,
    maxRoomsLock: mergeRequirementLock(
      requirements.maxRooms?.lock ?? "none",
      record,
      clientRecord,
      "maxRooms",
    ),
    minBedrooms: requirements.minBedrooms.value,
    minBedroomsLock: mergeRequirementLock(
      requirements.minBedrooms.lock,
      record,
      clientRecord,
      "minBedrooms",
    ),
    maxBedrooms: requirements.maxBedrooms?.value ?? null,
    maxBedroomsLock: mergeRequirementLock(
      requirements.maxBedrooms?.lock ?? "none",
      record,
      clientRecord,
      "maxBedrooms",
    ),
    minFloor: requirements.minFloor.value,
    minFloorLock: mergeRequirementLock(requirements.minFloor.lock, record, clientRecord, "minFloor"),
    maxFloor: requirements.maxFloor.value,
    maxFloorLock: mergeRequirementLock(requirements.maxFloor.lock, record, clientRecord, "maxFloor"),
    excludeLastFloor: requirements.excludeLastFloor.value ?? false,
    excludeLastFloorLock: persistEntityLock(
      mergeRequirementLock(
        requirements.excludeLastFloor.lock,
        record,
        clientRecord,
        "excludeLastFloor",
      ),
    ),
    renovations: Array.isArray(requirements.renovations?.value)
      ? requirements.renovations.value
      : [],
    renovationsLock: persistEntityLock(
      mergeRequirementLock(
        requirements.renovations?.lock ?? "none",
        record,
        clientRecord,
        "renovations",
      ),
    ),
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
    maxArea: requirements.maxArea?.value ?? null,
    maxAreaLock: mergeRequirementLock(
      requirements.maxArea?.lock ?? "none",
      record,
      clientRecord,
      "maxArea",
    ),
    hasBalcony: readPreferenceValue(requirements.hasBalcony?.value),
    hasBalconyLock: mergeRequirementLock(
      requirements.hasBalcony?.lock ?? "none",
      record,
      clientRecord,
      "hasBalcony",
    ),
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
    goodView: readPreferenceValue(requirements.goodView?.value),
    goodViewLock: mergeRequirementLock(
      requirements.goodView?.lock ?? "none",
      record,
      clientRecord,
      "goodView",
    ),
    elevator: readPreferenceValue(requirements.elevator?.value),
    elevatorLock: mergeRequirementLock(
      requirements.elevator?.lock ?? "none",
      record,
      clientRecord,
      "elevator",
    ),
    centralHeating: readPreferenceValue(requirements.centralHeating?.value),
    centralHeatingLock: mergeRequirementLock(
      requirements.centralHeating?.lock ?? "none",
      record,
      clientRecord,
      "centralHeating",
    ),
    airConditioner: readPreferenceValue(requirements.airConditioner?.value),
    airConditionerLock: mergeRequirementLock(
      requirements.airConditioner?.lock ?? "none",
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
    furnished: readPreferenceValue(requirements.furnished?.value),
    furnishedLock: mergeRequirementLock(
      requirements.furnished?.lock ?? "none",
      record,
      clientRecord,
      "furnished",
    ),
    minBathrooms: requirements.minBathrooms.value,
    minBathroomsLock: mergeRequirementLock(
      requirements.minBathrooms.lock,
      record,
      clientRecord,
      "minBathrooms",
    ),
    maxBathrooms: requirements.maxBathrooms?.value ?? null,
    maxBathroomsLock: mergeRequirementLock(
      requirements.maxBathrooms?.lock ?? "none",
      record,
      clientRecord,
      "maxBathrooms",
    ),
    parking: readPreferenceValue(requirements.parking?.value),
    parkingLock: mergeRequirementLock(
      requirements.parking?.lock ?? "none",
      record,
      clientRecord,
      "parking",
    ),
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
    clientProfileId:
      asNullableString(record.clientProfileId) ??
      normalizeClientProfileCompact(record.clientProfile)?.id ??
      null,
    clientProfile: normalizeClientProfileCompact(record.clientProfile),
    phones: client.phones ?? [],
    districts: client.districts.value ?? [],
    districtsLock: persistEntityLock(
      coalesceLock(client.districts.lock, readParallelLock(record, "districts")),
    ),
    addresses: client.addresses.value ?? [],
    addressesLock: persistEntityLock(
      coalesceLock(client.addresses.lock, readParallelLock(record, "addresses")),
    ),
    labels: client.labels?.value ?? [],
    labelsLock: client.labels
      ? persistEntityLock(coalesceLock(client.labels.lock, readParallelLock(record, "labels")))
      : undefined,
    budgetMin: client.budgetMin.value,
    budgetMinLock: persistEntityLock(
      coalesceLock(client.budgetMin.lock, readParallelLock(record, "budgetMin")),
    ),
    budgetMax: client.budgetMax.value,
    budgetMaxLock: persistEntityLock(
      coalesceLock(client.budgetMax.lock, readParallelLock(record, "budgetMax")),
    ),
    pet: client.pet.value,
    petLock: persistEntityLock(coalesceLock(client.pet.lock, readParallelLock(record, "pet"))),
    relatedPersons: client.relatedPersons ?? [],
    requirements: normalizeRequirements(client.requirements, record),
    status: parseClientStatus(client.status),
    archivedAt: asNullableString(record.archivedAt),
    ...parseEntityVerificationFields(record),
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
