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

  function walk(items: ClientInviteFormSchemaField[], prefix: string) {
    for (const field of items) {
      const path = prefix ? `${prefix}.${field.key}` : field.key;
      if (field.description) {
        map[path] = field.description;
      }
      if (field.nested && field.nested.length > 0) {
        walk(field.nested, path);
      }
    }
  }

  walk(fields, "");
  return map;
}

export type PublicInviteFormSchemaDerived = {
  fieldDescriptions: Record<string, string>;
  dealTypeSelectOptions: EnumSelectOption[];
  renovationSelectOptions: EnumSelectOption[];
  buildingConditionSelectOptions: EnumSelectOption[];
  kitchenTypeSelectOptions: EnumSelectOption[];
};

export function buildPublicInviteFormSchemaDerived(
  formSchema: ClientInviteFormSchema | null,
): PublicInviteFormSchemaDerived {
  const enums = formSchema?.enums;
  return {
    fieldDescriptions: formSchema ? buildFormSchemaDescriptionMap(formSchema.fields) : {},
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
