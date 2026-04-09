"use client";

import type {
  PropertyApartmentUpdate,
  PropertyCommercialUpdate,
  PropertyPrivateHouseUpdate,
} from "@/features/properties/types";
import {
  DEAL_TYPE_OPTIONS,
  isDealType,
  type DealType,
} from "@/features/properties/dealType";
import type {
  PropertyFormLandPlot,
  PropertyFormValues,
} from "@/features/properties/payloadBuilder";
import { LabeledSelect } from "@/shared/ui/LabeledSelect";
import {
  EditableNumericTextInput,
  EditableTextInput,
} from "@/widgets/PropertyDetails/PropertyFormControls";
import {
  ApartmentEditSection,
  CommercialEditSection,
  LandPlotEditSection,
  PrivateHouseEditSection,
} from "@/widgets/PropertyDetails/PropertyNestedEditSections";
import { PropertyListingFieldsView } from "@/widgets/PropertyDetails/PropertyListingFieldsView";
import {
  parseDecimalInput,
} from "@/shared/lib/parseNumericInput";

type PropertyDetailsEditableSectionsProps = {
  values: PropertyFormValues;
  canEdit: boolean;
  showInternalPrice: boolean;
  readOnlyPrivateHouseBalcony?: number;
  onDealTypeChange: (value: DealType) => void;
  onFieldChange: (
    field: keyof Pick<PropertyFormValues, "city" | "district" | "address">,
    value: string,
  ) => void;
  onPriceChange: (
    field: "pricePublic" | "priceInternal",
    value: number | undefined,
  ) => void;
  onDescriptionChange: (value: string) => void;
  setApartment: (patch: PropertyApartmentUpdate) => void;
  setPrivateHouse: (patch: PropertyPrivateHouseUpdate) => void;
  setLandPlot: (patch: Partial<PropertyFormLandPlot>) => void;
  setCommercial: (patch: PropertyCommercialUpdate) => void;
};

export function PropertyDetailsEditableSections({
  values,
  canEdit,
  showInternalPrice,
  readOnlyPrivateHouseBalcony,
  onDealTypeChange,
  onFieldChange,
  onPriceChange,
  onDescriptionChange,
  setApartment,
  setPrivateHouse,
  setLandPlot,
  setCommercial,
}: PropertyDetailsEditableSectionsProps) {
  if (!canEdit) {
    return (
      <PropertyListingFieldsView
        values={values}
        showInternalPrice={showInternalPrice}
        readOnlyPrivateHouseBalcony={readOnlyPrivateHouseBalcony}
      />
    );
  }

  return (
    <>
      <LabeledSelect
        label="Deal type"
        value={values.dealType}
        onChange={(value) => {
          if (isDealType(value)) onDealTypeChange(value);
        }}
        options={DEAL_TYPE_OPTIONS}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <EditableTextInput
          label="City"
          value={values.city}
          onChange={(value) => onFieldChange("city", value)}
        />
        <EditableTextInput
          label="District"
          value={values.district}
          onChange={(value) => onFieldChange("district", value)}
        />
      </div>

      <EditableTextInput
        label="Address"
        value={values.address}
        onChange={(value) => onFieldChange("address", value)}
      />

      <div
        className={`grid gap-4 sm:grid-cols-2 ${showInternalPrice ? "" : "max-w-md"}`}
      >
        <EditableNumericTextInput
          label="Public price"
          value={values.pricePublic}
          onValueChange={(next) => onPriceChange("pricePublic", next)}
          parse={parseDecimalInput}
          inputMode="decimal"
        />
        {showInternalPrice && (
          <EditableNumericTextInput
            label="Internal price"
            value={values.priceInternal}
            onValueChange={(next) => onPriceChange("priceInternal", next)}
            parse={parseDecimalInput}
            inputMode="decimal"
          />
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-800">Description</label>
        <textarea
          value={values.description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          className="block w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400"
          rows={4}
        />
      </div>

      {values.apartment && (
        <ApartmentEditSection
          dealType={values.dealType}
          apartment={values.apartment}
          setApartment={setApartment}
        />
      )}

      {values.privateHouse && (
        <PrivateHouseEditSection
          dealType={values.dealType}
          privateHouse={values.privateHouse}
          setPrivateHouse={setPrivateHouse}
        />
      )}

      {values.landPlot && (
        <LandPlotEditSection
          dealType={values.dealType}
          landPlot={values.landPlot}
          setLandPlot={setLandPlot}
        />
      )}

      {values.commercial && (
        <CommercialEditSection
          dealType={values.dealType}
          commercial={values.commercial}
          setCommercial={setCommercial}
        />
      )}
    </>
  );
}
