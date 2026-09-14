"use client";

import { useState } from "react";
import { SelectField, TextField } from "@/widgets/AddProperty/addPropertyFormFields";

export type FrequentRentalPeriodValue = "" | "1" | "3" | "6" | "12";

export const FREQUENT_RENTAL_PERIOD_OPTIONS: ReadonlyArray<{
  value: FrequentRentalPeriodValue;
  label: string;
}> = [
  { value: "", label: "სწრაფი არჩევა (თვეები)" },
  { value: "1", label: "1 თვე" },
  { value: "3", label: "3 თვე" },
  { value: "6", label: "6 თვე" },
  { value: "12", label: "12 თვე" },
];

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
  const [frequentRentalPeriod, setFrequentRentalPeriod] =
    useState<FrequentRentalPeriodValue>("");

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
          id={`${idPrefix}FrequentRentalPeriod`}
          label="ხშირი ვადები"
          value={frequentRentalPeriod}
          onChange={setFrequentRentalPeriod}
          options={FREQUENT_RENTAL_PERIOD_OPTIONS}
        />
      </div>
    </div>
  );
}
