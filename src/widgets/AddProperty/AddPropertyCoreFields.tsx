"use client";

import { useState } from "react";
import { LabelAutocompleteChipsInput } from "@/features/labels/LabelAutocompleteChipsInput";
import { DEAL_TYPE_OPTIONS } from "@/features/properties/dealType";
import {
  HOTEL_SCOPE_FORM_OPTIONS,
  GEORGIAN_CITY_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
} from "@/features/properties/addPropertyFormOptions";
import type { HotelScope } from "@/features/properties/types";
import { StreetAutocompleteField } from "@/features/streets/StreetAutocompleteField";
import { PROPERTY_STATUS_FILTER_OPTIONS } from "@/features/properties/types";
import {
  addPropertyInputClassName,
  SelectField,
  TextField,
} from "@/widgets/AddProperty/addPropertyFormFields";
import type { FormState } from "@/features/properties/addPropertyFormState";
import type { FormErrors } from "@/features/properties/addPropertyFormValidation";
import { DistrictNeighborhoodPicker } from "@/widgets/AddProperty/DistrictNeighborhoodPicker";

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

type Props = {
  form: FormState;
  fieldErrors: FormErrors;
  updateForm: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  updateAddress: (
    next: string,
    addressChangeMeta?: { selectedStreetId: string | null },
  ) => void;
  onImagesChange: (files: FileList | null) => void;
  buildingNumber?: string;
  onBuildingNumberChange?: (value: string) => void;
};

export function AddPropertyCoreFields({
  form,
  fieldErrors,
  updateForm,
  updateAddress,
  onImagesChange,
  buildingNumber,
  onBuildingNumberChange,
}: Props) {
  const [isWhatsappManuallyEdited, setIsWhatsappManuallyEdited] = useState(false);
  const [isInternalPriceManuallyEdited, setIsInternalPriceManuallyEdited] =
    useState(false);
  const [isPublicPriceManuallyEdited, setIsPublicPriceManuallyEdited] =
    useState(false);

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

  function handleOwnerPhoneChange(value: string) {
    updateForm("ownerPhone", value);
    if (!isWhatsappManuallyEdited) {
      updateForm("ownerWhatsapp", value);
    }
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
        id="listingLifecycleStatus"
        label="Listing status (optional)"
        value={form.listingLifecycleStatus}
        onChange={(value) => updateForm("listingLifecycleStatus", value)}
        options={PROPERTY_STATUS_FILTER_OPTIONS}
      />
      {form.listingLifecycleStatus === "TO_BE_VERIFIED" ? (
        <div className="space-y-1.5 sm:col-span-2">
          <label
            htmlFor="verificationReminderLocal"
            className="block text-sm font-medium text-slate-800"
          >
            Verification reminder (optional)
          </label>
          <input
            id="verificationReminderLocal"
            type="datetime-local"
            value={form.verificationReminderLocal}
            onChange={(event) =>
              updateForm("verificationReminderLocal", event.target.value)
            }
            className={addPropertyInputClassName()}
          />
          <p className="text-xs text-slate-500">
            The server uses this date for scheduled reminders when the listing status is needs
            verification.
          </p>
        </div>
      ) : null}
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
      <TextField
        id="pricePublic"
        label="Public price"
        value={form.pricePublic}
        onChange={handlePublicPriceChange}
        type="number"
        required
        error={fieldErrors.pricePublic}
      />
      <TextField
        id="ownerName"
        label="Owner name"
        value={form.ownerName}
        onChange={(value) => updateForm("ownerName", value)}
        required
        error={fieldErrors.ownerName}
      />
      <TextField
        id="ownerPhone"
        label="Owner phone"
        value={form.ownerPhone}
        onChange={handleOwnerPhoneChange}
        type="tel"
        required
        error={fieldErrors.ownerPhone}
      />
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
      <TextField
        id="myHomeId"
        label="MyHome ID"
        value={form.myHomeId}
        onChange={(value) => updateForm("myHomeId", value)}
      />
      <TextField
        id="ssGeId"
        label="SS.ge ID"
        value={form.ssGeId}
        onChange={(value) => updateForm("ssGeId", value)}
      />
      <div className="space-y-1.5 sm:col-span-2">
        <label htmlFor="description" className="block text-sm font-medium text-slate-800">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(event) => updateForm("description", event.target.value)}
          className={addPropertyInputClassName()}
        />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <label htmlFor="images" className="block text-sm font-medium text-slate-800">
          Images (optional, up to 10)
        </label>
        <input
          id="images"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={(event) => onImagesChange(event.target.files)}
          className={addPropertyInputClassName()}
        />
      </div>
    </section>
  );
}
