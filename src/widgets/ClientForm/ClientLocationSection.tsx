"use client";

import { Controller, type Control } from "react-hook-form";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import { PreferenceLockButton } from "@/widgets/ClientForm/PreferenceLockButton";

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

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
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-base font-semibold text-slate-800">Location</h2>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <label className="block flex-1 text-sm font-medium text-slate-800">
              Districts (one per line)
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
            name="districts.value"
            control={control}
            render={({ field }) => (
              <textarea
                rows={3}
                placeholder={"e.g. Vake\nSaburtalo"}
                value={field.value.join("\n")}
                onChange={(event) => {
                  field.onChange(splitLines(event.target.value));
                }}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
              />
            )}
          />
          <p className="text-xs text-slate-500">Enter each district on a new line.</p>
          {fieldDescriptions?.districts ? (
            <p className="text-xs text-slate-500">{fieldDescriptions.districts}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <label className="block flex-1 text-sm font-medium text-slate-800">
              Addresses (one per line)
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
            name="addresses.value"
            control={control}
            render={({ field }) => (
              <textarea
                rows={3}
                value={field.value.join("\n")}
                onChange={(event) => {
                  field.onChange(splitLines(event.target.value));
                }}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
              />
            )}
          />
          {fieldDescriptions?.addresses ? (
            <p className="text-xs text-slate-500">{fieldDescriptions.addresses}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
