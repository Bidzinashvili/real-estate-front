"use client";

import type { DealType } from "@/features/properties/dealType";
import type {
  CommercialStatus,
  LandCategory,
  PropertyApartmentUpdate,
  PropertyCommercialUpdate,
  PropertyPrivateHouseUpdate,
} from "@/features/properties/types";
import { parseRenovationForForm } from "@/features/properties/types";
import { HashtagPicker } from "@/shared/components/HashtagPicker";
import {
  LAND_CATEGORY_SELECT_OPTIONS,
  LAND_USAGE_SELECT_OPTIONS,
  RENOVATION_SELECT_OPTIONS,
  BUILDING_CONDITION_OPTIONS,
  KITCHEN_TYPE_OPTIONS,
} from "@/features/properties/addPropertyFormOptions";
import type {
  PropertyFormLandPlot,
  PropertyFormValues,
} from "@/features/properties/payloadBuilder";
import { SelectField } from "@/widgets/AddProperty/addPropertyFormFields";
import {
  EditableCheckbox,
  EditableNumericTextInput,
  EditableTwoDigitNumericInput,
} from "@/widgets/PropertyDetails/PropertyFormControls";
import { MinRentalPeriodEditField } from "@/widgets/PropertyDetails/MinRentalPeriodEditField";
import { parseDecimalInput, parseIntegerInput } from "@/shared/lib/parseNumericInput";
import type { LockState, PropertyFieldLockKey, PropertyFieldLocks } from "@/features/matching/matchingEnums";
import { PreferenceLockButton, FieldWithLock, MatchingLockHint } from "@/widgets/ClientForm/PreferenceLockButton";
import { applyPropertyFieldLock, readPropertyFieldLock } from "@/features/matching/persistEntityLock";
import { VerifiableBooleanField } from "@/widgets/AddProperty/VerifiableBooleanField";
import { NeedsVerificationToggle } from "@/shared/components/NeedsVerificationToggle";
import {
  applyBooleanUiState,
  booleanUiStateFromApartment,
  type ApartmentBooleanVerifiableField,
} from "@/features/properties/apartmentVerification";

type ApartmentProps = {
  dealType: DealType;
  apartment: NonNullable<PropertyFormValues["apartment"]>;
  setApartment: (patch: PropertyApartmentUpdate) => void;
  fieldLocks: PropertyFieldLocks;
  setFieldLocks: (nextLocks: PropertyFieldLocks) => void;
};

