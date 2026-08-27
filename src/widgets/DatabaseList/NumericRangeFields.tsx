"use client";

type NumericRangeFieldsProps = {
  fromValue: string;
  toValue: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  label: string;
  fromAriaLabel: string;
  toAriaLabel: string;
  inputClassName: string;
  labelClassName: string;
};

export function NumericRangeFields({
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  label,
  fromAriaLabel,
  toAriaLabel,
  inputClassName,
  labelClassName,
}: NumericRangeFieldsProps) {
  const fromNumber = Number.parseFloat(fromValue.trim());
  const toNumber = Number.parseFloat(toValue.trim());
  const hasOrderError =
    fromValue.trim() !== "" &&
    toValue.trim() !== "" &&
    Number.isFinite(fromNumber) &&
    Number.isFinite(toNumber) &&
    fromNumber > toNumber;

  return (
    <div>
      <span className={labelClassName}>{label}</span>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          inputMode="decimal"
          value={fromValue}
          onChange={(event) => onFromChange(event.target.value)}
          className={inputClassName}
          placeholder="დან"
          aria-label={fromAriaLabel}
        />
        <input
          type="text"
          inputMode="decimal"
          value={toValue}
          onChange={(event) => onToChange(event.target.value)}
          className={inputClassName}
          placeholder="მდე"
          aria-label={toAriaLabel}
        />
      </div>
      {hasOrderError ? (
        <p className="mt-1 text-xs text-destructive" role="alert">
          დაწყება არ უნდა აღემატებოდეს დასასრულს.
        </p>
      ) : null}
    </div>
  );
}
