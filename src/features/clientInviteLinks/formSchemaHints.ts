import type {
  ClientInviteFormSchema,
  ClientInviteFormSchemaField,
} from "@/features/clientInviteLinks/types";
import {
  BUILDING_CONDITION_LABELS,
  BUILDING_CONDITIONS,
  DEAL_TYPE_LABELS,
  DEAL_TYPES,
  KITCHEN_TYPE_LABELS,
  KITCHEN_TYPES,
  RENOVATION_LABELS,
  RENOVATION_VALUES,
} from "@/features/clients/clientEnums";

export type EnumSelectOption = { value: string; label: string };

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

export type PublicInviteFormSchemaDerived = {
  fieldDescriptions: Record<string, string>;
  dealTypeSelectOptions: EnumSelectOption[];
  renovationSelectOptions: EnumSelectOption[];
  buildingConditionSelectOptions: EnumSelectOption[];
  kitchenTypeSelectOptions: EnumSelectOption[];
  showLockForPath: (path: string) => boolean;
};

export function buildPublicInviteFormSchemaDerived(
  formSchema: ClientInviteFormSchema | null,
): PublicInviteFormSchemaDerived {
  const enums = formSchema?.enums;
  const usesLockShapeByKey = formSchema
    ? buildUsesLockShapeByFieldKey(formSchema.fields)
    : new Map<string, boolean | undefined>();

  const showLockForPath = (path: string): boolean => {
    if (!formSchema || formSchema.version !== "3") {
      return true;
    }
    const flag = usesLockShapeByKey.get(path);
    if (flag === false) {
      return false;
    }
    return true;
  };

  return {
    fieldDescriptions: formSchema ? buildFormSchemaDescriptionMap(formSchema.fields) : {},
    showLockForPath,
    dealTypeSelectOptions: resolveEnumSelectOptions(
      enums?.DealType,
      DEAL_TYPES,
      DEAL_TYPE_LABELS,
    ),
    renovationSelectOptions: resolveEnumSelectOptions(
      enums?.Renovation,
      RENOVATION_VALUES,
      RENOVATION_LABELS,
    ),
    buildingConditionSelectOptions: resolveEnumSelectOptions(
      enums?.BuildingCondition,
      BUILDING_CONDITIONS,
      BUILDING_CONDITION_LABELS,
    ),
    kitchenTypeSelectOptions: resolveEnumSelectOptions(
      enums?.KitchenType,
      KITCHEN_TYPES,
      KITCHEN_TYPE_LABELS,
    ),
  };
}

