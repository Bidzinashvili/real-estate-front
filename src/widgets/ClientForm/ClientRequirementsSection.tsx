"use client";

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
} from "react-hook-form";
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
import { ClientPreferenceValueControl } from "@/widgets/ClientForm/ClientPreferenceValueControl";
import { PreferenceLockButton } from "@/widgets/ClientForm/PreferenceLockButton";

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const RANGE_FIELDS = [
  { label: "ოთახები", minName: "minRooms" as const, maxName: "maxRooms" as const, min: 0 },
  { label: "საძინებლები", minName: "minBedrooms" as const, maxName: "maxBedrooms" as const, min: 0 },
  { label: "სველი წერტილები", minName: "minBathrooms" as const, maxName: "maxBathrooms" as const, min: 0 },
  { label: "სართული", minName: "minFloor" as const, maxName: "maxFloor" as const, min: undefined },
  { label: "ფართობი (მ²)", minName: "minArea" as const, maxName: "maxArea" as const, min: 0 },
  {
    label: "აივნის ფართობი (მ²)",
    minName: "balconyAreaMin" as const,
    maxName: "balconyAreaMax" as const,
    min: 0,
  },
] as const;

const BOOLEAN_FIELDS = [{ name: "excludeLastFloor" as const, label: "ბოლო სართულის გამოკლებით" }];

const PREFERENCE_FIELDS = [
  { name: "hasBalcony" as const, label: "აივანი" },
  { name: "goodView" as const, label: "კარგი ხედი" },
  { name: "elevator" as const, label: "ლიფტი" },
  { name: "centralHeating" as const, label: "ცენტრალური გათბობა" },
  { name: "airConditioner" as const, label: "კონდიციონერი" },
  { name: "furnished" as const, label: "ავეჯით" },
  { name: "parking" as const, label: "პარკინგი" },
] as const;

type ClientRequirementsSectionProps = {
  control: Control<ClientFormValues>;
  errors: FieldErrors<ClientFormValues>;
  setValue?: UseFormSetValue<ClientFormValues>;
  isRentDeal: boolean;
  fieldDescriptions?: Record<string, string>;
  renovationSelectOptions?: EnumSelectOption[];
  buildingConditionSelectOptions?: EnumSelectOption[];
  kitchenTypeSelectOptions?: EnumSelectOption[];
  showLockForPath?: (path: string) => boolean;
};

type RangeFieldName =
  | (typeof RANGE_FIELDS)[number]["minName"]
  | (typeof RANGE_FIELDS)[number]["maxName"];

type RangeFieldError = {
  value?: {
    message?: string;
  };
};

function readRangeError(
  errors: FieldErrors<ClientFormValues>,
  fieldName: RangeFieldName,
): string | undefined {
  const typedErrors = errors as Partial<Record<RangeFieldName, RangeFieldError>>;
  return typedErrors[fieldName]?.value?.message;
}

type RangeFieldConfig = (typeof RANGE_FIELDS)[number];

function RequirementRangeRow({
  config,
  control,
  errors,
  fieldDescriptions,
  showLockForPath,
}: {
  config: RangeFieldConfig;
  control: Control<ClientFormValues>;
  errors: FieldErrors<ClientFormValues>;
  setValue?: UseFormSetValue<ClientFormValues>;
  fieldDescriptions?: Record<string, string>;
  showLockForPath: (path: string) => boolean;
}) {
  const minErrorMessage = readRangeError(errors, config.minName);
  const maxErrorMessage = readRangeError(errors, config.maxName);
  const fieldDescription = fieldDescriptions?.[config.minName] ?? fieldDescriptions?.[config.maxName];
  const shouldShowMinLock = showLockForPath(config.minName);
  const shouldShowMaxLock = showLockForPath(config.maxName);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{config.label}</label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex-1 text-xs font-medium text-muted-foreground">დან</span>
            {shouldShowMinLock ? (
              <Controller
                name={`${config.minName}.lock`}
                control={control}
                render={({ field }) => (
                  <PreferenceLockButton value={field.value} onChange={field.onChange} />
                )}
              />
            ) : null}
          </div>
          <Controller
            name={`${config.minName}.value`}
            control={control}
            render={({ field }) => (
              <input
                type="number"
                min={config.min}
                value={field.value === undefined ? "" : field.value}
                onChange={(event) => {
                  const rawValue = event.target.value;
                  field.onChange(rawValue === "" ? undefined : Number(rawValue));
                }}
                className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            )}
          />
        </div>
        <div className="flex items-end justify-center pb-2 text-muted-foreground">–</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex-1 text-xs font-medium text-muted-foreground">მდე</span>
            {shouldShowMaxLock ? (
              <Controller
                name={`${config.maxName}.lock`}
                control={control}
                render={({ field }) => (
                  <PreferenceLockButton value={field.value} onChange={field.onChange} />
                )}
              />
            ) : null}
          </div>
          <Controller
            name={`${config.maxName}.value`}
            control={control}
            render={({ field }) => (
              <input
                type="number"
                min={config.min}
                value={field.value === undefined ? "" : field.value}
                onChange={(event) => {
                  const rawValue = event.target.value;
                  field.onChange(rawValue === "" ? undefined : Number(rawValue));
                }}
                className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            )}
          />
        </div>
      </div>
      {minErrorMessage ? (
        <p className="text-xs text-destructive" role="alert">
          {minErrorMessage}
        </p>
      ) : null}
      {maxErrorMessage ? (
        <p className="text-xs text-destructive" role="alert">
          {maxErrorMessage}
        </p>
      ) : null}
      {fieldDescription ? <p className="text-xs text-muted-foreground">{fieldDescription}</p> : null}
    </div>
  );
}

