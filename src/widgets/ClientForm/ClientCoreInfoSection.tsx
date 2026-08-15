"use client";

import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import {
  DEAL_TYPES,
  CLIENT_STATUSES,
  DEAL_TYPE_LABELS,
  CLIENT_STATUS_LABELS,
} from "@/features/clients/clientEnums";
import type { EnumSelectOption } from "@/features/clientInviteLinks/formSchemaHints";
import { PreferenceLockButton } from "@/widgets/ClientForm/PreferenceLockButton";

type ClientCoreInfoSectionProps = {
  control: Control<ClientFormValues>;
  register: UseFormRegister<ClientFormValues>;
  setValue: UseFormSetValue<ClientFormValues>;
  errors: FieldErrors<ClientFormValues>;
  phoneFields: Array<{ id: string }>;
  appendPhone: (value: string) => void;
  removePhone: (index: number) => void;
  isRentDeal?: boolean;
  showDefaultStatusOption?: boolean;
  optionalStatusChoice?: boolean;
  showClientStatusField?: boolean;
  showReminderDateField?: boolean;
  showReminderHint?: boolean;
  fieldDescriptions?: Record<string, string>;
  dealTypeSelectOptions?: EnumSelectOption[];
  clientStatusSelectOptions?: EnumSelectOption[];
  showLockForPath?: (path: string) => boolean;
};

export function ClientCoreInfoSection({
  control,
  register,
  setValue,
  errors,
  phoneFields,
  appendPhone,
  removePhone,
  isRentDeal = false,
  showDefaultStatusOption = false,
  optionalStatusChoice = false,
  showClientStatusField = true,
  showReminderDateField = true,
  showReminderHint = false,
  fieldDescriptions,
  dealTypeSelectOptions,
  clientStatusSelectOptions,
  showLockForPath = () => true,
}: ClientCoreInfoSectionProps) {
  const [isWhatsappManuallyEdited, setIsWhatsappManuallyEdited] = useState(false);
  const dealOptions =
    dealTypeSelectOptions ??
    DEAL_TYPES.map((dealType) => ({
      value: dealType,
      label: DEAL_TYPE_LABELS[dealType],
    }));
  const statusSelectOptions =
    clientStatusSelectOptions ??
    CLIENT_STATUSES.map((clientStatus) => ({
      value: clientStatus,
      label: CLIENT_STATUS_LABELS[clientStatus],
    }));
  const firstPhoneRegistration = register("phones.0");
  const whatsappRegistration = register("whatsapp");

  return (
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h2 className="mb-4 text-base font-semibold text-foreground">ძირითადი ინფორმაცია</h2>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            სრული სახელი <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("name")}
            className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          {errors.name && (
            <p className="text-xs text-destructive" role="alert">
              {errors.name.message}
            </p>
          )}
          {fieldDescriptions?.name ? (
            <p className="text-xs text-muted-foreground">{fieldDescriptions.name}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            ტელეფონები <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="tel"
                {...firstPhoneRegistration}
                {...{
                  onChange: (event) => {
                    firstPhoneRegistration.onChange(event);
                    if (!isWhatsappManuallyEdited) {
                      setValue("whatsapp", event.target.value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }
                  },
                }}
                className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            {phoneFields.slice(1).map((field, phoneIndex) => {
              const actualPhoneIndex = phoneIndex + 1;

              return (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="tel"
                    {...register(`phones.${actualPhoneIndex}`)}
                    className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => removePhone(actualPhoneIndex)}
                    className="flex-none text-muted-foreground transition hover:text-destructive"
                    aria-label="ტელეფონის წაშლა"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => appendPhone("+995")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              ტელეფონის დამატება
            </button>
          </div>
          {errors.phones && (
            <p className="text-xs text-destructive" role="alert">
              {errors.phones.message ?? errors.phones.root?.message}
            </p>
          )}
          {fieldDescriptions?.phones ? (
            <p className="text-xs text-muted-foreground">{fieldDescriptions.phones}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">WhatsApp</label>
            <input
              type="tel"
              {...whatsappRegistration}
              {...{
                onChange: (event) => {
                  whatsappRegistration.onChange(event);
                  if (event.target.value.trim() === "") {
                    setIsWhatsappManuallyEdited(false);
                    return;
                  }
                  setIsWhatsappManuallyEdited(true);
                },
              }}
              className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            {fieldDescriptions?.whatsapp ? (
              <p className="text-xs text-muted-foreground">{fieldDescriptions.whatsapp}</p>
            ) : null}
          </div>

          {isRentDeal ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <label className="block flex-1 text-sm font-medium text-foreground">შინაური ცხოველი</label>
                {showLockForPath("pet") ? (
                  <Controller
                    name="pet.lock"
                    control={control}
                    render={({ field }) => (
                      <PreferenceLockButton value={field.value} onChange={field.onChange} />
                    )}
                  />
                ) : null}
              </div>
              <Controller
                name="pet.value"
                control={control}
                render={({ field }) => (
                  <input
                    type="text"
                    placeholder="მაგ. ძაღლი, კატა"
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
                    className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  />
                )}
              />
              {fieldDescriptions?.pet ? (
                <p className="text-xs text-muted-foreground">{fieldDescriptions.pet}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div
          className={`grid grid-cols-1 gap-4 ${showClientStatusField ? "sm:grid-cols-2" : ""}`}
        >
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              გარიგების ტიპი <span className="text-red-500">*</span>
            </label>
            <select
              {...register("dealType")}
              className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              {dealOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldDescriptions?.dealType ? (
              <p className="text-xs text-muted-foreground">{fieldDescriptions.dealType}</p>
            ) : null}
          </div>

          {showClientStatusField ? (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">სტატუსი</label>
              <select
                {...register("status")}
                className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              >
                {optionalStatusChoice && <option value="">არ არის მითითებული</option>}
                {showDefaultStatusOption && <option value="">ნაგულისხმევი (აქტიური)</option>}
                {statusSelectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldDescriptions?.status ? (
                <p className="text-xs text-muted-foreground">{fieldDescriptions.status}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            აღწერა <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          {errors.description && (
            <p className="text-xs text-destructive" role="alert">
              {errors.description.message}
            </p>
          )}
          {fieldDescriptions?.description ? (
            <p className="text-xs text-muted-foreground">{fieldDescriptions.description}</p>
          ) : null}
        </div>

        {showReminderDateField ? (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">შეხსენების თარიღი</label>
            <input
              type="datetime-local"
              {...register("reminderDate")}
              className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
            {showReminderHint && (
              <p className="text-xs text-muted-foreground">გაასუფთავეთ ეს ველი შეხსენების წასაშლელად.</p>
            )}
            {fieldDescriptions?.reminderDate ? (
              <p className="text-xs text-muted-foreground">{fieldDescriptions.reminderDate}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
