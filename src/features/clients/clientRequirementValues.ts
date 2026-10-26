import type {
  BuildingCondition,
  KitchenType,
  Renovation,
} from "@/features/clients/clientEnums";
import {
  BUILDING_CONDITIONS,
  KITCHEN_TYPES,
  RENOVATION_VALUES,
} from "@/features/clients/clientEnums";
import type { ClientPreferenceValue } from "@/features/matching/matchingEnums";
import {
  CLIENT_PREFERENCE_LABELS,
  isClientPreferenceValue,
} from "@/features/matching/matchingEnums";

export const CLIENT_REQUIREMENT_PREFERENCE_VALUES = [
  "TO_VERIFY",
  "DOES_NOT_MATTER",
  "NOT_SET",
] as const;

export type ClientRequirementPreference = (typeof CLIENT_REQUIREMENT_PREFERENCE_VALUES)[number];

export type ClientRenovationsRequirement =
  | Renovation[]
  | ClientRequirementPreference;

export type ClientBuildingConditionRequirement =
  | BuildingCondition
  | ClientRequirementPreference;

export type ClientKitchenTypeRequirement = KitchenType | ClientRequirementPreference;

export function isClientRequirementPreference(
  value: string,
): value is ClientRequirementPreference {
  return (CLIENT_REQUIREMENT_PREFERENCE_VALUES as readonly string[]).includes(value);
}

export function isRenovationsListValue(
  value: ClientRenovationsRequirement,
): value is Renovation[] {
  return Array.isArray(value);
}

export function isBuildingConditionEnum(
  value: string,
): value is BuildingCondition {
  return (BUILDING_CONDITIONS as readonly string[]).includes(value);
}

export function isKitchenTypeEnum(value: string): value is KitchenType {
  return (KITCHEN_TYPES as readonly string[]).includes(value);
}

export function isRenovationEnum(value: string): value is Renovation {
  return (RENOVATION_VALUES as readonly string[]).includes(value);
}

export function formatClientRequirementPreferenceLabel(
  value: ClientRequirementPreference,
): string {
  if (value === "NOT_SET") {
    return CLIENT_PREFERENCE_LABELS.NOT_SET;
  }
  if (value === "TO_VERIFY") {
    return CLIENT_PREFERENCE_LABELS.TO_VERIFY;
  }
  return CLIENT_PREFERENCE_LABELS.DOES_NOT_MATTER;
}

export function formatRenovationsRequirementDisplay(
  value: ClientRenovationsRequirement,
  renovationLabels: Record<Renovation, string>,
): string | null {
  if (isRenovationsListValue(value)) {
    if (value.length === 0) {
      return null;
    }
    return value.map((renovation) => renovationLabels[renovation]).join(", ");
  }
  if (value === "NOT_SET") {
    return null;
  }
  return formatClientRequirementPreferenceLabel(value);
}

export function formatBuildingConditionRequirementDisplay(
  value: ClientBuildingConditionRequirement | null | undefined,
  buildingLabels: Record<BuildingCondition, string>,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (isClientRequirementPreference(value)) {
    if (value === "NOT_SET") {
      return null;
    }
    return formatClientRequirementPreferenceLabel(value);
  }
  return buildingLabels[value];
}

export function formatKitchenTypeRequirementDisplay(
  value: ClientKitchenTypeRequirement | null | undefined,
  kitchenLabels: Record<KitchenType, string>,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (isClientRequirementPreference(value)) {
    if (value === "NOT_SET") {
      return null;
    }
    return formatClientRequirementPreferenceLabel(value);
  }
  return kitchenLabels[value];
}

export function formatClientPetDisplay(
  value: ClientPreferenceValue | null | undefined,
): string | null {
  if (value === null || value === undefined || value === "NOT_SET") {
    return null;
  }
  if (isClientPreferenceValue(value)) {
    return CLIENT_PREFERENCE_LABELS[value];
  }
  return null;
}