export function ApartmentEditSection({
  dealType,
  apartment,
  setApartment,
  fieldLocks,
  setFieldLocks,
}: ApartmentProps) {
  function handleBooleanFieldChange(
    fieldKey: ApartmentBooleanVerifiableField,
    nextState: ReturnType<typeof booleanUiStateFromApartment>,
  ) {
    const next = applyBooleanUiState(
      apartment.needsVerification ?? [],
      fieldKey,
      nextState,
    );
    setApartment({
      [fieldKey]: next.value,
      needsVerification: next.needsVerification,
    });
  }

  function handleFieldLockChange(lockKey: PropertyFieldLockKey, nextLock: LockState) {
    setFieldLocks(applyPropertyFieldLock(fieldLocks, lockKey, nextLock));
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-foreground">ბინა</legend>
      <MatchingLockHint />

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldWithLock
          lock={readPropertyFieldLock(fieldLocks, "area")}
          onLockChange={(nextLock) => handleFieldLockChange("area", nextLock)}
        >
          <EditableNumericTextInput
            label="საერთო ფართობი"
            value={apartment.totalArea}
            onValueChange={(next) => setApartment({ totalArea: next })}
            parse={parseDecimalInput}
            inputMode="decimal"
          />
        </FieldWithLock>
        <FieldWithLock
          lock={readPropertyFieldLock(fieldLocks, "rooms")}
          onLockChange={(nextLock) => handleFieldLockChange("rooms", nextLock)}
        >
          <EditableNumericTextInput
            label="ოთახები"
            value={apartment.rooms}
            onValueChange={(next) => setApartment({ rooms: next })}
            parse={parseIntegerInput}
            inputMode="numeric"
          />
        </FieldWithLock>
        <FieldWithLock
          lock={readPropertyFieldLock(fieldLocks, "bedrooms")}
          onLockChange={(nextLock) => handleFieldLockChange("bedrooms", nextLock)}
        >
          <EditableNumericTextInput
            label="საძინებლები"
            value={apartment.bedrooms}
            onValueChange={(next) => setApartment({ bedrooms: next })}
            parse={parseIntegerInput}
            inputMode="numeric"
          />
        </FieldWithLock>
        <FieldWithLock
          lock={readPropertyFieldLock(fieldLocks, "floor")}
          onLockChange={(nextLock) => handleFieldLockChange("floor", nextLock)}
        >
          <EditableNumericTextInput
            label="სართული"
            value={apartment.floor}
            onValueChange={(next) => setApartment({ floor: next })}
            parse={parseIntegerInput}
            inputMode="numeric"
          />
        </FieldWithLock>
        <EditableTwoDigitNumericInput
          label="სართულიანობა"
          value={apartment.totalFloors}
          onValueChange={(next) => setApartment({ totalFloors: next })}
        />
        <EditableNumericTextInput
          label="ჭერის სიმაღლე"
          value={apartment.ceilingHeight ?? undefined}
          onValueChange={(next) => setApartment({ ceilingHeight: next })}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        <FieldWithLock
          lock={readPropertyFieldLock(fieldLocks, "balconyArea")}
          onLockChange={(nextLock) => handleFieldLockChange("balconyArea", nextLock)}
        >
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <EditableNumericTextInput
                label="აივნის ფართობი"
                value={apartment.balconyArea ?? undefined}
                onValueChange={(next) => {
                  setApartment({ balconyArea: next ?? null });
                  if (next !== undefined) {
                    setApartment({
                      balconyArea: next,
                      needsVerification: (apartment.needsVerification ?? []).filter(
                        (fieldKey) => fieldKey !== "balconyArea",
                      ),
                    });
                  }
                }}
                parse={parseDecimalInput}
                inputMode="decimal"
              />
            </div>
            <NeedsVerificationToggle
              fieldKey="balconyArea"
              activeFields={apartment.needsVerification ?? []}
              onChange={(nextFields) => setApartment({ needsVerification: nextFields })}
            />
          </div>
        </FieldWithLock>
        <FieldWithLock
          lock={readPropertyFieldLock(fieldLocks, "parking")}
          onLockChange={(nextLock) => handleFieldLockChange("parking", nextLock)}
        >
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <EditableNumericTextInput
                label="პარკინგის ადგილები"
                value={apartment.parkingSpaces ?? undefined}
                onValueChange={(next) => {
                  if (next !== undefined) {
                    setApartment({
                      parkingSpaces: next,
                      needsVerification: (apartment.needsVerification ?? []).filter(
                        (fieldKey) => fieldKey !== "parkingSpaces",
                      ),
                    });
                    return;
                  }
                  setApartment({ parkingSpaces: null });
                }}
                parse={parseIntegerInput}
                inputMode="numeric"
              />
            </div>
            <NeedsVerificationToggle
              fieldKey="parkingSpaces"
              activeFields={apartment.needsVerification ?? []}
              onChange={(nextFields) => setApartment({ needsVerification: nextFields })}
            />
          </div>
        </FieldWithLock>
        <FieldWithLock
          lock={readPropertyFieldLock(fieldLocks, "bathrooms")}
          onLockChange={(nextLock) => handleFieldLockChange("bathrooms", nextLock)}
        >
          <EditableNumericTextInput
            label="სველი წერტილები"
            value={apartment.bathrooms ?? undefined}
            onValueChange={(next) => setApartment({ bathrooms: next ?? null })}
            parse={parseIntegerInput}
            inputMode="numeric"
          />
        </FieldWithLock>
        <FieldWithLock
          lock={readPropertyFieldLock(fieldLocks, "project")}
          onLockChange={(nextLock) => handleFieldLockChange("project", nextLock)}
        >
          <HashtagPicker
            id="editAptProject"
            label="პროექტი"
            value={apartment.project ?? ""}
            onChange={(next) => setApartment({ project: next })}
          />
        </FieldWithLock>
        <FieldWithLock
          lock={readPropertyFieldLock(fieldLocks, "renovation")}
          onLockChange={(nextLock) => handleFieldLockChange("renovation", nextLock)}
        >
          <SelectField
            id="editAptRenovation"
            label="რემონტი"
            value={parseRenovationForForm(apartment.renovation ?? null)}
            onChange={(next) => setApartment({ renovation: next })}
            options={RENOVATION_SELECT_OPTIONS}
          />
        </FieldWithLock>
        <FieldWithLock
          lock={readPropertyFieldLock(fieldLocks, "buildingCondition")}
          onLockChange={(nextLock) => handleFieldLockChange("buildingCondition", nextLock)}
        >
          <SelectField
            id="editAptBuildingCondition"
            label="შენობის მდგომარეობა"
            value={apartment.buildingCondition ?? "NEW"}
            onChange={(next) => setApartment({ buildingCondition: next })}
            options={BUILDING_CONDITION_OPTIONS}
          />
        </FieldWithLock>
        <FieldWithLock
          lock={readPropertyFieldLock(fieldLocks, "kitchenType")}
          onLockChange={(nextLock) => handleFieldLockChange("kitchenType", nextLock)}
        >
          <SelectField
            id="editAptKitchenType"
            label="სამზარეულოს ტიპი"
            value={apartment.kitchenType ?? "SEPARATE"}
            onChange={(next) => setApartment({ kitchenType: next })}
            options={KITCHEN_TYPE_OPTIONS}
          />
        </FieldWithLock>
        {(
          [
            { label: "ლიფტი", key: "elevator" },
            { label: "ცენტრალური გათბობა", key: "centralHeating" },
            { label: "კონდიციონერი", key: "airConditioner" },
            { label: "ავეჯით", key: "furnished" },
            { label: "კარგი ხედი", key: "goodView" },
          ] as const
        ).map((field) => (
          <div key={field.key} className="flex items-end gap-2">
            <div className="flex-1">
              <VerifiableBooleanField
                id={`editApt-${field.key}`}
                label={field.label}
                value={booleanUiStateFromApartment(
                  apartment[field.key],
                  apartment.needsVerification ?? [],
                  field.key,
                )}
                onChange={(nextState) => handleBooleanFieldChange(field.key, nextState)}
              />
            </div>
            <PreferenceLockButton
              value={readPropertyFieldLock(fieldLocks, field.key)}
              onChange={(nextLock) => handleFieldLockChange(field.key, nextLock)}
            />
          </div>
        ))}
        {dealType === "RENT" ? (
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <VerifiableBooleanField
                id="editAptPetsAllowed"
                label="ცხოველები დაიშვება"
                value={booleanUiStateFromApartment(
                  apartment.petsAllowed,
                  apartment.needsVerification ?? [],
                  "petsAllowed",
                )}
                onChange={(nextState) => handleBooleanFieldChange("petsAllowed", nextState)}
              />
            </div>
            <PreferenceLockButton
              value={readPropertyFieldLock(fieldLocks, "petsAllowed")}
              onChange={(nextLock) => handleFieldLockChange("petsAllowed", nextLock)}
            />
          </div>
        ) : null}
        <FieldWithLock
          lock={readPropertyFieldLock(fieldLocks, "minRentalPeriod")}
          onLockChange={(nextLock) => handleFieldLockChange("minRentalPeriod", nextLock)}
        >
          <MinRentalPeriodEditField
            dealType={dealType}
            idPrefix="editApt"
            months={apartment.minRentalPeriod ?? undefined}
            onMonthsChange={(next) => setApartment({ minRentalPeriod: next })}
          />
        </FieldWithLock>
      </div>
    </fieldset>
  );
}

