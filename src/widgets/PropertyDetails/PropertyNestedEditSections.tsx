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
import {
  LAND_CATEGORY_SELECT_OPTIONS,
  LAND_USAGE_SELECT_OPTIONS,
  RENOVATION_SELECT_OPTIONS,
} from "@/features/properties/addPropertyFormOptions";
import type {
  PropertyFormLandPlot,
  PropertyFormValues,
} from "@/features/properties/payloadBuilder";
import { NonNegativeCounterField, SelectField } from "@/widgets/AddProperty/addPropertyFormFields";
import {
  EditableCheckbox,
  EditableNumericTextInput,
} from "@/widgets/PropertyDetails/PropertyFormControls";
import { MinRentalPeriodEditField } from "@/widgets/PropertyDetails/MinRentalPeriodEditField";
import {
  parseDecimalInput,
  parseIntegerInput,
} from "@/shared/lib/parseNumericInput";

type ApartmentProps = {
  dealType: DealType;
  apartment: NonNullable<PropertyFormValues["apartment"]>;
  setApartment: (patch: PropertyApartmentUpdate) => void;
};

export function ApartmentEditSection({
  dealType,
  apartment,
  setApartment,
}: ApartmentProps) {
  const balconyCount = apartment.balcony ?? 0;

  function handleDecreaseBalcony() {
    setApartment({ balcony: Math.max(0, balconyCount - 1) });
  }

  function handleIncreaseBalcony() {
    setApartment({ balcony: balconyCount + 1 });
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
          label="Floor"
          value={apartment.floor}
          onValueChange={(next) => setApartment({ floor: next })}
          parse={parseIntegerInput}
          inputMode="numeric"
        />
        <NonNegativeCounterField
          id="editAptBalcony"
          label="Balcony"
          value={balconyCount}
          onDecrease={handleDecreaseBalcony}
          onIncrease={handleIncreaseBalcony}
        />
        <SelectField
          id="editAptRenovation"
          label="Renovation"
          value={parseRenovationForForm(apartment.renovation ?? null)}
          onChange={(next) => setApartment({ renovation: next })}
          options={RENOVATION_SELECT_OPTIONS}
        />
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
        <EditableCheckbox
          label="Parking"
          checked={Boolean(commercial.parking)}
          onChange={(checked) => setCommercial({ parking: checked })}
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
