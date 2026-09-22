"use client";

import type { SupportedListingCurrency } from "@/features/currency/types";

type PriceCurrencyToggleProps = {
  value: SupportedListingCurrency;
  onChange: (nextCurrency: SupportedListingCurrency) => void;
  ariaLabel?: string;
  disabled?: boolean;
  isolatePointerEvents?: boolean;
};

export function PriceCurrencyToggle({
  value,
  onChange,
  ariaLabel = "განცხადების ფასის ვალუტა",
  disabled = false,
  isolatePointerEvents = false,
}: PriceCurrencyToggleProps) {
  const isGelSelected = value === "GEL";

  function handleSelect(nextCurrency: SupportedListingCurrency) {
    if (disabled || nextCurrency === value) {
      return;
    }
    onChange(nextCurrency);
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`relative inline-flex h-9 w-[5.5rem] shrink-0 items-stretch rounded-full border border-border/90 bg-card p-0.5 shadow-sm ${
        disabled ? "pointer-events-none opacity-50" : ""
      }`}
      onClick={
        isolatePointerEvents
          ? (event) => {
              event.stopPropagation();
            }
          : undefined
      }
      onMouseDown={
        isolatePointerEvents
          ? (event) => {
              event.stopPropagation();
            }
          : undefined
      }
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute left-0.5 top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-success shadow-sm transition-transform duration-200 ease-out ${
          isGelSelected ? "translate-x-0" : "translate-x-[calc(100%+2px)]"
        }`}
      />
      <button
        type="button"
        aria-pressed={isGelSelected}
        disabled={disabled}
        onClick={(event) => {
          if (isolatePointerEvents) {
            event.stopPropagation();
          }
          handleSelect("GEL");
        }}
        className={`relative z-10 flex flex-1 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
          isGelSelected ? "text-white" : "text-muted-foreground"
        }`}
      >
        ₾
      </button>
      <button
        type="button"
        aria-pressed={!isGelSelected}
        disabled={disabled}
        onClick={(event) => {
          if (isolatePointerEvents) {
            event.stopPropagation();
          }
          handleSelect("USD");
        }}
        className={`relative z-10 flex flex-1 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
          !isGelSelected ? "text-white" : "text-foreground"
        }`}
      >
        $
      </button>
    </div>
  );
}
