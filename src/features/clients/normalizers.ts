import type {
  Client,
  ClientDetail,
  ClientRequirements,
  ClientsListResponse,
} from "@/features/clients/types";
import type {
  ClientApi,
  ClientDetailApi,
  GetClientsResponse,
  LockState,
} from "@/features/clients/clientApi.types";
import type { JsonObject, JsonValue } from "@/shared/lib/jsonValue";
import { asBoolean, asNullableString, asNumber, asString, isJsonObject } from "@/shared/lib/jsonValue";
import {
  coalesceLock,
  parseLockedBoolean,
  parseLockedBuildingCondition,
  parseLockedKitchenType,
  parseLockedNumberNullable,
  parseLockedPreference,
  parseLockedRenovations,
  parseLockedStringArray,
  parseLockedStringNullable,
  readParallelLock,
} from "@/features/clients/parseClientApiLocks";
import { persistEntityLock } from "@/features/matching/persistEntityLock";
import { parseEntityVerificationFields } from "@/features/lifecycle/parseVerificationFields";
import { isDealType, parseClientStatus } from "@/features/clients/clientEnums";
import { normalizeClientProfileCompact } from "@/features/clientProfiles/normalizers";
import { parseReminderSummary } from "@/features/reminders/reminderSummary";
import { parseRecordColor } from "@/features/recordColor/recordColor";
import { isDatabaseListScope } from "@/features/databaseList/databaseListScope";

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

function readRequirementRaw(
  requirementsRecord: JsonObject,
  clientRecord: JsonObject | undefined,
  fieldKey: string,
): JsonValue | undefined {
  if (requirementsRecord[fieldKey] !== undefined) {
    return requirementsRecord[fieldKey];
  }
  return clientRecord?.[fieldKey];
}

function resolveRequirementsRecord(
  requirements: JsonValue | null | undefined,
  clientRecord: JsonObject,
): JsonObject | null {
  if (isJsonObject(requirements)) {
    return requirements;
  }
  const rootRequirementKeys = [
    "minRooms",
    "maxRooms",
    "minBedrooms",
    "maxBedrooms",
    "minFloor",
    "maxFloor",
    "minArea",
    "maxArea",
  ];
  const hasRootRequirements = rootRequirementKeys.some(
    (fieldKey) => clientRecord[fieldKey] !== undefined,
  );
  return hasRootRequirements ? clientRecord : null;
}

