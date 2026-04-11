"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import {
  DEAL_TYPES,
  CLIENT_STATUSES,
  DEAL_TYPE_LABELS,
  CLIENT_STATUS_LABELS,
} from "@/features/clients/clientEnums";
import type { EnumSelectOption } from "@/features/clientInviteLinks/formSchemaHints";

type ClientCoreInfoSectionProps = {
  register: UseFormRegister<ClientFormValues>;
  errors: FieldErrors<ClientFormValues>;
  phoneFields: Array<{ id: string }>;
  appendPhone: (value: string) => void;
  removePhone: (index: number) => void;
  showDefaultStatusOption?: boolean;
  optionalStatusChoice?: boolean;
  showClientStatusField?: boolean;
  showReminderDateField?: boolean;
  showReminderHint?: boolean;
  fieldDescriptions?: Record<string, string>;
  dealTypeSelectOptions?: EnumSelectOption[];
  clientStatusSelectOptions?: EnumSelectOption[];
};

export function ClientCoreInfoSection({
  register,
  errors,
  phoneFields,
  appendPhone,
  removePhone,
  showDefaultStatusOption = false,
  optionalStatusChoice = false,
  showClientStatusField = true,
  showReminderDateField = true,
  showReminderHint = false,
  fieldDescriptions,
  dealTypeSelectOptions,
  clientStatusSelectOptions,
}: ClientCoreInfoSectionProps) {
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

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-base font-semibold text-slate-800">Core info</h2>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-800">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("name")}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
          />
          {errors.name && (
            <p className="text-xs text-red-600" role="alert">
              {errors.name.message}
            </p>
          )}
          {fieldDescriptions?.name ? (
            <p className="text-xs text-slate-500">{fieldDescriptions.name}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-800">
            Phones <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {phoneFields.map((field, phoneIndex) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  type="tel"
                  {...register(`phones.${phoneIndex}`)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
                />
                {phoneFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhone(phoneIndex)}
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
              onClick={() => appendPhone("")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition hover:text-slate-900"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add phone
            </button>
          </div>
          {errors.phones && (
            <p className="text-xs text-red-600" role="alert">
              {errors.phones.message ?? errors.phones.root?.message}
            </p>
          )}
          {fieldDescriptions?.phones ? (
            <p className="text-xs text-slate-500">{fieldDescriptions.phones}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">WhatsApp</label>
            <input
              type="tel"
              {...register("whatsapp")}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
            />
            {fieldDescriptions?.whatsapp ? (
              <p className="text-xs text-slate-500">{fieldDescriptions.whatsapp}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">Pet</label>
            <input
              type="text"
              {...register("pet")}
              placeholder="e.g. dog, cat"
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
            />
            {fieldDescriptions?.pet ? (
              <p className="text-xs text-slate-500">{fieldDescriptions.pet}</p>
            ) : null}
          </div>
        </div>

        <div
          className={`grid grid-cols-1 gap-4 ${showClientStatusField ? "sm:grid-cols-2" : ""}`}
        >
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">
              Deal type <span className="text-red-500">*</span>
            </label>
            <select
              {...register("dealType")}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            >
              {dealOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldDescriptions?.dealType ? (
              <p className="text-xs text-slate-500">{fieldDescriptions.dealType}</p>
            ) : null}
          </div>

          {showClientStatusField ? (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-800">Status</label>
              <select
                {...register("status")}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              >
                {optionalStatusChoice && <option value="">Not specified</option>}
                {showDefaultStatusOption && <option value="">Default (Active)</option>}
                {statusSelectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldDescriptions?.status ? (
                <p className="text-xs text-slate-500">{fieldDescriptions.status}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-800">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
          />
          {errors.description && (
            <p className="text-xs text-red-600" role="alert">
              {errors.description.message}
            </p>
          )}
          {fieldDescriptions?.description ? (
            <p className="text-xs text-slate-500">{fieldDescriptions.description}</p>
          ) : null}
        </div>

        {showReminderDateField ? (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">Reminder date</label>
            <input
              type="datetime-local"
              {...register("reminderDate")}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
            {showReminderHint && (
              <p className="text-xs text-slate-500">Clear this field to remove the reminder.</p>
            )}
            {fieldDescriptions?.reminderDate ? (
              <p className="text-xs text-slate-500">{fieldDescriptions.reminderDate}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
