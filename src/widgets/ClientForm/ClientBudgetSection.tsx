"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import { PreferenceLockButton } from "@/widgets/ClientForm/PreferenceLockButton";

type ClientBudgetSectionProps = {
  control: Control<ClientFormValues>;
  errors: FieldErrors<ClientFormValues>;
  fieldDescriptions?: Record<string, string>;
  showLockForPath?: (path: string) => boolean;
};

export function ClientBudgetSection({
  control,
  errors,
  fieldDescriptions,
  showLockForPath = () => true,
}: ClientBudgetSectionProps) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-base font-semibold text-slate-800">Budget</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="block flex-1 text-sm font-medium text-slate-800">Min</label>
            {showLockForPath("budgetMin") ? (
              <Controller
                name="budgetMin.lock"
                control={control}
                render={({ field }) => (
                  <PreferenceLockButton value={field.value} onChange={field.onChange} />
                )}
              />
            ) : null}
          </div>
          <Controller
            name="budgetMin.value"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                value={field.value === undefined ? "" : field.value}
                onChange={(event) => {
                  const raw = event.target.value;
                  field.onChange(raw === "" ? undefined : Number(raw));
                }}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
              />
            )}
          />
          {errors.budgetMin?.value && (
            <p className="text-xs text-red-600" role="alert">
              {errors.budgetMin.value.message}
            </p>
          )}
          {errors.budgetMin?.root && (
            <p className="text-xs text-red-600" role="alert">
              {errors.budgetMin.root.message}
            </p>
          )}
          {fieldDescriptions?.budgetMin ? (
            <p className="text-xs text-slate-500">{fieldDescriptions.budgetMin}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="block flex-1 text-sm font-medium text-slate-800">Max</label>
            {showLockForPath("budgetMax") ? (
              <Controller
                name="budgetMax.lock"
                control={control}
                render={({ field }) => (
                  <PreferenceLockButton value={field.value} onChange={field.onChange} />
                )}
              />
            ) : null}
          </div>
          <Controller
            name="budgetMax.value"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                value={field.value === undefined ? "" : field.value}
                onChange={(event) => {
                  const raw = event.target.value;
                  field.onChange(raw === "" ? undefined : Number(raw));
                }}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
              />
            )}
          />
          {fieldDescriptions?.budgetMax ? (
            <p className="text-xs text-slate-500">{fieldDescriptions.budgetMax}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
