"use client";

import type {
  PropertyApartmentUpdate,
  PropertyCommercialUpdate,
  PropertyLandPlotUpdate,
  PropertyPrivateHouseUpdate,
} from "@/features/properties/types";
import type { PropertyFormValues } from "@/features/properties/payloadBuilder";
import { NonNegativeCounterField } from "@/widgets/AddProperty/addPropertyFormFields";
import {
  EditableCheckbox,
  EditableNumericTextInput,
} from "@/widgets/PropertyDetails/PropertyFormControls";
import {
  parseDecimalInput,
  parseIntegerInput,
} from "@/shared/lib/parseNumericInput";

type ApartmentProps = {
  apartment: NonNullable<PropertyFormValues["apartment"]>;
  setApartment: (patch: PropertyApartmentUpdate) => void;
};

export function ApartmentEditSection({ apartment, setApartment }: ApartmentProps) {
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
      </div>
    </fieldset>
  );
}

type PrivateHouseProps = {
  privateHouse: NonNullable<PropertyFormValues["privateHouse"]>;
  setPrivateHouse: (patch: PropertyPrivateHouseUpdate) => void;
};

export function PrivateHouseEditSection({
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
      </div>
    </fieldset>
  );
}

type LandPlotProps = {
  landPlot: NonNullable<PropertyFormValues["landPlot"]>;
  setLandPlot: (patch: PropertyLandPlotUpdate) => void;
};

export function LandPlotEditSection({ landPlot, setLandPlot }: LandPlotProps) {
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
      </div>
    </fieldset>
  );
}

type CommercialProps = {
  commercial: NonNullable<PropertyFormValues["commercial"]>;
  setCommercial: (patch: PropertyCommercialUpdate) => void;
};

export function CommercialEditSection({
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
      </div>
    </fieldset>
  );
}