type PrivateHouseProps = {
  dealType: DealType;
  privateHouse: NonNullable<PropertyFormValues["privateHouse"]>;
  setPrivateHouse: (patch: PropertyPrivateHouseUpdate) => void;
};

export function PrivateHouseEditSection({
  dealType,
  privateHouse,
  setPrivateHouse,
}: PrivateHouseProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-foreground">კერძო სახლი</legend>

      <div className="grid gap-4 sm:grid-cols-2">
        <EditableNumericTextInput
          label="სახლის ფართობი"
          value={privateHouse.houseArea}
          onValueChange={(next) => setPrivateHouse({ houseArea: next })}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        <EditableNumericTextInput
          label="ეზოს ფართობი"
          value={privateHouse.yardArea}
          onValueChange={(next) => setPrivateHouse({ yardArea: next })}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        <EditableNumericTextInput
          label="აივნის ფართობი"
          value={privateHouse.balconyArea ?? undefined}
          onValueChange={(next) => setPrivateHouse({ balconyArea: next })}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        <EditableNumericTextInput
          label="პარკინგის ადგილები"
          value={privateHouse.parkingSpaces ?? undefined}
          onValueChange={(next) => setPrivateHouse({ parkingSpaces: next })}
          parse={parseIntegerInput}
          inputMode="numeric"
        />
        <EditableCheckbox
          label="ავეჯით"
          checked={Boolean(privateHouse.furnished)}
          onChange={(checked) => setPrivateHouse({ furnished: checked })}
        />
        <EditableCheckbox
          label="აუზი"
          checked={Boolean(privateHouse.pool)}
          onChange={(checked) => setPrivateHouse({ pool: checked })}
        />
        <EditableCheckbox
          label="ხეხილი"
          checked={Boolean(privateHouse.fruitTrees)}
          onChange={(checked) => setPrivateHouse({ fruitTrees: checked })}
        />
        <SelectField
          id="editPhRenovation"
          label="რემონტი"
          value={parseRenovationForForm(privateHouse.renovation ?? null)}
          onChange={(next) => setPrivateHouse({ renovation: next })}
          options={RENOVATION_SELECT_OPTIONS}
        />
        <MinRentalPeriodEditField
          dealType={dealType}
          idPrefix="editPh"
          months={privateHouse.minRentalPeriod ?? undefined}
          onMonthsChange={(next) => setPrivateHouse({ minRentalPeriod: next })}
        />
      </div>
    </fieldset>
  );
}

