"use client";

import { useRef } from "react";
import { addPropertyInputClassName } from "@/widgets/AddProperty/addPropertyFormFields";

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

function sanitizeDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 2);
}

export function FloorInput({
  floorId,
  totalFloorsId,
  floorLabel = "Floor",
  totalFloorsLabel = "Total floors",
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
    const nextValue = sanitizeDigits(value);
    onFloorChange(nextValue);
    if (nextValue.length === 2) {
      totalFloorsInputRef.current?.focus();
    }
  }

  function handleTotalFloorsChange(value: string) {
    onTotalFloorsChange(sanitizeDigits(value));
  }

  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <label htmlFor={floorId} className="block text-sm font-medium text-slate-800">
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
            className={`${addPropertyInputClassName()} ${floorError ? "border-red-500 focus:border-red-600" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor={totalFloorsId}
            className="block text-sm font-medium text-slate-800"
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
            className={`${addPropertyInputClassName()} ${totalFloorsError ? "border-red-500 focus:border-red-600" : ""}`}
          />
        </div>
      </div>
      {floorError ? (
        <p className="text-xs text-red-600" role="alert">
          {floorError}
        </p>
      ) : null}
      {totalFloorsError ? (
        <p className="text-xs text-red-600" role="alert">
          {totalFloorsError}
        </p>
      ) : null}
    </div>
  );
}
