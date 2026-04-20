"use client";

import { LabelAutocompleteChipsInput } from "@/features/labels/LabelAutocompleteChipsInput";
import type { LabelSelection } from "@/features/labels/labelTypes";
import type {
  PropertyApartmentUpdate,
  PropertyCommercialUpdate,
  PropertyPrivateHouseUpdate,
} from "@/features/properties/types";
import {
  HOTEL_SCOPE_FORM_OPTIONS,
} from "@/features/properties/addPropertyFormOptions";
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
import { StreetAutocompleteField } from "@/features/streets/StreetAutocompleteField";
import {
  EditableNumericTextInput,
  EditableTextInput,
  propertyDetailsEditableInputClassName,
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
  onHotelScopeChange: (raw: string) => void;
  onFieldChange: (
    field: keyof Pick<PropertyFormValues, "city" | "district" | "address">,
    value: string,
    addressChangeMeta?: { selectedStreetId: string | null },
  ) => void;
  onPriceChange: (
    field: "pricePublic" | "priceInternal",
    value: number | undefined,
  ) => void;
  onLabelsChange: (value: LabelSelection[]) => void;
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
  onHotelScopeChange,
  onFieldChange,
  onPriceChange,
  onLabelsChange,
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

      {values.propertyType === "HOTEL" && (
        <LabeledSelect
          label="Hotel scope"
          value={values.hotelScope ?? ""}
          onChange={onHotelScopeChange}
          options={[
            { value: "", label: "Not specified" },
            ...HOTEL_SCOPE_FORM_OPTIONS,
          ]}
        />
      )}

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

      <StreetAutocompleteField
        id="propertyAddress"
        label="Address"
        value={values.address}
        onChange={(next, addressChangeMeta) =>
          onFieldChange("address", next, addressChangeMeta)
        }
        inputClassName={propertyDetailsEditableInputClassName}
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
        <LabelAutocompleteChipsInput
          id="propertyLabels"
          label="Labels"
          selectedLabels={values.labels}
          onChange={onLabelsChange}
          allowFreeText
          placeholder="Type to search or add labels"
        />
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
