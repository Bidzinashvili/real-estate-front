"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import {
  RENOVATION_VALUES,
  BUILDING_CONDITIONS,
  KITCHEN_TYPES,
  RENOVATION_LABELS,
  BUILDING_CONDITION_LABELS,
  KITCHEN_TYPE_LABELS,
} from "@/features/clients/clientEnums";

const NUMERIC_FIELDS = [
  { name: "minRooms", label: "Min rooms", min: 0 },
  { name: "minBedrooms", label: "Min bedrooms", min: 0 },
  { name: "minBathrooms", label: "Min bathrooms", min: 0 },
  { name: "minFloor", label: "Min floor", min: undefined },
  { name: "maxFloor", label: "Max floor", min: undefined },
  { name: "minArea", label: "Min area (m²)", min: 0 },
] as const;

const BOOLEAN_FIELDS = [
  { name: "excludeLastFloor", label: "Exclude last floor" },
  { name: "hasBalcony", label: "Has balcony" },
  { name: "goodView", label: "Good view" },
  { name: "elevator", label: "Elevator" },
  { name: "centralHeating", label: "Central heating" },
  { name: "airConditioner", label: "Air conditioner" },
  { name: "furnished", label: "Furnished" },
  { name: "parking", label: "Parking" },
] as const;

type ClientRequirementsSectionProps = {
  register: UseFormRegister<ClientFormValues>;
  errors: FieldErrors<ClientFormValues>;
  isRentDeal: boolean;
};

export function ClientRequirementsSection({
  register,
  errors,
  isRentDeal,
}: ClientRequirementsSectionProps) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-base font-semibold text-slate-800">Requirements</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {NUMERIC_FIELDS.map(({ name, label, min }) => (
            <div key={name} className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-800">{label}</label>
              <input
                type="number"
                min={min}
                {...register(name, { valueAsNumber: true })}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              />
              {name === "minFloor" && errors.minFloor && (
                <p className="text-xs text-red-600" role="alert">
                  {errors.minFloor.message}
                </p>
              )}
            </div>
          ))}
        </div>

        {isRentDeal && (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">
              Min rental period (months)
            </label>
            <input
              type="number"
              min={1}
              {...register("minRentalPeriod", { valueAsNumber: true })}
              className="block w-48 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
            {errors.minRentalPeriod && (
              <p className="text-xs text-red-600" role="alert">
                {errors.minRentalPeriod.message}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">Renovation</label>
            <select
              {...register("renovation")}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            >
              <option value="">Any</option>
              {RENOVATION_VALUES.map((renovation) => (
                <option key={renovation} value={renovation}>
                  {RENOVATION_LABELS[renovation]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">Building condition</label>
            <select
              {...register("buildingCondition")}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            >
              <option value="">Any</option>
              {BUILDING_CONDITIONS.map((condition) => (
                <option key={condition} value={condition}>
                  {BUILDING_CONDITION_LABELS[condition]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">Kitchen type</label>
            <select
              {...register("kitchenType")}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            >
              <option value="">Any</option>
              {KITCHEN_TYPES.map((kitchenType) => (
                <option key={kitchenType} value={kitchenType}>
                  {KITCHEN_TYPE_LABELS[kitchenType]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
          {BOOLEAN_FIELDS.map(({ name, label }) => (
            <label key={name} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                {...register(name)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900"
              />
              <span className="text-sm text-slate-700">{label}</span>
            </label>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">Balcony min (m²)</label>
            <input
              type="number"
              min={0}
              step="0.1"
              {...register("balconyAreaMin", { valueAsNumber: true })}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
            {errors.balconyAreaMin && (
              <p className="text-xs text-red-600" role="alert">
                {errors.balconyAreaMin.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">Balcony max (m²)</label>
            <input
              type="number"
              min={0}
              step="0.1"
              {...register("balconyAreaMax", { valueAsNumber: true })}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