export function ClientRequirementsSection({
  control,
  errors,
  setValue,
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
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h2 className="mb-4 text-base font-semibold text-foreground">მოთხოვნები</h2>
      <div className="space-y-4">
        <div className="space-y-4">
          {RANGE_FIELDS.map((config) => (
            <RequirementRangeRow
              key={config.minName}
              config={config}
              control={control}
              errors={errors}
              setValue={setValue}
              fieldDescriptions={fieldDescriptions}
              showLockForPath={showLockForPath}
            />
          ))}
        </div>

        {isRentDeal && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="block flex-1 text-sm font-medium text-foreground">
                მინიმალური ქირის ვადა (თვე)
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
                  className="block w-48 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              )}
            />
            {errors.minRentalPeriod?.value && (
              <p className="text-xs text-destructive" role="alert">
                {errors.minRentalPeriod.value.message}
              </p>
            )}
            {fieldDescriptions?.minRentalPeriod ? (
              <p className="text-xs text-muted-foreground">{fieldDescriptions.minRentalPeriod}</p>
            ) : null}
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="block flex-1 text-sm font-medium text-foreground">რემონტი</label>
            {showLockForPath("renovations") || showLockForPath("renovation") ? (
              <Controller
                name="renovations.lock"
                control={control}
                render={({ field }) => (
                  <PreferenceLockButton value={field.value} onChange={field.onChange} />
                )}
              />
            ) : null}
          </div>
          <Controller
            name="renovations.value"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {renovationOptions.map((option) => {
                  const isChecked = field.value.includes(
                    option.value as (typeof RENOVATION_VALUES)[number],
                  );
                  return (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(event) => {
                          const optionValue = option.value as (typeof RENOVATION_VALUES)[number];
                          if (event.target.checked) {
                            field.onChange([...field.value, optionValue]);
                            return;
                          }
                          field.onChange(
                            field.value.filter((currentValue) => currentValue !== optionValue),
                          );
                        }}
                        className="h-4 w-4 rounded border-border text-foreground"
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          />
          {fieldDescriptions?.renovations || fieldDescriptions?.renovation ? (
            <p className="text-xs text-muted-foreground">
              {fieldDescriptions?.renovations ?? fieldDescriptions?.renovation}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="block flex-1 text-sm font-medium text-foreground">
                შენობის მდგომარეობა
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
                  className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="">ნებისმიერი</option>
                  {buildingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {fieldDescriptions?.buildingCondition ? (
              <p className="text-xs text-muted-foreground">{fieldDescriptions.buildingCondition}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="block flex-1 text-sm font-medium text-foreground">სამზარეულოს ტიპი</label>
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
                  className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="">ნებისმიერი</option>
                  {kitchenOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {fieldDescriptions?.kitchenType ? (
              <p className="text-xs text-muted-foreground">{fieldDescriptions.kitchenType}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <label className="block flex-1 text-sm font-medium text-foreground">
              გამოსარიცხი პროექტები (თითო სტრიქონზე ერთი)
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
                className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            )}
          />
          {fieldDescriptions?.projectExclude ? (
            <p className="text-xs text-muted-foreground">{fieldDescriptions.projectExclude}</p>
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
                        className="h-4 w-4 rounded border-border text-foreground"
                      />
                    )}
                  />
                  <span className="text-sm text-foreground">{label}</span>
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
                <p className="text-xs text-muted-foreground">{fieldDescriptions[name]}</p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PREFERENCE_FIELDS.map(({ name, label }) => (
            <div key={name} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <label className="block flex-1 text-sm font-medium text-foreground">{label}</label>
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
                  <ClientPreferenceValueControl
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {fieldDescriptions?.[name] ? (
                <p className="text-xs text-muted-foreground">{fieldDescriptions[name]}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
