"use client";

import type { DealType } from "@/features/properties/dealType";
import { SelectField } from "@/widgets/AddProperty/addPropertyFormFields";
import { EditableNumericTextInput } from "@/widgets/PropertyDetails/PropertyFormControls";
import { parseIntegerInput } from "@/shared/lib/parseNumericInput";

function presetValueFromMonths(
  months: number | undefined,
): "" | "1" | "3" | "6" | "12" {
  if (months === 1 || months === 3 || months === 6 || months === 12) {
    return String(months) as "1" | "3" | "6" | "12";
  }
  return "";
}

type MinRentalPeriodEditFieldProps = {
  dealType: DealType;
  idPrefix: string;
  months: number | undefined;
  onMonthsChange: (next: number | undefined) => void;
};

export function MinRentalPeriodEditField({
  dealType,
  idPrefix,
  months,
  onMonthsChange,
}: MinRentalPeriodEditFieldProps) {
  if (dealType !== "RENT") return null;

  const presetOptions = [
    { value: "" as const, label: "Quick select (months)" },
    { value: "1" as const, label: "1 month" },
    { value: "3" as const, label: "3 months" },
    { value: "6" as const, label: "6 months" },
    { value: "12" as const, label: "12 months" },
  ];

  return (
    <div className="space-y-3 sm:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2">
        <EditableNumericTextInput
          label="Min Rental Period (months)"
          value={months}
          onValueChange={onMonthsChange}
          parse={parseIntegerInput}
          inputMode="numeric"
          placeholder="Enter minimum rental period in months"
        />
        <SelectField
          id={`${idPrefix}MinRentalPreset`}
          label="Common lengths"
          value={presetValueFromMonths(months)}
          onChange={(preset) => {
            if (preset !== "") {
              onMonthsChange(Number.parseInt(preset, 10));
            }
          }}
          options={presetOptions}
        />
      </div>
    </div>
  );
}
