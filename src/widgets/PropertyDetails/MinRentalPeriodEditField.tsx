"use client";

import type { DealType } from "@/features/properties/dealType";
import {
  FREQUENT_RENTAL_PERIOD_OPTIONS,
  type FrequentRentalPeriodValue,
} from "@/widgets/AddProperty/MinRentalPeriodField";
import { SelectField } from "@/widgets/AddProperty/addPropertyFormFields";
import { EditableNumericTextInput } from "@/widgets/PropertyDetails/PropertyFormControls";
import { parseIntegerInput } from "@/shared/lib/parseNumericInput";

type MinRentalPeriodEditFieldProps = {
  dealType: DealType;
  idPrefix: string;
  months: number | undefined;
  onMonthsChange: (next: number | undefined) => void;
};

function frequentRentalPeriodFromMonths(
  months: number | undefined,
): FrequentRentalPeriodValue {
  if (months === 1) return "1";
  if (months === 3) return "3";
  if (months === 6) return "6";
  if (months === 12) return "12";
  return "";
}

export function MinRentalPeriodEditField({
  dealType,
  idPrefix,
  months,
  onMonthsChange,
}: MinRentalPeriodEditFieldProps) {
  if (dealType !== "RENT" && dealType !== "DAILY_RENT") return null;

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
          id={`${idPrefix}FrequentRentalPeriod`}
          label="ხშირი ვადები"
          value={frequentRentalPeriodFromMonths(months)}
          onChange={(selectedValue) => {
            if (selectedValue === "") {
              return;
            }
            onMonthsChange(Number(selectedValue));
          }}
          options={FREQUENT_RENTAL_PERIOD_OPTIONS}
        />
      </div>
    </div>
  );
}
