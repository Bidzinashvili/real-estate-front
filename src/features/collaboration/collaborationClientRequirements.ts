import type { ClientRequirements } from "@/features/clients/types";
import type { ClientPreferenceValue } from "@/features/matching/matchingEnums";
import type { CollaborationClientRequirements } from "@/features/collaboration/collaborationApi.types";
import type {
  ClientBuildingConditionRequirement,
  ClientKitchenTypeRequirement,
  ClientRenovationsRequirement,
} from "@/features/clients/clientRequirementValues";
import { isClientRequirementPreference } from "@/features/clients/clientRequirementValues";
import { isRenovationEnum } from "@/features/clients/clientRequirementValues";
import { isBuildingConditionEnum, isKitchenTypeEnum } from "@/features/clients/clientRequirementValues";

const DISPLAY_PLACEHOLDER_TIMESTAMP = "1970-01-01T00:00:00.000Z";

function mapCollaborationRenovations(
  rawRenovations: CollaborationClientRequirements["renovations"],
): ClientRenovationsRequirement {
  if (!rawRenovations) {
    return "NOT_SET";
  }
  if (rawRenovations.length === 1 && isClientRequirementPreference(rawRenovations[0])) {
    return rawRenovations[0];
  }
  const renovationList = rawRenovations.filter((entry) => isRenovationEnum(entry));
  return renovationList.length > 0 ? renovationList : "NOT_SET";
}

function mapCollaborationBuildingCondition(
  rawValue: string | null | undefined,
): ClientBuildingConditionRequirement {
  if (!rawValue) {
    return "NOT_SET";
  }
  if (isClientRequirementPreference(rawValue)) {
    return rawValue;
  }
  if (isBuildingConditionEnum(rawValue)) {
    return rawValue;
  }
  return "NOT_SET";
}

function mapCollaborationKitchenType(
  rawValue: string | null | undefined,
): ClientKitchenTypeRequirement {
  if (!rawValue) {
    return "NOT_SET";
  }
  if (isClientRequirementPreference(rawValue)) {
    return rawValue;
  }
  if (isKitchenTypeEnum(rawValue)) {
    return rawValue;
  }
  return "NOT_SET";
}

export function mapCollaborationRequirementsToClientRequirements(
  clientId: string,
  raw: CollaborationClientRequirements | null | undefined,
): ClientRequirements | null {
  if (!raw) {
    return null;
  }

  return {
    id: "",
    clientId,
    minRooms: raw.minRooms ?? null,
    maxRooms: raw.maxRooms ?? null,
    minBedrooms: raw.minBedrooms ?? null,
    maxBedrooms: raw.maxBedrooms ?? null,
    minFloor: raw.minFloor ?? null,
    maxFloor: raw.maxFloor ?? null,
    excludeLastFloor: raw.excludeLastFloor ?? false,
    renovations: mapCollaborationRenovations(raw.renovations),
    buildingCondition: mapCollaborationBuildingCondition(raw.buildingCondition),
    projectExclude: raw.projectExclude ?? [],
    minArea: raw.minArea ?? null,
    maxArea: raw.maxArea ?? null,
    hasBalcony: (raw.hasBalcony ?? "NOT_SET") as ClientPreferenceValue,
    balconyAreaMin: raw.balconyAreaMin ?? null,
    balconyAreaMax: raw.balconyAreaMax ?? null,
    goodView: (raw.goodView ?? "NOT_SET") as ClientPreferenceValue,
    elevator: (raw.elevator ?? "NOT_SET") as ClientPreferenceValue,
    centralHeating: (raw.centralHeating ?? "NOT_SET") as ClientPreferenceValue,
    airConditioner: (raw.airConditioner ?? "NOT_SET") as ClientPreferenceValue,
    kitchenType: mapCollaborationKitchenType(raw.kitchenType),
    furnished: (raw.furnished ?? "NOT_SET") as ClientPreferenceValue,
    minBathrooms: raw.minBathrooms ?? null,
    maxBathrooms: raw.maxBathrooms ?? null,
    parking: (raw.parking ?? "NOT_SET") as ClientPreferenceValue,
    minRentalPeriod: raw.minRentalPeriod ?? null,
    createdAt: DISPLAY_PLACEHOLDER_TIMESTAMP,
    updatedAt: DISPLAY_PLACEHOLDER_TIMESTAMP,
  };
}