function normalizeRequirements(
  requirements: JsonValue | null | undefined,
  clientRecord: JsonObject,
): ClientRequirements | null {
  const record = resolveRequirementsRecord(requirements, clientRecord);
  if (!record) {
    return null;
  }

  const minRooms = parseLockedNumberNullable(
    readRequirementRaw(record, clientRecord, "minRooms"),
  );
  const maxRooms = parseLockedNumberNullable(
    readRequirementRaw(record, clientRecord, "maxRooms"),
  );
  const minBedrooms = parseLockedNumberNullable(
    readRequirementRaw(record, clientRecord, "minBedrooms"),
  );
  const maxBedrooms = parseLockedNumberNullable(
    readRequirementRaw(record, clientRecord, "maxBedrooms"),
  );
  const minFloor = parseLockedNumberNullable(
    readRequirementRaw(record, clientRecord, "minFloor"),
  );
  const maxFloor = parseLockedNumberNullable(
    readRequirementRaw(record, clientRecord, "maxFloor"),
  );
  const excludeLastFloor = parseLockedBoolean(
    readRequirementRaw(record, clientRecord, "excludeLastFloor"),
    false,
  );
  const renovations = parseLockedRenovations(
    readRequirementRaw(record, clientRecord, "renovations"),
  );
  const buildingCondition = parseLockedBuildingCondition(
    readRequirementRaw(record, clientRecord, "buildingCondition"),
  );
  const projectExclude = parseLockedStringArray(
    readRequirementRaw(record, clientRecord, "projectExclude"),
  );
  const minArea = parseLockedNumberNullable(
    readRequirementRaw(record, clientRecord, "minArea"),
  );
  const maxArea = parseLockedNumberNullable(
    readRequirementRaw(record, clientRecord, "maxArea"),
  );
  const hasBalcony = parseLockedPreference(
    readRequirementRaw(record, clientRecord, "hasBalcony"),
  );
  const balconyAreaMin = parseLockedNumberNullable(
    readRequirementRaw(record, clientRecord, "balconyAreaMin"),
  );
  const balconyAreaMax = parseLockedNumberNullable(
    readRequirementRaw(record, clientRecord, "balconyAreaMax"),
  );
  const goodView = parseLockedPreference(
    readRequirementRaw(record, clientRecord, "goodView"),
  );
  const elevator = parseLockedPreference(
    readRequirementRaw(record, clientRecord, "elevator"),
  );
  const centralHeating = parseLockedPreference(
    readRequirementRaw(record, clientRecord, "centralHeating"),
  );
  const airConditioner = parseLockedPreference(
    readRequirementRaw(record, clientRecord, "airConditioner"),
  );
  const kitchenType = parseLockedKitchenType(
    readRequirementRaw(record, clientRecord, "kitchenType"),
  );
  const furnished = parseLockedPreference(
    readRequirementRaw(record, clientRecord, "furnished"),
  );
  const minBathrooms = parseLockedNumberNullable(
    readRequirementRaw(record, clientRecord, "minBathrooms"),
  );
  const maxBathrooms = parseLockedNumberNullable(
    readRequirementRaw(record, clientRecord, "maxBathrooms"),
  );
  const parking = parseLockedPreference(
    readRequirementRaw(record, clientRecord, "parking"),
  );
  const minRentalPeriod = parseLockedNumberNullable(
    readRequirementRaw(record, clientRecord, "minRentalPeriod"),
  );

  return {
    id: asString(record.id),
    clientId: asString(record.clientId) || asString(clientRecord.id),
    minRooms: minRooms.value,
    minRoomsLock: mergeRequirementLock(minRooms.lock, record, clientRecord, "minRooms"),
    maxRooms: maxRooms.value,
    maxRoomsLock: mergeRequirementLock(maxRooms.lock, record, clientRecord, "maxRooms"),
    minBedrooms: minBedrooms.value,
    minBedroomsLock: mergeRequirementLock(
      minBedrooms.lock,
      record,
      clientRecord,
      "minBedrooms",
    ),
    maxBedrooms: maxBedrooms.value,
    maxBedroomsLock: mergeRequirementLock(
      maxBedrooms.lock,
      record,
      clientRecord,
      "maxBedrooms",
    ),
    minFloor: minFloor.value,
    minFloorLock: mergeRequirementLock(minFloor.lock, record, clientRecord, "minFloor"),
    maxFloor: maxFloor.value,
    maxFloorLock: mergeRequirementLock(maxFloor.lock, record, clientRecord, "maxFloor"),
    excludeLastFloor: excludeLastFloor.value,
    excludeLastFloorLock: persistEntityLock(
      mergeRequirementLock(
        excludeLastFloor.lock,
        record,
        clientRecord,
        "excludeLastFloor",
      ),
    ),
    renovations: renovations.value,
    renovationsLock: persistEntityLock(
      mergeRequirementLock(renovations.lock, record, clientRecord, "renovations"),
    ),
    buildingCondition: buildingCondition.value,
    buildingConditionLock: mergeRequirementLock(
      buildingCondition.lock,
      record,
      clientRecord,
      "buildingCondition",
    ),
    projectExclude: projectExclude.value,
    projectExcludeLock: mergeRequirementLock(
      projectExclude.lock,
      record,
      clientRecord,
      "projectExclude",
    ),
    minArea: minArea.value,
    minAreaLock: mergeRequirementLock(minArea.lock, record, clientRecord, "minArea"),
    maxArea: maxArea.value,
    maxAreaLock: mergeRequirementLock(maxArea.lock, record, clientRecord, "maxArea"),
    hasBalcony: hasBalcony.value,
    hasBalconyLock: mergeRequirementLock(
      hasBalcony.lock,
      record,
      clientRecord,
      "hasBalcony",
    ),
    balconyAreaMin: balconyAreaMin.value,
    balconyAreaMinLock: mergeRequirementLock(
      balconyAreaMin.lock,
      record,
      clientRecord,
      "balconyAreaMin",
    ),
    balconyAreaMax: balconyAreaMax.value,
    balconyAreaMaxLock: mergeRequirementLock(
      balconyAreaMax.lock,
      record,
      clientRecord,
      "balconyAreaMax",
    ),
    goodView: goodView.value,
    goodViewLock: mergeRequirementLock(goodView.lock, record, clientRecord, "goodView"),
    elevator: elevator.value,
    elevatorLock: mergeRequirementLock(elevator.lock, record, clientRecord, "elevator"),
    centralHeating: centralHeating.value,
    centralHeatingLock: mergeRequirementLock(
      centralHeating.lock,
      record,
      clientRecord,
      "centralHeating",
    ),
    airConditioner: airConditioner.value,
    airConditionerLock: mergeRequirementLock(
      airConditioner.lock,
      record,
      clientRecord,
      "airConditioner",
    ),
    kitchenType: kitchenType.value,
    kitchenTypeLock: mergeRequirementLock(
      kitchenType.lock,
      record,
      clientRecord,
      "kitchenType",
    ),
    furnished: furnished.value,
    furnishedLock: mergeRequirementLock(furnished.lock, record, clientRecord, "furnished"),
    minBathrooms: minBathrooms.value,
    minBathroomsLock: mergeRequirementLock(
      minBathrooms.lock,
      record,
      clientRecord,
      "minBathrooms",
    ),
    maxBathrooms: maxBathrooms.value,
    maxBathroomsLock: mergeRequirementLock(
      maxBathrooms.lock,
      record,
      clientRecord,
      "maxBathrooms",
    ),
    parking: parking.value,
    parkingLock: mergeRequirementLock(parking.lock, record, clientRecord, "parking"),
    minRentalPeriod: minRentalPeriod.value,
    minRentalPeriodLock: mergeRequirementLock(
      minRentalPeriod.lock,
      record,
      clientRecord,
      "minRentalPeriod",
    ),
    createdAt: asString(record.createdAt),
    updatedAt: asString(record.updatedAt),
  };
}

