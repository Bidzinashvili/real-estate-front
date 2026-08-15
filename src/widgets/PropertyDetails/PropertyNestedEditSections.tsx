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
import type { PropertyFieldLocks } from "@/features/matching/matchingEnums";
import { PreferenceLockButton } from "@/widgets/ClientForm/PreferenceLockButton";
import { readPropertyFieldLock } from "@/features/matching/persistEntityLock";
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

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-slate-800">Apartment</legend>

      <div className="grid gap-4 sm:grid-cols-2">
        <EditableNumericTextInput
          label="Total area"
          value={apartment.totalArea}
          onValueChange={(next) => setApartment({ totalArea: next })}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        <EditableNumericTextInput
          label="Rooms"
          value={apartment.rooms}
          onValueChange={(next) => setApartment({ rooms: next })}
          parse={parseIntegerInput}
          inputMode="numeric"
        />
        <EditableNumericTextInput
          label="Bedrooms"
          value={apartment.bedrooms}
          onValueChange={(next) => setApartment({ bedrooms: next })}
          parse={parseIntegerInput}
          inputMode="numeric"
        />
        <EditableNumericTextInput
          label="Floor"
          value={apartment.floor}
          onValueChange={(next) => setApartment({ floor: next })}
          parse={parseIntegerInput}
          inputMode="numeric"
        />
        <EditableTwoDigitNumericInput
          label="Total floors"
          value={apartment.totalFloors}
          onValueChange={(next) => setApartment({ totalFloors: next })}
        />
        <EditableNumericTextInput
          label="Ceiling height"
          value={apartment.ceilingHeight ?? undefined}
          onValueChange={(next) => setApartment({ ceilingHeight: next })}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <EditableNumericTextInput
              label="Balcony area"
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
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <EditableNumericTextInput
              label="Parking spaces"
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
        <EditableNumericTextInput
          label="Bathrooms"
          value={apartment.bathrooms ?? undefined}
          onValueChange={(next) => setApartment({ bathrooms: next ?? null })}
          parse={parseIntegerInput}
          inputMode="numeric"
        />
        <HashtagPicker
          id="editAptProject"
          label="Project"
          value={apartment.project ?? ""}
          onChange={(next) => setApartment({ project: next })}
        />
        <SelectField
          id="editAptRenovation"
          label="Renovation"
          value={parseRenovationForForm(apartment.renovation ?? null)}
          onChange={(next) => setApartment({ renovation: next })}
          options={RENOVATION_SELECT_OPTIONS}
        />
        <SelectField
          id="editAptBuildingCondition"
          label="Building condition"
          value={apartment.buildingCondition ?? "NEW"}
          onChange={(next) => setApartment({ buildingCondition: next })}
          options={BUILDING_CONDITION_OPTIONS}
        />
        <SelectField
          id="editAptKitchenType"
          label="Kitchen type"
          value={apartment.kitchenType ?? "SEPARATE"}
          onChange={(next) => setApartment({ kitchenType: next })}
          options={KITCHEN_TYPE_OPTIONS}
        />
        {(
          [
            { label: "Elevator", key: "elevator" },
            { label: "Central heating", key: "centralHeating" },
            { label: "Air conditioner", key: "airConditioner" },
            { label: "Furnished", key: "furnished" },
            { label: "Good view", key: "goodView" },
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
              onChange={(nextLock) =>
                setFieldLocks({
                  ...fieldLocks,
                  [field.key]: nextLock === "frozen" ? "frozen" : "none",
                })
              }
            />
          </div>
        ))}
        {dealType === "RENT" ? (
          <VerifiableBooleanField
            id="editAptPetsAllowed"
            label="Pets allowed"
            value={booleanUiStateFromApartment(
              apartment.petsAllowed,
              apartment.needsVerification ?? [],
              "petsAllowed",
            )}
            onChange={(nextState) => handleBooleanFieldChange("petsAllowed", nextState)}
          />
        ) : null}
        <MinRentalPeriodEditField
          dealType={dealType}
          idPrefix="editApt"
          months={apartment.minRentalPeriod ?? undefined}
          onMonthsChange={(next) => setApartment({ minRentalPeriod: next })}
        />
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
      <legend className="text-sm font-semibold text-slate-800">Private house</legend>

      <div className="grid gap-4 sm:grid-cols-2">
        <EditableNumericTextInput
          label="House area"
          value={privateHouse.houseArea}
          onValueChange={(next) => setPrivateHouse({ houseArea: next })}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        <EditableNumericTextInput
          label="Yard area"
          value={privateHouse.yardArea}
          onValueChange={(next) => setPrivateHouse({ yardArea: next })}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        <EditableNumericTextInput
          label="Balcony area"
          value={privateHouse.balconyArea ?? undefined}
          onValueChange={(next) => setPrivateHouse({ balconyArea: next })}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        <EditableNumericTextInput
          label="Parking spaces"
          value={privateHouse.parkingSpaces ?? undefined}
          onValueChange={(next) => setPrivateHouse({ parkingSpaces: next })}
          parse={parseIntegerInput}
          inputMode="numeric"
        />
        <EditableCheckbox
          label="Furnished"
          checked={Boolean(privateHouse.furnished)}
          onChange={(checked) => setPrivateHouse({ furnished: checked })}
        />
        <EditableCheckbox
          label="Pool"
          checked={Boolean(privateHouse.pool)}
          onChange={(checked) => setPrivateHouse({ pool: checked })}
        />
        <EditableCheckbox
          label="Fruit trees"
          checked={Boolean(privateHouse.fruitTrees)}
          onChange={(checked) => setPrivateHouse({ fruitTrees: checked })}
        />
        <SelectField
          id="editPhRenovation"
          label="Renovation"
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
      <legend className="text-sm font-semibold text-slate-800">Land plot</legend>

      <div className="grid gap-4 sm:grid-cols-2">
        <EditableNumericTextInput
          label="Land area"
          value={landPlot.landArea}
          onValueChange={(next) => setLandPlot({ landArea: next })}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        <SelectField
          id="editLpLandCategory"
          label="Land category"
          value={landPlot.landCategory}
          onChange={handleLandCategoryChange}
          options={LAND_CATEGORY_SELECT_OPTIONS}
        />
        <SelectField
          id="editLpLandUsage"
          label="Land usage"
          value={landPlot.landUsage}
          onChange={handleLandUsageChange}
          options={LAND_USAGE_SELECT_OPTIONS}
          disabled={!hasLandCategory}
        />
        <EditableCheckbox
          label="For investment"
          checked={Boolean(landPlot.forInvestment)}
          onChange={(checked) => setLandPlot({ forInvestment: checked })}
        />
        <EditableCheckbox
          label="Can be divided"
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
      <legend className="text-sm font-semibold text-slate-800">Commercial</legend>

      <div className="grid gap-4 sm:grid-cols-2">
        <EditableNumericTextInput
          label="Area"
          value={commercial.area}
          onValueChange={(next) => setCommercial({ area: next })}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        <EditableTwoDigitNumericInput
          label="Total floors"
          value={commercial.totalFloors}
          onValueChange={(next) => setCommercial({ totalFloors: next })}
        />
        <EditableNumericTextInput
          label="Ceiling height"
          value={commercial.ceilingHeight ?? undefined}
          onValueChange={(next) => setCommercial({ ceilingHeight: next })}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        <EditableNumericTextInput
          label="Parking spaces"
          value={commercial.parkingSpaces ?? undefined}
          onValueChange={(next) => setCommercial({ parkingSpaces: next })}
          parse={parseIntegerInput}
          inputMode="numeric"
        />
        <EditableCheckbox
          label="Air conditioner"
          checked={Boolean(commercial.airConditioner)}
          onChange={(checked) => setCommercial({ airConditioner: checked })}
        />
        <SelectField
          id="editCmRenovation"
          label="Renovation"
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
