"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import {
  RENOVATION_VALUES,
  BUILDING_CONDITIONS,
  KITCHEN_TYPES,
  RENOVATION_LABELS,
  BUILDING_CONDITION_LABELS,
  KITCHEN_TYPE_LABELS,
} from "@/features/clients/clientEnums";
import type { EnumSelectOption } from "@/features/clientInviteLinks/formSchemaHints";
import { PreferenceLockButton } from "@/widgets/ClientForm/PreferenceLockButton";

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const NUMERIC_FIELDS = [
  { name: "minRooms" as const, label: "Min rooms", min: 0 },
  { name: "minBedrooms" as const, label: "Min bedrooms", min: 0 },
  { name: "minBathrooms" as const, label: "Min bathrooms", min: 0 },
  { name: "minFloor" as const, label: "Min floor", min: undefined },
  { name: "maxFloor" as const, label: "Max floor", min: undefined },
  { name: "minArea" as const, label: "Min area (m²)", min: 0 },
];

const BOOLEAN_FIELDS = [
  { name: "excludeLastFloor" as const, label: "Exclude last floor" },
  { name: "hasBalcony" as const, label: "Has balcony" },
  { name: "goodView" as const, label: "Good view" },
  { name: "elevator" as const, label: "Elevator" },
  { name: "centralHeating" as const, label: "Central heating" },
  { name: "airConditioner" as const, label: "Air conditioner" },
  { name: "furnished" as const, label: "Furnished" },
  { name: "parking" as const, label: "Parking" },
];

type ClientRequirementsSectionProps = {
  control: Control<ClientFormValues>;
  errors: FieldErrors<ClientFormValues>;
  isRentDeal: boolean;
  fieldDescriptions?: Record<string, string>;
  renovationSelectOptions?: EnumSelectOption[];
  buildingConditionSelectOptions?: EnumSelectOption[];
  kitchenTypeSelectOptions?: EnumSelectOption[];
  showLockForPath?: (path: string) => boolean;
};