function parseClientDealType(value: JsonValue | undefined): Client["dealType"] {
  if (typeof value === "string" && isDealType(value)) {
    return value;
  }
  return "SALE";
}

export function normalizeClient(client: ClientApi): Client {
  const record: JsonObject = client as JsonObject;
  const districts = parseLockedStringArray(record.districts);
  const addresses = parseLockedStringArray(record.addresses);
  const labels = parseLockedStringArray(record.labels);
  const budgetMin = parseLockedNumberNullable(record.budgetMin);
  const budgetMax = parseLockedNumberNullable(record.budgetMax);
  const pet = parseLockedStringNullable(record.pet);
  const phones = Array.isArray(client.phones)
    ? client.phones.filter((phone): phone is string => typeof phone === "string")
    : [];

  return {
    ...client,
    userId: asString(record.userId),
    ownedByViewer: typeof record.ownedByViewer === "boolean" ? record.ownedByViewer : null,
    hideFromOthers: asBoolean(record.hideFromOthers),
    color: parseRecordColor(record.color),
    name: asString(record.name),
    description: asString(record.description),
    whatsapp: asNullableString(record.whatsapp),
    dealType: parseClientDealType(record.dealType),
    clientProfileId:
      asNullableString(record.clientProfileId) ??
      normalizeClientProfileCompact(record.clientProfile)?.id ??
      null,
    clientProfile: normalizeClientProfileCompact(record.clientProfile),
    phones,
    districts: districts.value,
    districtsLock: persistEntityLock(
      coalesceLock(districts.lock, readParallelLock(record, "districts")),
    ),
    addresses: addresses.value,
    addressesLock: persistEntityLock(
      coalesceLock(addresses.lock, readParallelLock(record, "addresses")),
    ),
    labels: labels.value,
    labelsLock:
      record.labels === undefined
        ? undefined
        : persistEntityLock(
            coalesceLock(labels.lock, readParallelLock(record, "labels")),
          ),
    budgetMin: budgetMin.value,
    budgetMinLock: persistEntityLock(
      coalesceLock(budgetMin.lock, readParallelLock(record, "budgetMin")),
    ),
    budgetMax: budgetMax.value,
    budgetMaxLock: persistEntityLock(
      coalesceLock(budgetMax.lock, readParallelLock(record, "budgetMax")),
    ),
    pet: pet.value,
    petLock: persistEntityLock(coalesceLock(pet.lock, readParallelLock(record, "pet"))),
    relatedPersons: client.relatedPersons ?? [],
    requirements: normalizeRequirements(record.requirements, record),
    status: parseClientStatus(client.status),
    archivedAt: asNullableString(record.archivedAt),
    reminderSummary: parseReminderSummary(record.reminderSummary),
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
  const activeCountRaw = asNumber(response.activeCount, 0);
  return {
    ...response,
    activeCount: activeCountRaw < 0 ? 0 : Math.floor(activeCountRaw),
    scope:
      typeof response.scope === "string" && isDatabaseListScope(response.scope)
        ? response.scope
        : null,
    clients: response.clients.map((client) => normalizeClient(client)),
  };
}
