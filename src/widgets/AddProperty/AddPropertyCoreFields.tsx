"use client";

import { useRef } from "react";
import { LabelAutocompleteChipsInput } from "@/features/labels/LabelAutocompleteChipsInput";
import { DEAL_TYPE_OPTIONS, type DealType } from "@/features/properties/dealType";
import {
  HOTEL_SCOPE_FORM_OPTIONS,
  GEORGIAN_CITY_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  isTbilisiCity,
} from "@/features/properties/addPropertyFormOptions";
import type { HotelScope } from "@/features/properties/types";
import { StreetAutocompleteField } from "@/features/streets/StreetAutocompleteField";
import {
  addPropertyInputClassName,
  CheckboxField,
  SelectField,
  TextField,
} from "@/widgets/AddProperty/addPropertyFormFields";
import type { FormState } from "@/features/properties/addPropertyFormState";
import type { FormErrors } from "@/features/properties/addPropertyFormValidation";
import { DistrictNeighborhoodPicker } from "@/widgets/AddProperty/DistrictNeighborhoodPicker";
import { ImageUploadField } from "@/widgets/AddProperty/ImageUploadField";
import { ExternalIdList } from "@/shared/components/ExternalIdList";
import { resolveCreateInternalPriceSuggestion } from "@/features/properties/linkedPropertyPrices";
import { usePricePerSquareMeterInput } from "@/features/properties/usePricePerSquareMeterInput";
import { PropertyOwnerPickerSection } from "@/widgets/PropertyOwners/PropertyOwnerPickerSection";
import type { PropertyOwnerAssignment } from "@/features/propertyOwners/types";
import {
  ListingPriceEquivalentHint,
  parseListingAmountForHint,
} from "@/features/currency/ListingPriceEquivalentHint";
import { PriceCurrencyToggle } from "@/features/currency/PriceCurrencyToggle";
import { listingCurrencySymbol } from "@/features/currency/types";
import type { SupportedListingCurrency } from "@/features/currency/types";
import { HIDE_FROM_OTHERS_COPY } from "@/features/hideFromOthers/hideFromOthersCopy";

function parseFormNumber(value: string): number | null {
  const trimmedValue = value.trim();
  if (trimmedValue === "") return null;
  const parsedValue = Number(trimmedValue);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) return null;
  return parsedValue;
}

function getCreateAreaSquareMeters(form: FormState): number | null {
  if (form.propertyType === "APARTMENT") {
    return parseFormNumber(form.apartment.totalArea);
  }
  if (
    form.propertyType === "PRIVATE_HOUSE" ||
    form.propertyType === "COTTAGE" ||
    form.propertyType === "HOTEL"
  ) {
    return parseFormNumber(form.privateHouse.totalArea);
  }
  if (form.propertyType === "COMMERCIAL") {
    return parseFormNumber(form.commercial.area);
  }
  if (form.propertyType === "LAND_PLOT") {
    return parseFormNumber(form.landPlot.landArea);
  }

  return null;
}

type Props = {
  form: FormState;
  fieldErrors: FormErrors;
  images: File[];
  imageError: string | null;
  updateForm: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  updateAddress: (
    next: string,
    addressChangeMeta?: { selectedStreetId: string | null },
  ) => void;
  onAddImages: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  onReorderImages: (sourceIndex: number, targetIndex: number) => void;
  buildingNumber?: string;
  onBuildingNumberChange?: (value: string) => void;
};