export function ClientRequirementsSection({
  control,
  errors,
  isRentDeal,
  fieldDescriptions,
  renovationSelectOptions,
  buildingConditionSelectOptions,
  kitchenTypeSelectOptions,
  showLockForPath = () => true,
}: ClientRequirementsSectionProps) {
  const renovationOptions =
    renovationSelectOptions ??
    RENOVATION_VALUES.map((value) => ({
      value,
      label: RENOVATION_LABELS[value],
    }));
  const buildingOptions =
    buildingConditionSelectOptions ??
    BUILDING_CONDITIONS.map((value) => ({
      value,
      label: BUILDING_CONDITION_LABELS[value],
    }));
  const kitchenOptions =
    kitchenTypeSelectOptions ??
    KITCHEN_TYPES.map((value) => ({
      value,
      label: KITCHEN_TYPE_LABELS[value],
    }));

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-base font-semibold text-slate-800">Requirements</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {NUMERIC_FIELDS.map(({ name, label, min }) => (
            <div key={name} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <label className="block flex-1 text-sm font-medium text-slate-800">{label}</label>
                {showLockForPath(name) ? (
                  <Controller
                    name={`${name}.lock`}
                    control={control}
                    render={({ field }) => (
                      <PreferenceLockButton value={field.value} onChange={field.onChange} />
                    )}
                  />
                ) : null}
              </div>
              <Controller
                name={`${name}.value`}
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    min={min}
                    value={field.value === undefined ? "" : field.value}
                    onChange={(event) => {
                      const raw = event.target.value;
                      field.onChange(raw === "" ? undefined : Number(raw));
                    }}
                    className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                )}
              />
              {name === "minFloor" && errors.minFloor?.value && (
                <p className="text-xs text-red-600" role="alert">
                  {errors.minFloor.value.message}
                </p>
              )}
              {fieldDescriptions?.[name] ? (
                <p className="text-xs text-slate-500">{fieldDescriptions[name]}</p>
              ) : null}
            </div>
          ))}
        </div>

        {isRentDeal && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="block flex-1 text-sm font-medium text-slate-800">
                Min rental period (months)
              </label>
              {showLockForPath("minRentalPeriod") ? (
                <Controller
                  name="minRentalPeriod.lock"
                  control={control}
                  render={({ field }) => (
                    <PreferenceLockButton value={field.value} onChange={field.onChange} />
                  )}
                />
              ) : null}
            </div>
            <Controller
              name="minRentalPeriod.value"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  min={1}
                  value={field.value === undefined ? "" : field.value}
                  onChange={(event) => {
                    const raw = event.target.value;
                    field.onChange(raw === "" ? undefined : Number(raw));
                  }}
                  className="block w-48 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              )}
            />
            {errors.minRentalPeriod?.value && (
              <p className="text-xs text-red-600" role="alert">
                {errors.minRentalPeriod.value.message}
              </p>
            )}
            {fieldDescriptions?.minRentalPeriod ? (
              <p className="text-xs text-slate-500">{fieldDescriptions.minRentalPeriod}</p>
            ) : null}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="block flex-1 text-sm font-medium text-slate-800">Renovation</label>
              {showLockForPath("renovation") ? (
                <Controller
                  name="renovation.lock"
                  control={control}
                  render={({ field }) => (
                    <PreferenceLockButton value={field.value} onChange={field.onChange} />
                  )}
                />
              ) : null}
            </div>
            <Controller
              name="renovation.value"
              control={control}
              render={({ field }) => (
                <select
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                >
                  <option value="">Any</option>
                  {renovationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {fieldDescriptions?.renovation ? (
              <p className="text-xs text-slate-500">{fieldDescriptions.renovation}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="block flex-1 text-sm font-medium text-slate-800">
                Building condition
              </label>
              {showLockForPath("buildingCondition") ? (
                <Controller
                  name="buildingCondition.lock"
                  control={control}
                  render={({ field }) => (
                    <PreferenceLockButton value={field.value} onChange={field.onChange} />
                  )}
                />
              ) : null}
            </div>
            <Controller
              name="buildingCondition.value"
              control={control}
              render={({ field }) => (
                <select
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                >
                  <option value="">Any</option>
                  {buildingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {fieldDescriptions?.buildingCondition ? (
              <p className="text-xs text-slate-500">{fieldDescriptions.buildingCondition}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="block flex-1 text-sm font-medium text-slate-800">Kitchen type</label>
              {showLockForPath("kitchenType") ? (
                <Controller
                  name="kitchenType.lock"
                  control={control}
                  render={({ field }) => (
                    <PreferenceLockButton value={field.value} onChange={field.onChange} />
                  )}
                />
              ) : null}
            </div>
            <Controller
              name="kitchenType.value"
              control={control}
              render={({ field }) => (
                <select
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                >
                  <option value="">Any</option>
                  {kitchenOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {fieldDescriptions?.kitchenType ? (
              <p className="text-xs text-slate-500">{fieldDescriptions.kitchenType}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <label className="block flex-1 text-sm font-medium text-slate-800">
              Projects to exclude (one per line)
            </label>
            {showLockForPath("projectExclude") ? (
              <Controller
                name="projectExclude.lock"
                control={control}
                render={({ field }) => (
                  <PreferenceLockButton value={field.value} onChange={field.onChange} />
                )}
              />
            ) : null}
          </div>
          <Controller
            name="projectExclude.value"
            control={control}
            render={({ field }) => (
              <textarea
                rows={2}
                value={field.value.join("\n")}
                onChange={(event) => field.onChange(splitLines(event.target.value))}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
              />
            )}
          />
          {fieldDescriptions?.projectExclude ? (
            <p className="text-xs text-slate-500">{fieldDescriptions.projectExclude}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
          {BOOLEAN_FIELDS.map(({ name, label }) => (
            <div key={name} className="space-y-1">
              <div className="flex items-center gap-2">
                <label className="flex flex-1 cursor-pointer items-center gap-2">
                  <Controller
                    name={`${name}.value`}
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value === true}
                        onChange={(event) => field.onChange(event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900"
                      />
                    )}
                  />
                  <span className="text-sm text-slate-700">{label}</span>
                </label>
                {showLockForPath(name) ? (
                  <Controller
                    name={`${name}.lock`}
                    control={control}
                    render={({ field }) => (
                      <PreferenceLockButton value={field.value} onChange={field.onChange} />
                    )}
                  />
                ) : null}
              </div>
              {fieldDescriptions?.[name] ? (
                <p className="text-xs text-slate-500">{fieldDescriptions[name]}</p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="block flex-1 text-sm font-medium text-slate-800">
                Balcony min (m²)
              </label>
              {showLockForPath("balconyAreaMin") ? (
                <Controller
                  name="balconyAreaMin.lock"
                  control={control}
                  render={({ field }) => (
                    <PreferenceLockButton value={field.value} onChange={field.onChange} />
                  )}
                />
              ) : null}
            </div>
            <Controller
              name="balconyAreaMin.value"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  value={field.value === undefined ? "" : field.value}
                  onChange={(event) => {
                    const raw = event.target.value;
                    field.onChange(raw === "" ? undefined : Number(raw));
                  }}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              )}
            />
            {errors.balconyAreaMin?.value && (
              <p className="text-xs text-red-600" role="alert">
                {errors.balconyAreaMin.value.message}
              </p>
            )}
            {fieldDescriptions?.balconyAreaMin ? (
              <p className="text-xs text-slate-500">{fieldDescriptions.balconyAreaMin}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="block flex-1 text-sm font-medium text-slate-800">
                Balcony max (m²)
              </label>
              {showLockForPath("balconyAreaMax") ? (
                <Controller
                  name="balconyAreaMax.lock"
                  control={control}
                  render={({ field }) => (
                    <PreferenceLockButton value={field.value} onChange={field.onChange} />
                  )}
                />
              ) : null}
            </div>
            <Controller
              name="balconyAreaMax.value"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  value={field.value === undefined ? "" : field.value}
                  onChange={(event) => {
                    const raw = event.target.value;
                    field.onChange(raw === "" ? undefined : Number(raw));
                  }}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              )}
            />
            {fieldDescriptions?.balconyAreaMax ? (
              <p className="text-xs text-slate-500">{fieldDescriptions.balconyAreaMax}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
