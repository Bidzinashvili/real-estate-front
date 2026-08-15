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
  if (dealType !== "RENT" && dealType !== "DAILY_RENT") return null;

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
        <EditableNumericTextInput
          label="მინიმალური ქირის ვადა (თვე)"
          value={months}
          onValueChange={onMonthsChange}
          parse={parseIntegerInput}
          inputMode="numeric"
          placeholder="შეიყვანეთ მინიმალური ქირის ვადა თვეებში"
        />
        <SelectField
          id={`${idPrefix}MinRentalPreset`}
          label="ხშირი ვადები"
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