export function AddPropertyCoreFields({
  form,
  fieldErrors,
  images,
  imageError,
  updateForm,
  updateAddress,
  onAddImages,
  onRemoveImage,
  onReorderImages,
  buildingNumber,
  onBuildingNumberChange,
}: Props) {
  const hasManuallyEditedInternalPriceRef = useRef(false);
  const lastSuggestedInternalInputRef = useRef<string | null>(null);
  const areaSquareMeters = getCreateAreaSquareMeters(form);
  const currencySymbol = listingCurrencySymbol(form.currency);
  const internalPriceAmount = parseListingAmountForHint(form.priceInternal);
  const publicPriceAmount = parseListingAmountForHint(form.pricePublic);

  function applySuggestedInternalPrice(nextPublicInput: string, dealType: DealType) {
    const suggestion = resolveCreateInternalPriceSuggestion({
      dealType,
      nextPublicInput,
      currentInternalInput: form.priceInternal,
      hasManuallyEditedInternalPrice: hasManuallyEditedInternalPriceRef.current,
      lastSuggestedInternalInput: lastSuggestedInternalInputRef.current,
    });

    if (suggestion.kind === "unchanged") {
      return;
    }

    if (suggestion.kind === "keepManual") {
      hasManuallyEditedInternalPriceRef.current = true;
      return;
    }

    lastSuggestedInternalInputRef.current =
      suggestion.internalInput === "" ? null : suggestion.internalInput;
    updateForm("priceInternal", suggestion.internalInput);
  }

  function handlePublicPriceChange(value: string) {
    updateForm("pricePublic", value);
    applySuggestedInternalPrice(value, form.dealType);
  }

  function handleInternalPriceChange(value: string) {
    hasManuallyEditedInternalPriceRef.current = true;
    lastSuggestedInternalInputRef.current = null;
    updateForm("priceInternal", value);
  }

  const pricePerSquareMeterInput = usePricePerSquareMeterInput({
    totalPrice: parseFormNumber(form.pricePublic),
    areaSquareMeters,
    onTotalChange: handlePublicPriceChange,
  });

  function handleDealTypeChange(value: DealType) {
    updateForm("dealType", value);
    applySuggestedInternalPrice(form.pricePublic, value);
  }

  function handleCurrencyChange(nextCurrency: SupportedListingCurrency) {
    updateForm("currency", nextCurrency);
  }

  function handleOwnerAssignmentChange(nextAssignment: PropertyOwnerAssignment) {
    updateForm("ownerAssignment", nextAssignment);
    updateForm("ownerName", nextAssignment.name);
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <SelectField
        id="propertyType"
        label="უძრავი ქონების ტიპი"
        value={form.propertyType}
        onChange={(value) => updateForm("propertyType", value)}
        options={PROPERTY_TYPE_OPTIONS}
      />
      {form.propertyType === "HOTEL" && (
        <SelectField<"" | HotelScope>
          id="hotelScope"
          label="სასტუმროს ტიპი"
          value={form.hotelScope}
          onChange={(next) => updateForm("hotelScope", next)}
          options={[
            { value: "", label: "აირჩიეთ სასტუმროს ტიპი" },
            ...HOTEL_SCOPE_FORM_OPTIONS,
          ]}
          required
          error={fieldErrors.hotelScope}
        />
      )}
      <SelectField
        id="dealType"
        label="გარიგების ტიპი"
        value={form.dealType}
        onChange={handleDealTypeChange}
        options={DEAL_TYPE_OPTIONS}
      />
      <SelectField
        id="city"
        label="ქალაქი"
        value={form.city}
        onChange={(value) => updateForm("city", value)}
        options={GEORGIAN_CITY_OPTIONS}
        required
        error={fieldErrors.city}
      />
      {isTbilisiCity(form.city) ? (
        <DistrictNeighborhoodPicker
          value={form.district}
          onChange={(nextDistrict) => updateForm("district", nextDistrict)}
          error={fieldErrors.district}
        />
      ) : null}
      <div className={buildingNumber !== undefined ? undefined : "sm:col-span-2"}>
        <StreetAutocompleteField
          id="address"
          label="მისამართი"
          value={form.address}
          onChange={updateAddress}
          required
          error={fieldErrors.address}
          inputClassName={addPropertyInputClassName()}
        />
      </div>
      {buildingNumber !== undefined && onBuildingNumberChange !== undefined && (
        <TextField
          id="buildingNumber"
          visibility="private"
          label="კორპუსის ნომერი"
          value={buildingNumber}
          onChange={onBuildingNumberChange}
        />
      )}
      <div className="sm:col-span-2">
        <LabelAutocompleteChipsInput
          id="labels"
          label="ლეიბლები"
          selectedLabels={form.labels}
          onChange={(value) => updateForm("labels", value)}
          allowFreeText
          placeholder="აკრიფეთ ლეიბლის მოსაძებნად ან დასამატებლად"
        />
      </div>
      <div className="sm:col-span-2">
        <CheckboxField
          id="hideFromOthers"
          label={HIDE_FROM_OTHERS_COPY.actionLabel}
          visibility="private"
          checked={form.hideFromOthers}
          onChange={(checked) => updateForm("hideFromOthers", checked)}
        />
      </div>
      <div className="flex items-center justify-between gap-3 sm:col-span-2">
        <p className="text-sm font-medium text-foreground">ფასი</p>
        <PriceCurrencyToggle
          value={form.currency}
          onChange={handleCurrencyChange}
        />
      </div>
      <div className="space-y-1.5">
        <TextField
          id="pricePublic"
          label="საჯარო ფასი"
          value={form.pricePublic}
          onChange={handlePublicPriceChange}
          type="number"
          required
          error={fieldErrors.pricePublic}
          leadingSymbol={currencySymbol}
        />
        <ListingPriceEquivalentHint
          amount={publicPriceAmount}
          fromCurrency={form.currency}
        />
      </div>
      <div className="space-y-1.5">
        <TextField
          id="pricePerSquareMeter"
          label="1 მ² ფასი"
          value={pricePerSquareMeterInput.value}
          onChange={pricePerSquareMeterInput.onChange}
          type="number"
          readOnly={pricePerSquareMeterInput.disabled}
          placeholder={
            pricePerSquareMeterInput.disabled ? "მიუთითეთ ფართობი" : undefined
          }
          leadingSymbol={currencySymbol}
        />
      </div>
      <div className="space-y-1.5">
        <TextField
          id="priceInternal"
          label="შიდა ფასი"
          visibility="private"
          value={form.priceInternal}
          onChange={handleInternalPriceChange}
          type="number"
          error={fieldErrors.priceInternal}
          leadingSymbol={currencySymbol}
        />
        <ListingPriceEquivalentHint
          amount={internalPriceAmount}
          fromCurrency={form.currency}
        />
      </div>
      <PropertyOwnerPickerSection
        assignment={form.ownerAssignment}
        onChange={handleOwnerAssignmentChange}
        error={fieldErrors.ownerAssignment}
      />
      <TextField
        id="cadastralCode"
        visibility="private"
        label="საკადასტრო კოდი"
        value={form.cadastralCode}
        onChange={(value) => updateForm("cadastralCode", value)}
      />
      <ExternalIdList
        ids={form.externalIds}
        onChange={(nextIds) => updateForm("externalIds", nextIds)}
      />
      <div className="sm:col-span-2">
        <ImageUploadField
          images={images}
          onAdd={onAddImages}
          onRemove={onRemoveImage}
          onReorder={onReorderImages}
          error={imageError}
        />
      </div>
    </section>
  );
}
