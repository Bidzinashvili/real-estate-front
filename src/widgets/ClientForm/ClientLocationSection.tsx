"use client";

import {
  Controller,
  useFieldArray,
  useWatch,
  type Control,
  type UseFormSetValue,
} from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { ClientLabelsField } from "@/widgets/ClientForm/ClientLabelsField";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import {
  CLIENT_CITY_OPTIONS,
  CLIENT_CITY_TBILISI_SUBURBS,
  isClientCity,
  shouldShowTbilisiNeighborhoods,
} from "@/features/clients/clientCities";
import { PreferenceLockButton } from "@/widgets/ClientForm/PreferenceLockButton";
import { NeighborhoodChecklist } from "@/widgets/Districts/NeighborhoodChecklist";
import { OptionChips, OPTION_CHIPS_FORM_LABEL_CLASS_NAME } from "@/shared/ui/OptionChips";

const TBILISI_NEIGHBORHOOD_EXCLUDED_GROUPS = [CLIENT_CITY_TBILISI_SUBURBS];

type ClientLocationSectionProps = {
  control: Control<ClientFormValues>;
  setValue: UseFormSetValue<ClientFormValues>;
  fieldDescriptions?: Record<string, string>;
  showLockForPath?: (path: string) => boolean;
};

export function ClientLocationSection({
  control,
  setValue,
  fieldDescriptions,
  showLockForPath = () => true,
}: ClientLocationSectionProps) {
  const selectedCity = useWatch({ control, name: "city" });
  const showTbilisiNeighborhoods = shouldShowTbilisiNeighborhoods(selectedCity);
  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control,
    name: "addresses.value" as never,
  });
  return (
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h2 className="mb-4 text-base font-semibold text-foreground">მდებარეობა</h2>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <OptionChips
                label="ქალაქი"
                labelClassName={OPTION_CHIPS_FORM_LABEL_CLASS_NAME}
                value={field.value}
                onChange={(nextCity) => {
                  if (!isClientCity(nextCity)) {
                    return;
                  }
                  field.onChange(nextCity);
                  if (!shouldShowTbilisiNeighborhoods(nextCity)) {
                    setValue("districts.value", [], {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }
                }}
                options={CLIENT_CITY_OPTIONS}
              />
            )}
          />
          {fieldDescriptions?.city ? (
            <p className="text-xs text-muted-foreground">{fieldDescriptions.city}</p>
          ) : null}
        </div>

        {showTbilisiNeighborhoods ? (
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
                    <PreferenceLockButton mode="client-form" value={field.value} onChange={field.onChange} />
                  )}
                />
              ) : null}
            </div>
            <Controller
              name="districts.value"
              control={control}
              render={({ field }) => (
                <NeighborhoodChecklist
                  selectedNeighborhoods={field.value ?? []}
                  onChange={field.onChange}
                  excludeGroupNames={TBILISI_NEIGHBORHOOD_EXCLUDED_GROUPS}
                />
              )}
            />
            {fieldDescriptions?.districts ? (
              <p className="text-xs text-muted-foreground">{fieldDescriptions.districts}</p>
            ) : null}
          </div>
        ) : null}

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
                  <PreferenceLockButton mode="client-form" value={field.value} onChange={field.onChange} />
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

        <Controller
          name={"labels.value" as never}
          control={control}
          render={({ field }) => (
            <ClientLabelsField
              value={(field.value ?? []) as string[]}
              onChange={field.onChange}
              fieldDescription={fieldDescriptions?.labels}
            />
          )}
        />
      </div>
    </section>
  );
}
