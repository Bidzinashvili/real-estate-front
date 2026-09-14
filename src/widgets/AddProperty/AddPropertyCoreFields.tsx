"use client";

import { LabelAutocompleteChipsInput } from "@/features/labels/LabelAutocompleteChipsInput";
import { DEAL_TYPE_OPTIONS } from "@/features/properties/dealType";
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
  SelectField,
  TextField,
} from "@/widgets/AddProperty/addPropertyFormFields";
import type { FormState } from "@/features/properties/addPropertyFormState";
import type { FormErrors } from "@/features/properties/addPropertyFormValidation";
import { DistrictNeighborhoodPicker } from "@/widgets/AddProperty/DistrictNeighborhoodPicker";
import { ImageUploadField } from "@/widgets/AddProperty/ImageUploadField";
import { ExternalIdList } from "@/shared/components/ExternalIdList";
import { applyLinkedPropertyPriceInputChange } from "@/features/properties/linkedPropertyPrices";
import {
  calculatePricePerSquareMeter,
  formatPricePerSquareMeter,
} from "@/features/properties/pricePerSquareMeter";
import type { PropertyFieldLocks } from "@/features/matching/matchingEnums";
import { applyPropertyFieldLock, readPropertyFieldLock } from "@/features/matching/persistEntityLock";
import { FieldWithLock } from "@/widgets/ClientForm/PreferenceLockButton";
import { HistoryNoteField } from "@/widgets/HistoryNoteField/HistoryNoteField";
import { PropertyOwnerPickerSection } from "@/widgets/PropertyOwners/PropertyOwnerPickerSection";
import type { PropertyOwnerAssignment } from "@/features/propertyOwners/types";
import { PublicCommentGenerateField } from "@/widgets/Properties/PublicCommentGenerateField";
import { buildGeneratePublicTextDraftFromCreateForm } from "@/features/properties/generatePublicTextDraft";

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
  fieldLocks: PropertyFieldLocks;
  patchFieldLocks: (nextLocks: PropertyFieldLocks) => void;
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
  fieldLocks,
  patchFieldLocks,
  updateForm,
  updateAddress,
  onAddImages,
  onRemoveImage,
  onReorderImages,
  buildingNumber,
  onBuildingNumberChange,
}: Props) {
  const showMatchingLocks = form.propertyType === "APARTMENT";
  const pricePerSquareMeter = calculatePricePerSquareMeter(
    parseFormNumber(form.pricePublic),
    getCreateAreaSquareMeters(form),
  );

  function handleInternalPriceChange(value: string) {
    const linkedPrices = applyLinkedPropertyPriceInputChange({
      changedField: "priceInternal",
      nextInput: value,
      currentInternal: form.priceInternal,
      currentPublic: form.pricePublic,
    });
    updateForm("priceInternal", linkedPrices.priceInternal);
    updateForm("pricePublic", linkedPrices.pricePublic);
  }

  function handlePublicPriceChange(value: string) {
    const linkedPrices = applyLinkedPropertyPriceInputChange({
      changedField: "pricePublic",
      nextInput: value,
      currentInternal: form.priceInternal,
      currentPublic: form.pricePublic,
    });
    updateForm("priceInternal", linkedPrices.priceInternal);
    updateForm("pricePublic", linkedPrices.pricePublic);
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
        onChange={(value) => updateForm("dealType", value)}
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
        {showMatchingLocks ? (
          <FieldWithLock
            lock={readPropertyFieldLock(fieldLocks, "street")}
            onLockChange={(nextLock) =>
              patchFieldLocks(applyPropertyFieldLock(fieldLocks, "street", nextLock))
            }
          >
            <StreetAutocompleteField
              id="address"
              label="მისამართი"
              value={form.address}
              onChange={updateAddress}
              required
              error={fieldErrors.address}
              inputClassName={addPropertyInputClassName()}
            />
          </FieldWithLock>
        ) : (
          <StreetAutocompleteField
            id="address"
            label="მისამართი"
            value={form.address}
            onChange={updateAddress}
            required
            error={fieldErrors.address}
            inputClassName={addPropertyInputClassName()}
          />
        )}
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
      <TextField
        id="priceInternal"
        label="შიდა ფასი"
        value={form.priceInternal}
        onChange={handleInternalPriceChange}
        type="number"
        error={fieldErrors.priceInternal}
      />
      <div className="space-y-1.5">
        {showMatchingLocks ? (
          <FieldWithLock
            lock={readPropertyFieldLock(fieldLocks, "price")}
            onLockChange={(nextLock) =>
              patchFieldLocks(applyPropertyFieldLock(fieldLocks, "price", nextLock))
            }
          >
            <TextField
              id="pricePublic"
              label="საჯარო ფასი"
              value={form.pricePublic}
              onChange={handlePublicPriceChange}
              type="number"
              required
              error={fieldErrors.pricePublic}
            />
          </FieldWithLock>
        ) : (
          <TextField
            id="pricePublic"
            label="საჯარო ფასი"
            value={form.pricePublic}
            onChange={handlePublicPriceChange}
            type="number"
            required
            error={fieldErrors.pricePublic}
          />
        )}
        {pricePerSquareMeter !== null ? (
          <p className="text-xs font-medium text-muted-foreground">
            {formatPricePerSquareMeter(pricePerSquareMeter)}
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
