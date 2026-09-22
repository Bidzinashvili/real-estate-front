"use client";

import {
  BUILDING_AGE_TYPE_OPTIONS,
  BUILDING_CONDITION_OPTIONS,
  BUILDING_STRUCTURE_FIELD_LABEL,
} from "@/features/properties/addPropertyFormOptions";
import {
  buildingAgeTypeForCondition,
  isBuildingCondition,
  type BuildingAgeType,
  type BuildingCondition,
} from "@/features/properties/types";
import { OptionChips, OPTION_CHIPS_FORM_LABEL_CLASS_NAME } from "@/shared/ui/OptionChips";
import type { LockState } from "@/features/matching/matchingEnums";
import { FieldWithLock } from "@/widgets/ClientForm/PreferenceLockButton";

export type BuildingStructureSelection = {
  buildingCondition: BuildingCondition | "";
  buildingAgeType: BuildingAgeType | "";
};

type BuildingStructureFieldsProps = {
  idPrefix: string;
  buildingCondition: BuildingCondition | "" | null | undefined;
  buildingAgeType?: BuildingAgeType | "" | null;
  onChange: (next: BuildingStructureSelection) => void;
  showAgeType?: boolean;
  allowEmptyCondition?: boolean;
  size?: "compact" | "default";
  labelClassName?: string;
  lock?: LockState;
  onLockChange?: (nextLock: LockState) => void;
};

export function BuildingStructureFields({
  idPrefix,
  buildingCondition,
  buildingAgeType = "",
  onChange,
  showAgeType = false,
  allowEmptyCondition = false,
  size = "default",
  labelClassName = OPTION_CHIPS_FORM_LABEL_CLASS_NAME,
  lock,
  onLockChange,
}: BuildingStructureFieldsProps) {
  const conditionCandidate = buildingCondition ?? "";
  const selectedCondition = isBuildingCondition(conditionCandidate)
    ? conditionCandidate
    : "";
  const selectedAgeType = buildingAgeTypeForCondition(
    selectedCondition,
    buildingAgeType,
  );
  const shouldShowAgeType = showAgeType && selectedCondition === "NEW";

  function handleConditionChange(nextCondition: BuildingCondition | "") {
    onChange({
      buildingCondition: nextCondition,
      buildingAgeType: buildingAgeTypeForCondition(nextCondition, selectedAgeType) ?? "",
    });
  }

  function handleAgeTypeChange(nextAgeType: BuildingAgeType | "") {
    onChange({
      buildingCondition: selectedCondition,
      buildingAgeType: nextAgeType,
    });
  }

  const fields = (
    <div className="space-y-2">
      <OptionChips<BuildingCondition | "">
        id={`${idPrefix}BuildingCondition`}
        label={BUILDING_STRUCTURE_FIELD_LABEL}
        labelClassName={labelClassName}
        value={selectedCondition}
        onChange={handleConditionChange}
        options={BUILDING_CONDITION_OPTIONS}
        allowDeselect={allowEmptyCondition}
        size={size}
      />
      {shouldShowAgeType ? (
        <OptionChips<BuildingAgeType | "">
          id={`${idPrefix}BuildingAgeType`}
          aria-label="კორპუსის ქვეტიპი"
          value={selectedAgeType ?? ""}
          onChange={handleAgeTypeChange}
          options={BUILDING_AGE_TYPE_OPTIONS}
          allowDeselect
          size={size}
        />
      ) : null}
    </div>
  );

  if (lock !== undefined && onLockChange) {
    return (
      <FieldWithLock lock={lock} onLockChange={onLockChange}>
        {fields}
      </FieldWithLock>
    );
  }

  return fields;
}
