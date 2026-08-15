"use client";

import { useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { LabelAutocompleteChipsInput } from "@/features/labels/LabelAutocompleteChipsInput";
import { DEAL_TYPE_OPTIONS } from "@/features/properties/dealType";
import {
  HOTEL_SCOPE_FORM_OPTIONS,
  GEORGIAN_CITY_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
} from "@/features/properties/addPropertyFormOptions";
import type { HotelScope } from "@/features/properties/types";
import { StreetAutocompleteField } from "@/features/streets/StreetAutocompleteField";
import {
  addPropertyInputClassName,
  SelectField,
  TextField,
} from "@/widgets/AddProperty/addPropertyFormFields";
import type { FormState } from "@/features/properties/addPropertyFormState";
import type { FormErrors } from "@/features/properties/addPropertyFormValidation";
import { DistrictNeighborhoodPicker } from "@/widgets/AddProperty/DistrictNeighborhoodPicker";
import { ImageUploadField } from "@/widgets/AddProperty/ImageUploadField";
import { ExternalIdList } from "@/shared/components/ExternalIdList";
import { applyDatedPersonalCommentEntry } from "@/shared/lib/personalCommentEntry";
import {
  calculatePricePerSquareMeter,
  formatPricePerSquareMeter,
} from "@/features/properties/pricePerSquareMeter";

const publicPriceMarkupRatio = 1.03;
const publicPriceRoundingInterval = 500;

function computePublicPriceFromInternal(internalPriceInput: string): string {
  const trimmedInternal = internalPriceInput.trim();
  if (trimmedInternal === "") return "";
  const internalNumber = parseFloat(trimmedInternal);
  if (!Number.isFinite(internalNumber)) return "";
  const markedPrice = internalNumber * publicPriceMarkupRatio;
  const roundedPrice =
    Math.round(markedPrice / publicPriceRoundingInterval) *
    publicPriceRoundingInterval;
  return String(roundedPrice);
}

function computeInternalPriceFromPublic(publicPriceInput: string): string {
  const trimmedPublic = publicPriceInput.trim();
  if (trimmedPublic === "") return "";
  const publicNumber = parseFloat(trimmedPublic);
  if (!Number.isFinite(publicNumber)) return "";
  return String(Math.round(publicNumber / publicPriceMarkupRatio));
}

function parseFormNumber(value: string): number | null {
  const trimmedValue = value.trim();
  if (trimmedValue === "") return null;
  const parsedValue = Number(trimmedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
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
  const [isWhatsappManuallyEdited, setIsWhatsappManuallyEdited] = useState(false);
  const [isInternalPriceManuallyEdited, setIsInternalPriceManuallyEdited] =
    useState(false);
  const [isPublicPriceManuallyEdited, setIsPublicPriceManuallyEdited] =
    useState(false);
  const isPersonalCommentEntryActiveRef = useRef(false);
  const pricePerSquareMeter = calculatePricePerSquareMeter(
    parseFormNumber(form.pricePublic),
    getCreateAreaSquareMeters(form),
  );

  function handleInternalPriceChange(value: string) {
    if (value.trim() === "") {
      setIsInternalPriceManuallyEdited(false);
      updateForm("priceInternal", "");
      return;
    }
    setIsInternalPriceManuallyEdited(true);
    updateForm("priceInternal", value);
    if (!isPublicPriceManuallyEdited && form.dealType === "SALE") {
      updateForm("pricePublic", computePublicPriceFromInternal(value));
    }
  }

  function handleDealTypeChange(value: FormState["dealType"]) {
    if (value !== "SALE" && !isPublicPriceManuallyEdited) {
      updateForm("pricePublic", "");
    }
    updateForm("dealType", value);
  }

  function handlePublicPriceChange(value: string) {
    if (value.trim() === "") {
      setIsPublicPriceManuallyEdited(false);
      updateForm("pricePublic", "");
      return;
    }
    const shouldAutoFillInternal =
      !isInternalPriceManuallyEdited && form.dealType === "SALE";
    setIsInternalPriceManuallyEdited(false);
    updateForm("pricePublic", value);
    setIsPublicPriceManuallyEdited(true);
    if (shouldAutoFillInternal) {
      updateForm("priceInternal", computeInternalPriceFromPublic(value));
    }
  }

  function handleOwnerPhoneChange(phoneIndex: number, value: string) {
    const updated = [...form.ownerPhones];
    updated[phoneIndex] = value;
    updateForm("ownerPhones", updated);
    if (phoneIndex === 0 && !isWhatsappManuallyEdited) {
      updateForm("ownerWhatsapp", value);
    }
  }

  function handleAddOwnerPhone() {
    updateForm("ownerPhones", [...form.ownerPhones, "+995"]);
  }

  function handleRemoveOwnerPhone(phoneIndex: number) {
    const updated = form.ownerPhones.filter((_phone, idx) => idx !== phoneIndex);
    updateForm("ownerPhones", updated);
  }

  function handleOwnerWhatsappChange(value: string) {
    if (value.trim() === "") {
      setIsWhatsappManuallyEdited(false);
      updateForm("ownerWhatsapp", "");
      return;
    }
    updateForm("ownerWhatsapp", value);
    setIsWhatsappManuallyEdited(true);
  }

  function handlePrivateCommentChange(value: string) {
    const result = applyDatedPersonalCommentEntry({
      previousValue: form.privateComment,
      rawValue: value,
      isEntryActive: isPersonalCommentEntryActiveRef.current,
    });
    isPersonalCommentEntryActiveRef.current = result.isEntryActive;
    updateForm("privateComment", result.nextValue);
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <SelectField
        id="propertyType"
        label="Property type"
        value={form.propertyType}
        onChange={(value) => updateForm("propertyType", value)}
        options={PROPERTY_TYPE_OPTIONS}
      />
      {form.propertyType === "HOTEL" && (
        <SelectField<"" | HotelScope>
          id="hotelScope"
          label="Hotel scope"
          value={form.hotelScope}
          onChange={(next) => updateForm("hotelScope", next)}
          options={[
            { value: "", label: "Select hotel scope" },
            ...HOTEL_SCOPE_FORM_OPTIONS,
          ]}
          required
          error={fieldErrors.hotelScope}
        />
      )}
      <SelectField
        id="dealType"
        label="Deal type"
        value={form.dealType}
        onChange={handleDealTypeChange}
        options={DEAL_TYPE_OPTIONS}
      />
      <SelectField
        id="city"
        label="City"
        value={form.city}
        onChange={(value) => updateForm("city", value)}
        options={GEORGIAN_CITY_OPTIONS}
        required
        error={fieldErrors.city}
      />
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
      <div className={buildingNumber !== undefined ? undefined : "sm:col-span-2"}>
        <StreetAutocompleteField
          id="address"
          label="Address"
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
          label="Building number"
          value={buildingNumber}
          onChange={onBuildingNumberChange}
        />
      )}
      <div className="sm:col-span-2">
        <LabelAutocompleteChipsInput
          id="labels"
          label="Labels"
          selectedLabels={form.labels}
          onChange={(value) => updateForm("labels", value)}
          allowFreeText
          placeholder="Type to search or add labels"
        />
      </div>
      <TextField
        id="priceInternal"
        label="Internal price"
        value={form.priceInternal}
        onChange={handleInternalPriceChange}
        type="number"
        error={fieldErrors.priceInternal}
      />
      <div className="space-y-1.5">
        <TextField
          id="pricePublic"
          label="Public price"
          value={form.pricePublic}
          onChange={handlePublicPriceChange}
          type="number"
          required
          error={fieldErrors.pricePublic}
        />
        {pricePerSquareMeter !== null ? (
          <p className="text-xs font-medium text-slate-600">
            {formatPricePerSquareMeter(pricePerSquareMeter)}
          </p>
        ) : null}
      </div>
      <TextField
        id="ownerName"
        label="Owner name"
        value={form.ownerName}
        onChange={(value) => updateForm("ownerName", value)}
        required
        error={fieldErrors.ownerName}
      />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-800">
          Owner phone <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {form.ownerPhones.map((phone, phoneIndex) => (
            <div key={phoneIndex} className="flex items-center gap-2">
              <input
                id={phoneIndex === 0 ? "ownerPhone" : undefined}
                type="tel"
                value={phone}
                onChange={(event) => handleOwnerPhoneChange(phoneIndex, event.target.value)}
                className={`${addPropertyInputClassName()} ${fieldErrors[`ownerPhones.${phoneIndex}`] ? "border-red-500 focus:border-red-600" : ""}`}
              />
              {form.ownerPhones.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOwnerPhone(phoneIndex)}
                  className="flex-none text-slate-400 transition hover:text-red-600"
                  aria-label="Remove phone"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOwnerPhone}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition hover:text-slate-900"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add phone
          </button>
        </div>
        {fieldErrors["ownerPhones"] && (
          <p className="text-xs text-red-600" role="alert">
            {fieldErrors["ownerPhones"]}
          </p>
        )}
        {form.ownerPhones.map((_phone, phoneIndex) =>
          fieldErrors[`ownerPhones.${phoneIndex}`] ? (
            <p key={phoneIndex} className="text-xs text-red-600" role="alert">
              {fieldErrors[`ownerPhones.${phoneIndex}`]}
            </p>
          ) : null,
        )}
      </div>
      <TextField
        id="ownerWhatsapp"
        label="Owner WhatsApp"
        value={form.ownerWhatsapp}
        onChange={handleOwnerWhatsappChange}
      />
      <TextField
        id="cadastralCode"
        label="Cadastral code"
        value={form.cadastralCode}
        onChange={(value) => updateForm("cadastralCode", value)}
      />
      <ExternalIdList
        ids={form.externalIds}
        onChange={(nextIds) => updateForm("externalIds", nextIds)}
      />
      <div className="space-y-1.5 sm:col-span-2">
        <label htmlFor="publicComment" className="block text-sm font-medium text-slate-800">
          Comment
        </label>
        <textarea
          id="publicComment"
          rows={3}
          value={form.publicComment}
          onChange={(event) => updateForm("publicComment", event.target.value)}
          className={addPropertyInputClassName()}
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <label htmlFor="internalText" className="block text-sm font-medium text-slate-800">
          Upload text
        </label>
        <textarea
          id="internalText"
          rows={3}
          value={form.internalText}
          onChange={(event) => updateForm("internalText", event.target.value)}
          className={addPropertyInputClassName()}
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <label
          htmlFor="privateComment"
          className="block text-sm font-medium text-slate-800"
        >
          Comment for myself
        </label>
        <textarea
          id="privateComment"
          rows={4}
          value={form.privateComment}
          onChange={(event) => handlePrivateCommentChange(event.target.value)}
          onBlur={() => {
            isPersonalCommentEntryActiveRef.current = false;
          }}
          className={addPropertyInputClassName()}
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
