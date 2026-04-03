"use client";

import { DEAL_TYPE_OPTIONS } from "@/features/properties/dealType";
import { PROPERTY_TYPE_OPTIONS } from "@/features/properties/addPropertyFormOptions";
import {
  addPropertyInputClassName,
  SelectField,
  TextField,
} from "@/widgets/AddProperty/addPropertyFormFields";
import type { FormState } from "@/features/properties/addPropertyFormState";
import type { FormErrors } from "@/features/properties/addPropertyFormValidation";

type Props = {
  form: FormState;
  fieldErrors: FormErrors;
  updateForm: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onImagesChange: (files: FileList | null) => void;
};

export function AddPropertyCoreFields({
  form,
  fieldErrors,
  updateForm,
  onImagesChange,
}: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <SelectField
        id="propertyType"
        label="Property type"
        value={form.propertyType}
        onChange={(value) => updateForm("propertyType", value)}
        options={PROPERTY_TYPE_OPTIONS}
      />
      <SelectField
        id="dealType"
        label="Deal type"
        value={form.dealType}
        onChange={(value) => updateForm("dealType", value)}
        options={DEAL_TYPE_OPTIONS}
      />
      <TextField
        id="city"
        label="City"
        value={form.city}
        onChange={(value) => updateForm("city", value)}
        required
        error={fieldErrors.city}
      />
      <TextField
        id="district"
        label="District"
        value={form.district}
        onChange={(value) => updateForm("district", value)}
        required
        error={fieldErrors.district}
      />
      <TextField
        id="address"
        label="Address"
        value={form.address}
        onChange={(value) => updateForm("address", value)}
        required
        error={fieldErrors.address}
      />
      <TextField
        id="pricePublic"
        label="Public price"
        value={form.pricePublic}
        onChange={(value) => updateForm("pricePublic", value)}
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
        onChange={(value) => updateForm("ownerPhone", value)}
        type="tel"
        required
        error={fieldErrors.ownerPhone}
      />
      <TextField
        id="ownerWhatsapp"
        label="Owner WhatsApp"
        value={form.ownerWhatsapp}
        onChange={(value) => updateForm("ownerWhatsapp", value)}
      />
      <TextField
        id="cadastralCode"
        label="Cadastral code"
        value={form.cadastralCode}
        onChange={(value) => updateForm("cadastralCode", value)}
      />
      <TextField
        id="priceInternal"
        label="Internal price"
        value={form.priceInternal}
        onChange={(value) => updateForm("priceInternal", value)}
        type="number"
        error={fieldErrors.priceInternal}
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
