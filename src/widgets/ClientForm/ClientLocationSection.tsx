"use client";

import {
  Controller,
  useFieldArray,
  type Control,
} from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import { PreferenceLockButton } from "@/widgets/ClientForm/PreferenceLockButton";

type ClientLocationSectionProps = {
  control: Control<ClientFormValues>;
  fieldDescriptions?: Record<string, string>;
  showLockForPath?: (path: string) => boolean;
};

export function ClientLocationSection({
  control,
  fieldDescriptions,
  showLockForPath = () => true,
}: ClientLocationSectionProps) {
  const {
    fields: districtFields,
    append: appendDistrict,
    remove: removeDistrict,
  } = useFieldArray({
    control,
    name: "districts.value" as never,
  });
  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control,
    name: "addresses.value" as never,
  });
  const {
    fields: labelFields,
    append: appendLabel,
    remove: removeLabel,
  } = useFieldArray({
    control,
    name: "labels.value" as never,
  });
  const addLabelEntry = () => {
    appendLabel("");
  };

  const removeLabelEntry = (labelIndex: number) => {
    removeLabel(labelIndex);
  };

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-base font-semibold text-slate-800">Location</h2>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <label className="block flex-1 text-sm font-medium text-slate-800">
              Districts
            </label>
            {showLockForPath("districts") ? (
              <Controller
                name="districts.lock"
                control={control}
                render={({ field }) => (
                  <PreferenceLockButton value={field.value} onChange={field.onChange} />
                )}
              />
            ) : null}
          </div>
          <Controller
            name={"districts.value" as never}
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                {districtFields.length > 0 ? (
                  districtFields.map((districtField, districtIndex) => (
                    <div key={districtField.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={field.value?.[districtIndex] ?? ""}
                        onChange={(event) => {
                          const currentDistricts = (field.value ?? []) as string[];
                          const nextDistricts = [...currentDistricts];
                          nextDistricts[districtIndex] = event.target.value;
                          field.onChange(nextDistricts);
                        }}
                        className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeDistrict(districtIndex)}
                        className="flex-none text-slate-400 transition hover:text-red-600"
                        aria-label="Remove district"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Add a district to get started.</p>
                )}
                <button
                  type="button"
                  onClick={() => appendDistrict("")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition hover:text-slate-900"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Add district
                </button>
              </div>
            )}
          />
          {fieldDescriptions?.districts ? (
            <p className="text-xs text-slate-500">{fieldDescriptions.districts}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <label className="block flex-1 text-sm font-medium text-slate-800">
              Addresses
            </label>
            {showLockForPath("addresses") ? (
              <Controller
                name="addresses.lock"
                control={control}
                render={({ field }) => (
                  <PreferenceLockButton value={field.value} onChange={field.onChange} />
                )}
              />
            ) : null}
          </div>
          <Controller
            name={"addresses.value" as never}
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                {addressFields.length > 0 ? (
                  addressFields.map((addressField, addressIndex) => (
                    <div key={addressField.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={field.value?.[addressIndex] ?? ""}
                        onChange={(event) => {
                          const currentAddresses = (field.value ?? []) as string[];
                          const nextAddresses = [...currentAddresses];
                          nextAddresses[addressIndex] = event.target.value;
                          field.onChange(nextAddresses);
                        }}
                        className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeAddress(addressIndex)}
                        className="flex-none text-slate-400 transition hover:text-red-600"
                        aria-label="Remove address"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Add an address to get started.</p>
                )}
                <button
                  type="button"
                  onClick={() => appendAddress("")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition hover:text-slate-900"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Add address
                </button>
              </div>
            )}
          />
          {fieldDescriptions?.addresses ? (
            <p className="text-xs text-slate-500">{fieldDescriptions.addresses}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <label className="block flex-1 text-sm font-medium text-slate-800">Labels</label>
            {showLockForPath("labels") ? (
              <Controller
                name="labels.lock"
                control={control}
                render={({ field }) => (
                  <PreferenceLockButton value={field.value} onChange={field.onChange} />
                )}
              />
            ) : null}
          </div>
          <Controller
            name={"labels.value" as never}
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                {labelFields.length > 0 ? (
                  labelFields.map((labelField, labelIndex) => (
                    <div key={labelField.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={field.value?.[labelIndex] ?? ""}
                        onChange={(event) => {
                          const currentLabels = (field.value ?? []) as string[];
                          const nextLabels = [...currentLabels];
                          nextLabels[labelIndex] = event.target.value;
                          field.onChange(nextLabels);
                        }}
                        className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeLabelEntry(labelIndex)}
                        className="flex-none text-slate-400 transition hover:text-red-600"
                        aria-label="Remove label"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Add a label to get started.</p>
                )}
                <button
                  type="button"
                  onClick={addLabelEntry}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition hover:text-slate-900"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Add label
                </button>
              </div>
            )}
          />
          {fieldDescriptions?.labels ? (
            <p className="text-xs text-slate-500">{fieldDescriptions.labels}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
