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
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h2 className="mb-4 text-base font-semibold text-foreground">მდებარეობა</h2>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <label className="block flex-1 text-sm font-medium text-foreground">
              უბნები
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
                        className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => removeDistrict(districtIndex)}
                        className="flex-none text-muted-foreground transition hover:text-destructive"
                        aria-label="უბნის წაშლა"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">დაამატეთ უბანი დასაწყებად.</p>
                )}
                <button
                  type="button"
                  onClick={() => appendDistrict("")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  უბნის დამატება
                </button>
              </div>
            )}
          />
          {fieldDescriptions?.districts ? (
            <p className="text-xs text-muted-foreground">{fieldDescriptions.districts}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <label className="block flex-1 text-sm font-medium text-foreground">
              მისამართები
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
                        className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => removeAddress(addressIndex)}
                        className="flex-none text-muted-foreground transition hover:text-destructive"
                        aria-label="მისამართის წაშლა"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">დაამატეთ მისამართი დასაწყებად.</p>
                )}
                <button
                  type="button"
                  onClick={() => appendAddress("")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  მისამართის დამატება
                </button>
              </div>
            )}
          />
          {fieldDescriptions?.addresses ? (
            <p className="text-xs text-muted-foreground">{fieldDescriptions.addresses}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <label className="block flex-1 text-sm font-medium text-foreground">ლეიბლები</label>
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
                        className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => removeLabelEntry(labelIndex)}
                        className="flex-none text-muted-foreground transition hover:text-destructive"
                        aria-label="ლეიბლის წაშლა"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">დაამატეთ ლეიბლი დასაწყებად.</p>
                )}
                <button
                  type="button"
                  onClick={addLabelEntry}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  ლეიბლის დამატება
                </button>
              </div>
            )}
          />
          {fieldDescriptions?.labels ? (
            <p className="text-xs text-muted-foreground">{fieldDescriptions.labels}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
