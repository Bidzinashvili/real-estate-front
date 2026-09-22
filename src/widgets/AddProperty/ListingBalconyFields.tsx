"use client";

import {
  applyBalconyToVerify,
  BALCONY_TO_VERIFY_LABEL,
  BALCONY_TOTAL_AREA_PREFIX,
  BALCONY_TOTAL_AREA_SUFFIX,
  BALCONY_VERANDA_LABEL,
  canDecreaseBalconyCount,
  canIncreaseBalconyCount,
  formatBalconyCountControlLabel,
  isBalconyUiToVerify,
  nextBalconyCountAfterDecrease,
  nextBalconyCountAfterIncrease,
  type ListingBalconySelection,
} from "@/features/properties/listingBalcony";
import { addPropertyInputClassName } from "@/widgets/AddProperty/addPropertyFormFields";
import { OptionChips } from "@/shared/ui/OptionChips";
import { cn } from "@/shared/lib/utils";

const COUNTER_BUTTON_CLASS_NAME =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-base font-medium text-foreground shadow-sm outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40";

type ListingBalconyFieldsProps = {
  idPrefix: string;
  balconyCount: number | null | undefined;
  needsVerification: string[];
  balconyArea: string;
  veranda: boolean;
  onChange: (next: ListingBalconySelection) => void;
  balconyAreaError?: string;
};

export function ListingBalconyFields({
  idPrefix,
  balconyCount,
  needsVerification,
  balconyArea,
  veranda,
  onChange,
  balconyAreaError,
}: ListingBalconyFieldsProps) {
  const isToVerify = isBalconyUiToVerify(balconyCount, needsVerification);
  const canDecrease = canDecreaseBalconyCount(balconyCount, needsVerification);
  const canIncrease = canIncreaseBalconyCount(balconyCount, needsVerification);
  const countLabel =
    isToVerify || balconyCount === null || balconyCount === undefined
      ? ""
      : formatBalconyCountControlLabel(balconyCount);
  const areaInputId = `${idPrefix}BalconyArea`;
  const verandaInputId = `${idPrefix}Veranda`;

  function emit(next: Partial<ListingBalconySelection>) {
    onChange({
      balconyCount: balconyCount ?? null,
      needsVerification,
      balconyArea,
      veranda,
      ...next,
    });
  }

  return (
    <div className="space-y-2 sm:col-span-2">
      <OptionChips
        id={`${idPrefix}BalconyToVerify`}
        aria-label={BALCONY_TO_VERIFY_LABEL}
        value={isToVerify ? "toBeVerified" : ""}
        onChange={() => emit({ needsVerification: applyBalconyToVerify(needsVerification) })}
        options={[{ value: "toBeVerified", label: BALCONY_TO_VERIFY_LABEL }]}
      />
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm"
          role="group"
          aria-label="აივნების რაოდენობა"
        >
          <button
            id={`${idPrefix}BalconyDecrease`}
            type="button"
            className={COUNTER_BUTTON_CLASS_NAME}
            aria-label="შემცირება"
            disabled={!canDecrease}
            onClick={() => emit(nextBalconyCountAfterDecrease({ balconyCount, needsVerification }))}
          >
            −
          </button>
          <span className="min-w-[7ch] text-center text-sm font-semibold tabular-nums text-foreground">
            {countLabel}
          </span>
          <button
            id={`${idPrefix}BalconyIncrease`}
            type="button"
            className={COUNTER_BUTTON_CLASS_NAME}
            aria-label="გაზრდა"
            disabled={!canIncrease}
            onClick={() => emit(nextBalconyCountAfterIncrease({ balconyCount, needsVerification }))}
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor={areaInputId} className="text-sm font-medium text-foreground">
            {BALCONY_TOTAL_AREA_PREFIX}
          </label>
          <input
            id={areaInputId}
            type="number"
            inputMode="decimal"
            value={balconyArea}
            onChange={(event) => emit({ balconyArea: event.target.value })}
            className={`${addPropertyInputClassName("px-2")} w-16 text-center tabular-nums ${
              balconyAreaError ? "border-destructive focus:border-destructive" : ""
            }`}
            aria-label="აივნის ჯამური ფართობი"
          />
          <span className="text-sm font-medium text-foreground">{BALCONY_TOTAL_AREA_SUFFIX}</span>
        </div>
        <label
          htmlFor={verandaInputId}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition",
            veranda
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent",
          )}
        >
          <input
            id={verandaInputId}
            type="checkbox"
            checked={veranda}
            onChange={(event) => emit({ veranda: event.target.checked })}
            className="h-4 w-4 rounded border-border accent-current"
          />
          <span>{BALCONY_VERANDA_LABEL}</span>
        </label>
      </div>
      {balconyAreaError ? (
        <p className="text-xs text-destructive" role="alert">
          {balconyAreaError}
        </p>
      ) : null}
    </div>
  );
}
