"use client";

import type { UseFormRegister } from "react-hook-form";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

type ClientLocationSectionProps = {
  register: UseFormRegister<ClientFormValues>;
  defaultDistrictsText?: string;
  defaultAddressesText?: string;
  fieldDescriptions?: Record<string, string>;
};

export function ClientLocationSection({
  register,
  defaultDistrictsText,
  defaultAddressesText,
  fieldDescriptions,
}: ClientLocationSectionProps) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-base font-semibold text-slate-800">Location</h2>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-800">
            Districts (one per line)
          </label>
          <textarea
            rows={3}
            placeholder={"e.g. Vake\nSaburtalo"}
            {...register("districts", {
              setValueAs: (value: string) =>
                typeof value === "string" ? splitLines(value) : value,
            })}
            defaultValue={defaultDistrictsText}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
          />
          <p className="text-xs text-slate-500">Enter each district on a new line.</p>
          {fieldDescriptions?.districts ? (
            <p className="text-xs text-slate-500">{fieldDescriptions.districts}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-800">
            Addresses (one per line)
          </label>
          <textarea
            rows={3}
            {...register("addresses", {
              setValueAs: (value: string) =>
                typeof value === "string" ? splitLines(value) : value,
            })}
            defaultValue={defaultAddressesText}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
          />
          {fieldDescriptions?.addresses ? (
            <p className="text-xs text-slate-500">{fieldDescriptions.addresses}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
