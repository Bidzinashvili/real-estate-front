"use client";

import { useRef } from "react";
import { addPropertyInputClassName } from "@/widgets/AddProperty/addPropertyFormFields";
import { sanitizeTwoDigitNumericInput } from "@/shared/lib/twoDigitNumericInput";

type FloorInputProps = {
  floorId: string;
  totalFloorsId: string;
  floorLabel?: string;
  totalFloorsLabel?: string;
  floorValue: string;
  totalFloorsValue: string;
  onFloorChange: (nextValue: string) => void;
  onTotalFloorsChange: (nextValue: string) => void;
  floorError?: string;
  totalFloorsError?: string;
  required?: boolean;
};

export function FloorInput({
  floorId,
  totalFloorsId,
  floorLabel = "სართული",
  totalFloorsLabel = "სართულიანობა",
  floorValue,
  totalFloorsValue,
  onFloorChange,
  onTotalFloorsChange,
  floorError,
  totalFloorsError,
  required,
}: FloorInputProps) {
  const totalFloorsInputRef = useRef<HTMLInputElement | null>(null);

  function handleFloorChange(value: string) {
    const nextValue = sanitizeTwoDigitNumericInput(value);
    onFloorChange(nextValue);
    if (nextValue.length === 2) {
      totalFloorsInputRef.current?.focus();
    }
  }

  function handleTotalFloorsChange(value: string) {
    onTotalFloorsChange(sanitizeTwoDigitNumericInput(value));
  }

  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <label htmlFor={floorId} className="block text-sm font-medium text-foreground">
            {floorLabel}
          </label>
          <input
            id={floorId}
            type="text"
            inputMode="numeric"
            pattern="\d{1,2}"
            maxLength={2}
            value={floorValue}
            required={required}
            onChange={(event) => handleFloorChange(event.target.value)}
            className={`${addPropertyInputClassName()} ${floorError ? "border-destructive focus:border-destructive" : ""}`}
          />
        </div>
        <div className="w-20 space-y-1.5">
          <label
            htmlFor={totalFloorsId}
            className="block text-sm font-medium text-foreground"
          >
            {totalFloorsLabel}
          </label>
          <input
            ref={totalFloorsInputRef}
            id={totalFloorsId}
            type="text"
            inputMode="numeric"
            pattern="\d{1,2}"
            maxLength={2}
            value={totalFloorsValue}
            required={required}
            onChange={(event) => handleTotalFloorsChange(event.target.value)}
            className={`${addPropertyInputClassName()} ${totalFloorsError ? "border-destructive focus:border-destructive" : ""}`}
          />
        </div>
      </div>
      {floorError ? (
        <p className="text-xs text-destructive" role="alert">
          {floorError}
        </p>
      ) : null}
      {totalFloorsError ? (
        <p className="text-xs text-destructive" role="alert">
          {totalFloorsError}
        </p>
      ) : null}
    </div>
  );
}
