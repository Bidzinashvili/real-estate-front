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

type ClientCoreInfoSectionProps = {
  register: UseFormRegister<ClientFormValues>;
  errors: FieldErrors<ClientFormValues>;
  phoneFields: Array<{ id: string }>;
  appendPhone: (value: string) => void;
  removePhone: (index: number) => void;
  showDefaultStatusOption?: boolean;
  showReminderHint?: boolean;
};

export function ClientCoreInfoSection({
  register,
  errors,
  phoneFields,
  appendPhone,
  removePhone,
  showDefaultStatusOption = false,
  showReminderHint = false,
}: ClientCoreInfoSectionProps) {
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
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">WhatsApp</label>
            <input
              type="tel"
              {...register("whatsapp")}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">Pet</label>
            <input
              type="text"
              {...register("pet")}
              placeholder="e.g. dog, cat"
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">
              Deal type <span className="text-red-500">*</span>
            </label>
            <select
              {...register("dealType")}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            >
              {DEAL_TYPES.map((dealType) => (
                <option key={dealType} value={dealType}>
                  {DEAL_TYPE_LABELS[dealType]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">Status</label>
            <select
              {...register("status")}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            >
              {showDefaultStatusOption && <option value="">Default (Active)</option>}
              {CLIENT_STATUSES.map((clientStatus) => (
                <option key={clientStatus} value={clientStatus}>
                  {CLIENT_STATUS_LABELS[clientStatus]}
                </option>
              ))}
            </select>
          </div>
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
        </div>

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
        </div>
      </div>
    </section>
  );
}
