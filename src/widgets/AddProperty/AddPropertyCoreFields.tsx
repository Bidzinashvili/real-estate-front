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
import { resolveCreatePublicPriceSuggestion } from "@/features/properties/linkedPropertyPrices";
import {
  calculatePricePerSquareMeter,
  formatPricePerSquareMeter,
} from "@/features/properties/pricePerSquareMeter";
import { HistoryNoteField } from "@/widgets/HistoryNoteField/HistoryNoteField";
import { PropertyOwnerPickerSection } from "@/widgets/PropertyOwners/PropertyOwnerPickerSection";
import type { PropertyOwnerAssignment } from "@/features/propertyOwners/types";
import { PublicCommentGenerateField } from "@/widgets/Properties/PublicCommentGenerateField";
import { buildGeneratePublicTextDraftFromCreateForm } from "@/features/properties/generatePublicTextDraft";
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
  const hasManuallyEditedPublicPriceRef = useRef(false);
  const lastSuggestedPublicInputRef = useRef<string | null>(null);
  const pricePerSquareMeter = calculatePricePerSquareMeter(
    parseFormNumber(form.pricePublic),
    getCreateAreaSquareMeters(form),
  );
  const currencySymbol = listingCurrencySymbol(form.currency);
  const internalPriceAmount = parseListingAmountForHint(form.priceInternal);
  const publicPriceAmount = parseListingAmountForHint(form.pricePublic);

  function applySuggestedPublicPrice(nextInternalInput: string, dealType: DealType) {
    const suggestion = resolveCreatePublicPriceSuggestion({
      dealType,
      nextInternalInput,
      currentPublicInput: form.pricePublic,
      hasManuallyEditedPublicPrice: hasManuallyEditedPublicPriceRef.current,
      lastSuggestedPublicInput: lastSuggestedPublicInputRef.current,
    });

    if (suggestion.kind === "unchanged") {
      return;
    }

    if (suggestion.kind === "keepManual") {
      hasManuallyEditedPublicPriceRef.current = true;
      return;
    }

    lastSuggestedPublicInputRef.current =
      suggestion.publicInput === "" ? null : suggestion.publicInput;
    updateForm("pricePublic", suggestion.publicInput);
  }

  function handleInternalPriceChange(value: string) {
    updateForm("priceInternal", value);
    applySuggestedPublicPrice(value, form.dealType);
  }

  function handlePublicPriceChange(value: string) {
    hasManuallyEditedPublicPriceRef.current = true;
    lastSuggestedPublicInputRef.current = null;
    updateForm("pricePublic", value);
  }

  function handleDealTypeChange(value: DealType) {
    updateForm("dealType", value);
    applySuggestedPublicPrice(form.priceInternal, value);
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
          value={
            form.districtGroup || form.district
              ? {
                  group: form.districtGroup,
                  neighborhood: form.district,
                }
              : null
          }
          onChange={(next) => {
            updateForm("districtGroup", next?.group ?? "");
            updateForm("district", next?.neighborhood ?? "");
          }}
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
          id="priceInternal"
          label="შიდა ფასი"
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
        {pricePerSquareMeter !== null ? (
          <p className="text-xs font-medium text-muted-foreground">
            {formatPricePerSquareMeter(pricePerSquareMeter, form.currency)}
          </p>
        ) : null}
      </div>
      <PropertyOwnerPickerSection
        assignment={form.ownerAssignment}
        onChange={handleOwnerAssignmentChange}
        error={fieldErrors.ownerAssignment}
      />
      <TextField
        id="cadastralCode"
        label="საკადასტრო კოდი"
        value={form.cadastralCode}
        onChange={(value) => updateForm("cadastralCode", value)}
      />
      <ExternalIdList
        ids={form.externalIds}
        onChange={(nextIds) => updateForm("externalIds", nextIds)}
      />
      <PublicCommentGenerateField
        id="publicComment"
        value={form.publicComment}
        onChange={(nextValue) => updateForm("publicComment", nextValue)}
        buildDraft={() => buildGeneratePublicTextDraftFromCreateForm(form)}
        textareaClassName={addPropertyInputClassName()}
      />
      <div className="space-y-1.5 sm:col-span-2">
        <label htmlFor="internalText" className="block text-sm font-medium text-foreground">
          ატვირთვის ტექსტი
        </label>
        <textarea
          id="internalText"
          rows={3}
          value={form.internalText}
          onChange={(event) => updateForm("internalText", event.target.value)}
          className={addPropertyInputClassName()}
        />
      </div>
      <div className="sm:col-span-2">
        <HistoryNoteField
          id="privateComment"
          label="კომენტარი ჩემთვის"
          value={form.privateComment}
          onChange={(nextValue) => updateForm("privateComment", nextValue)}
          textareaClassName={addPropertyInputClassName()}
        />
      </div>

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
