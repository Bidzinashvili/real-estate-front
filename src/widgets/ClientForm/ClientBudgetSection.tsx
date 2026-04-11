"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";

type ClientBudgetSectionProps = {
  register: UseFormRegister<ClientFormValues>;
  errors: FieldErrors<ClientFormValues>;
  fieldDescriptions?: Record<string, string>;
};

export function ClientBudgetSection({ register, errors, fieldDescriptions }: ClientBudgetSectionProps) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-base font-semibold text-slate-800">Budget</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-800">Min</label>
          <input
            type="number"
            {...register("budgetMin", { valueAsNumber: true })}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
          />
          {errors.budgetMin && (
            <p className="text-xs text-red-600" role="alert">
              {errors.budgetMin.message}
            </p>
          )}
          {fieldDescriptions?.budgetMin ? (
            <p className="text-xs text-slate-500">{fieldDescriptions.budgetMin}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-800">Max</label>
          <input
            type="number"
            {...register("budgetMax", { valueAsNumber: true })}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
          />
          {fieldDescriptions?.budgetMax ? (
            <p className="text-xs text-slate-500">{fieldDescriptions.budgetMax}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
