import type {
  ClientInviteFormSchema,
  ClientInviteFormSchemaField,
} from "@/features/clientInviteLinks/types";
import { mapClientInviteDealTypeSelectOptions } from "@/features/clients/clientDealTypeDisplay";
import {
  BUILDING_CONDITION_LABELS,
  BUILDING_CONDITIONS,
  KITCHEN_TYPE_LABELS,
  KITCHEN_TYPES,
  RENOVATION_LABELS,
  RENOVATION_VALUES,
} from "@/features/clients/clientEnums";
import {
  CLIENT_PREFERENCE_LABELS,
  CLIENT_PREFERENCE_VALUES,
} from "@/features/matching/matchingEnums";

export type EnumSelectOption = { value: string; label: string };

const BUILDING_CONDITION_SCHEMA_LABELS = {
  ...BUILDING_CONDITION_LABELS,
  TO_VERIFY: CLIENT_PREFERENCE_LABELS.TO_VERIFY,
  DOES_NOT_MATTER: CLIENT_PREFERENCE_LABELS.DOES_NOT_MATTER,
  NOT_SET: CLIENT_PREFERENCE_LABELS.NOT_SET,
} as const;

const KITCHEN_TYPE_SCHEMA_LABELS = {
  ...KITCHEN_TYPE_LABELS,
  TO_VERIFY: CLIENT_PREFERENCE_LABELS.TO_VERIFY,
  DOES_NOT_MATTER: CLIENT_PREFERENCE_LABELS.DOES_NOT_MATTER,
  NOT_SET: CLIENT_PREFERENCE_LABELS.NOT_SET,
} as const;

const RENOVATION_SCHEMA_LABELS = {
  ...RENOVATION_LABELS,
  TO_VERIFY: CLIENT_PREFERENCE_LABELS.TO_VERIFY,
  DOES_NOT_MATTER: CLIENT_PREFERENCE_LABELS.DOES_NOT_MATTER,
  NOT_SET: CLIENT_PREFERENCE_LABELS.NOT_SET,
} as const;

function resolveEnumSelectOptions<T extends string>(
  valuesFromSchema: string[] | undefined,
  orderedFallback: readonly T[],
  labels: Record<T, string>,
): EnumSelectOption[] {
  const source =
    valuesFromSchema && valuesFromSchema.length > 0 ? valuesFromSchema : null;
  if (!source) {
    return orderedFallback.map((value) => ({
      value,
      label: labels[value],
    }));
  }
  return source.map((value) => ({
    value,
    label: value in labels ? labels[value as T] : value,
  }));
}

function buildFormSchemaDescriptionMap(
  fields: ClientInviteFormSchemaField[],
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const field of fields) {
    const path = field.nested ? `${field.nested}.${field.key}` : field.key;
    if (field.description) {
      map[path] = field.description;
    }
  }
  return map;
}

function buildUsesLockShapeByFieldKey(
  fields: ClientInviteFormSchemaField[],
): Map<string, boolean | undefined> {
  const map = new Map<string, boolean | undefined>();
  for (const field of fields) {
    const path = field.nested ? `${field.nested}.${field.key}` : field.key;
    map.set(path, field.usesLockShape);
  }
  return map;
}

function buildRequiredByFieldKey(
  fields: ClientInviteFormSchemaField[],
): Map<string, boolean> {
  const map = new Map<string, boolean>();
  for (const field of fields) {
    const path = field.nested ? `${field.nested}.${field.key}` : field.key;
    map.set(path, field.required);
  }
  return map;
}

export type PublicInviteFormSchemaDerived = {
  fieldDescriptions: Record<string, string>;
  dealTypeSelectOptions: EnumSelectOption[];
  clientPreferenceSelectOptions: EnumSelectOption[];
  renovationSelectOptions: EnumSelectOption[];
  buildingConditionSelectOptions: EnumSelectOption[];
  kitchenTypeSelectOptions: EnumSelectOption[];
  showLockForPath: (path: string) => boolean;
  isFieldRequired: (path: string) => boolean;
  formSchemaVersion: string | null;
};

export function buildPublicInviteFormSchemaDerived(
  formSchema: ClientInviteFormSchema | null,
): PublicInviteFormSchemaDerived {
  const enums = formSchema?.enums;
  const usesLockShapeByKey = formSchema
    ? buildUsesLockShapeByFieldKey(formSchema.fields)
    : new Map<string, boolean | undefined>();
  const requiredByFieldKey = formSchema
    ? buildRequiredByFieldKey(formSchema.fields)
    : new Map<string, boolean>();

  const showLockForPath = (path: string): boolean => {
    if (!formSchema) {
      return true;
    }
    if (!usesLockShapeByKey.has(path)) {
      return true;
    }
    return usesLockShapeByKey.get(path) !== false;
  };

  const isFieldRequired = (path: string): boolean => {
    if (!formSchema) {
      return false;
    }
    return requiredByFieldKey.get(path) === true;
  };

  return {
    fieldDescriptions: formSchema ? buildFormSchemaDescriptionMap(formSchema.fields) : {},
    showLockForPath,
    isFieldRequired,
    dealTypeSelectOptions: mapClientInviteDealTypeSelectOptions(enums?.DealType),
    renovationSelectOptions: resolveEnumSelectOptions(
      enums?.Renovation,
      RENOVATION_VALUES,
      RENOVATION_SCHEMA_LABELS,
    ),
    buildingConditionSelectOptions: resolveEnumSelectOptions(
      enums?.BuildingCondition,
      BUILDING_CONDITIONS,
      BUILDING_CONDITION_SCHEMA_LABELS,
    ),
    kitchenTypeSelectOptions: resolveEnumSelectOptions(
      enums?.KitchenType,
      KITCHEN_TYPES,
      KITCHEN_TYPE_SCHEMA_LABELS,
    ),
    clientPreferenceSelectOptions: resolveEnumSelectOptions(
      enums?.ClientPreferenceValue,
      CLIENT_PREFERENCE_VALUES,
      CLIENT_PREFERENCE_LABELS,
    ),
    formSchemaVersion: formSchema?.version ?? null,
  };
}

