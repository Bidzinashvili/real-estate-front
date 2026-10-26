"use client";

import { LabelAutocompleteChipsInput } from "@/features/labels/LabelAutocompleteChipsInput";
import type { LabelSelection } from "@/features/labels/labelTypes";
import type {
  PropertyApartmentUpdate,
  PropertyCommercialUpdate,
  PropertyPrivateHouseUpdate,
} from "@/features/properties/types";
import {
  GEORGIAN_CITY_OPTIONS,
  HOTEL_SCOPE_FORM_OPTIONS,
  isTbilisiCity,
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
import { canonicalPropertyArea } from "@/features/properties/propertyArea";
import { LabeledSelect } from "@/shared/ui/LabeledSelect";
import { StreetAutocompleteField } from "@/features/streets/StreetAutocompleteField";
import {
  EditableCheckbox,
  EditableNumericTextInput,
  propertyDetailsEditableInputClassName,
} from "@/widgets/PropertyDetails/PropertyFormControls";
import {
  ApartmentEditSection,
  CommercialEditSection,
  LandPlotEditSection,
  PrivateHouseEditSection,
} from "@/widgets/PropertyDetails/PropertyNestedEditSections";
import { PropertyListingFieldsView } from "@/widgets/PropertyDetails/PropertyListingFieldsView";
import { parseIntegerInput } from "@/shared/lib/parseNumericInput";
import { DistrictNeighborhoodPicker } from "@/widgets/AddProperty/DistrictNeighborhoodPicker";
import {
  calculatePricePerSquareMeter,
  formatPricePerSquareMeter,
} from "@/features/properties/pricePerSquareMeter";
import { buildGeneratePublicTextDraftFromEditForm } from "@/features/properties/generatePublicTextDraft";
import { PropertyFormAdditionalInfoSection } from "@/widgets/PropertyDetails/PropertyFormAdditionalInfoSection";
import { ListingPriceEquivalentHint } from "@/features/currency/ListingPriceEquivalentHint";
import { PriceCurrencyToggle } from "@/features/currency/PriceCurrencyToggle";
import { listingCurrencySymbol } from "@/features/currency/types";
import type { SupportedListingCurrency } from "@/features/currency/types";
import { HIDE_FROM_OTHERS_COPY } from "@/features/hideFromOthers/hideFromOthersCopy";

type PropertyDetailsEditableSectionsProps = {
  values: PropertyFormValues;
  canEdit: boolean;
  showInternalPrice: boolean;
  showPrivateNotes: boolean;
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
  onCurrencyChange: (nextCurrency: SupportedListingCurrency) => void;
  onHideFromOthersChange: (nextHidden: boolean) => void;
  onLabelsChange: (value: LabelSelection[]) => void;
  onCommentChange: (
    field: "publicComment" | "privateComment" | "internalText",
    value: string,
  ) => void;
  setApartment: (patch: PropertyApartmentUpdate) => void;
  setPrivateHouse: (patch: PropertyPrivateHouseUpdate) => void;
  setLandPlot: (patch: Partial<PropertyFormLandPlot>) => void;
  setCommercial: (patch: PropertyCommercialUpdate) => void;
  ourSiteId?: string | null;
};

function getEditableAreaSquareMeters(values: PropertyFormValues): number | null {
  return canonicalPropertyArea({
    apartment: values.apartment
      ? { totalArea: values.apartment.totalArea ?? null }
      : null,
    privateHouse: values.privateHouse
      ? { totalArea: values.privateHouse.totalArea ?? null }
      : null,
    landPlot: values.landPlot
      ? { landArea: values.landPlot.landArea ?? null }
      : null,
    commercial: values.commercial
      ? { area: values.commercial.area ?? null }
      : null,
  });
}

export function PropertyDetailsEditableSections({
  values,
  canEdit,
  showInternalPrice,
  showPrivateNotes,
  onDealTypeChange,
  onHotelScopeChange,
  onFieldChange,
  onPriceChange,
  onCurrencyChange,
  onHideFromOthersChange,
  onLabelsChange,
  onCommentChange,
  setApartment,
  setPrivateHouse,
  setLandPlot,
  setCommercial,
  ourSiteId = null,
}: PropertyDetailsEditableSectionsProps) {
  const pricePerSquareMeter = calculatePricePerSquareMeter(
    values.pricePublic,
    getEditableAreaSquareMeters(values),
  );

  const showDistrictFields = isTbilisiCity(values.city);
  const hasKnownCity = GEORGIAN_CITY_OPTIONS.some(
    (option) => option.value === values.city,
  );
  const citySelectOptions =
    hasKnownCity || values.city.trim() === ""
      ? GEORGIAN_CITY_OPTIONS
      : [{ value: values.city, label: values.city }, ...GEORGIAN_CITY_OPTIONS];

  if (!canEdit) {
    return (
      <PropertyListingFieldsView
        values={values}
        showInternalPrice={showInternalPrice}
        showPrivateNotes={showPrivateNotes}
      />
    );
  }

  return (
    <>
      <LabeledSelect
        label="გარიგების ტიპი"
        value={values.dealType}
        onChange={(value) => {
          if (isDealType(value)) onDealTypeChange(value);
        }}
        options={DEAL_TYPE_OPTIONS}
      />

      {values.propertyType === "HOTEL" && (
        <LabeledSelect
          label="სასტუმროს ტიპი"
          value={values.hotelScope ?? ""}
          onChange={onHotelScopeChange}
          options={[
            { value: "", label: "არ არის მითითებული" },
            ...HOTEL_SCOPE_FORM_OPTIONS,
          ]}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <LabeledSelect
          id="propertyCity"
          label="ქალაქი"
          value={values.city}
          onChange={(value) => onFieldChange("city", value)}
          options={citySelectOptions}
        />
        {showDistrictFields ? (
          <DistrictNeighborhoodPicker
            value={values.district}
            onChange={(nextDistrict) => onFieldChange("district", nextDistrict)}
          />
        ) : null}
      </div>

      <StreetAutocompleteField
        id="propertyAddress"
        label="მისამართი"
        value={values.address}
        onChange={(next, addressChangeMeta) =>
          onFieldChange("address", next, addressChangeMeta)
        }
        inputClassName={propertyDetailsEditableInputClassName}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground">ფასი</p>
          <PriceCurrencyToggle
            value={values.currency}
            onChange={onCurrencyChange}
          />
        </div>
        <div
          className={`grid gap-4 sm:grid-cols-2 ${showInternalPrice ? "" : "max-w-md"}`}
        >
          <div className="space-y-1.5">
            <EditableNumericTextInput
              label="საჯარო ფასი"
              value={values.pricePublic}
              onValueChange={(next) => onPriceChange("pricePublic", next)}
              parse={parseIntegerInput}
              inputMode="numeric"
              leadingSymbol={listingCurrencySymbol(values.currency)}
            />
            <ListingPriceEquivalentHint
              amount={values.pricePublic}
              fromCurrency={values.currency}
            />
            {pricePerSquareMeter !== null ? (
              <p className="text-xs font-medium text-muted-foreground">
                {formatPricePerSquareMeter(pricePerSquareMeter, values.currency)}
              </p>
            ) : null}
          </div>
          {showInternalPrice && (
            <div className="space-y-1.5">
              <EditableNumericTextInput
                label="შიდა ფასი"
                value={values.priceInternal}
                onValueChange={(next) => onPriceChange("priceInternal", next)}
                parse={parseIntegerInput}
                inputMode="numeric"
                leadingSymbol={listingCurrencySymbol(values.currency)}
              />
              <ListingPriceEquivalentHint
                amount={values.priceInternal}
                fromCurrency={values.currency}
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <LabelAutocompleteChipsInput
          id="propertyLabels"
          label="ლეიბლები"
          selectedLabels={values.labels}
          onChange={onLabelsChange}
          allowFreeText
          placeholder="აკრიფეთ ლეიბლის მოსაძებნად ან დასამატებლად"
        />
      </div>

      <EditableCheckbox
        label={HIDE_FROM_OTHERS_COPY.actionLabel}
        checked={values.hideFromOthers}
        onChange={onHideFromOthersChange}
      />

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

      <PropertyFormAdditionalInfoSection
        publicComment={values.publicComment}
        privateComment={values.privateComment}
        internalText={values.internalText}
        showPrivateNotes={showPrivateNotes}
        canEdit={canEdit}
        onPublicCommentChange={(nextValue) => onCommentChange("publicComment", nextValue)}
        onPrivateCommentChange={(nextValue) =>
          onCommentChange("privateComment", nextValue)
        }
        onInternalTextChange={(nextValue) => onCommentChange("internalText", nextValue)}
        buildGenerateDraft={() =>
          buildGeneratePublicTextDraftFromEditForm(values, ourSiteId)
        }
        textareaClassName="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-0 placeholder:text-muted-foreground"
      />
    </>
  );
}
