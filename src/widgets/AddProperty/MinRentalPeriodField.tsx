"use client";

import { SelectField, TextField } from "@/widgets/AddProperty/addPropertyFormFields";

function presetSelectValueFromMonthsString(value: string): "" | "1" | "3" | "6" | "12" {
  const trimmed = value.trim();
  if (trimmed === "1" || trimmed === "3" || trimmed === "6" || trimmed === "12") {
    return trimmed;
  }
  return "";
}

type MinRentalPeriodFieldProps = {
  idPrefix: string;
  value: string;
  onChange: (next: string) => void;
  error?: string;
};

export function MinRentalPeriodField({
  idPrefix,
  value,
  onChange,
  error,
}: MinRentalPeriodFieldProps) {
  const presetOptions = [
    { value: "" as const, label: "სწრაფი არჩევა (თვეები)" },
    { value: "1" as const, label: "1 თვე" },
    { value: "3" as const, label: "3 თვე" },
    { value: "6" as const, label: "6 თვე" },
    { value: "12" as const, label: "12 თვე" },
  ];

  return (
    <div className="space-y-3 sm:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id={`${idPrefix}MinRentalMonths`}
          label="მინიმალური ქირის ვადა (თვე)"
          name="minRentalPeriod"
          type="number"
          placeholder="შეიყვანეთ მინიმალური ქირის ვადა თვეებში"
          value={value}
          onChange={onChange}
          error={error}
        />
        <SelectField
          id={`${idPrefix}MinRentalPreset`}
          label="ხშირი ვადები"
          value={presetSelectValueFromMonthsString(value)}
          onChange={(preset) => {
            if (preset !== "") onChange(preset);
          }}
          options={presetOptions}
        />
      </div>
    </div>
  );
}