type LandPlotProps = {
  dealType: DealType;
  landPlot: NonNullable<PropertyFormValues["landPlot"]>;
  setLandPlot: (patch: Partial<PropertyFormLandPlot>) => void;
};

export function LandPlotEditSection({ dealType, landPlot, setLandPlot }: LandPlotProps) {
  const hasLandCategory = landPlot.landCategory !== "";

  function handleLandCategoryChange(nextRaw: string) {
    setLandPlot({
      landCategory: nextRaw as LandCategory | "",
      landUsage: "",
    });
  }

  function handleLandUsageChange(nextRaw: string) {
    setLandPlot({ landUsage: nextRaw as CommercialStatus | "" });
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-foreground">მიწის ნაკვეთი</legend>

      <div className="grid gap-4 sm:grid-cols-2">
        <EditableNumericTextInput
          label="მიწის ფართობი"
          value={landPlot.landArea}
          onValueChange={(next) => setLandPlot({ landArea: next })}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        <SelectField
          id="editLpLandCategory"
          label="მიწის კატეგორია"
          value={landPlot.landCategory}
          onChange={handleLandCategoryChange}
          options={LAND_CATEGORY_SELECT_OPTIONS}
        />
        <SelectField
          id="editLpLandUsage"
          label="მიწის დანიშნულება"
          value={landPlot.landUsage}
          onChange={handleLandUsageChange}
          options={LAND_USAGE_SELECT_OPTIONS}
          disabled={!hasLandCategory}
        />
        <EditableCheckbox
          label="საინვესტიციო"
          checked={Boolean(landPlot.forInvestment)}
          onChange={(checked) => setLandPlot({ forInvestment: checked })}
        />
        <EditableCheckbox
          label="იყოფა"
          checked={Boolean(landPlot.canBeDivided)}
          onChange={(checked) => setLandPlot({ canBeDivided: checked })}
        />
        <MinRentalPeriodEditField
          dealType={dealType}
          idPrefix="editLp"
          months={landPlot.minRentalPeriod ?? undefined}
          onMonthsChange={(next) => setLandPlot({ minRentalPeriod: next })}
        />
      </div>
    </fieldset>
  );
}

type CommercialProps = {
  dealType: DealType;
  commercial: NonNullable<PropertyFormValues["commercial"]>;
  setCommercial: (patch: PropertyCommercialUpdate) => void;
};

export function CommercialEditSection({
  dealType,
  commercial,
  setCommercial,
}: CommercialProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-foreground">კომერციული</legend>

      <div className="grid gap-4 sm:grid-cols-2">
        <EditableNumericTextInput
          label="ფართობი"
          value={commercial.area}
          onValueChange={(next) => setCommercial({ area: next })}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        <EditableTwoDigitNumericInput
          label="სართულიანობა"
          value={commercial.totalFloors}
          onValueChange={(next) => setCommercial({ totalFloors: next })}
        />
        <EditableNumericTextInput
          label="ჭერის სიმაღლე"
          value={commercial.ceilingHeight ?? undefined}
          onValueChange={(next) => setCommercial({ ceilingHeight: next })}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        <EditableNumericTextInput
          label="პარკინგის ადგილები"
          value={commercial.parkingSpaces ?? undefined}
          onValueChange={(next) => setCommercial({ parkingSpaces: next })}
          parse={parseIntegerInput}
          inputMode="numeric"
        />
        <EditableCheckbox
          label="კონდიციონერი"
          checked={Boolean(commercial.airConditioner)}
          onChange={(checked) => setCommercial({ airConditioner: checked })}
        />
        <SelectField
          id="editCmRenovation"
          label="რემონტი"
          value={parseRenovationForForm(commercial.renovation ?? null)}
          onChange={(next) => setCommercial({ renovation: next })}
          options={RENOVATION_SELECT_OPTIONS}
        />
        <MinRentalPeriodEditField
          dealType={dealType}
          idPrefix="editCm"
          months={commercial.minRentalPeriod ?? undefined}
          onMonthsChange={(next) => setCommercial({ minRentalPeriod: next })}
        />
      </div>
    </fieldset>
  );
}
