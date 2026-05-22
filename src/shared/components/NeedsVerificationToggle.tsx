"use client";

type NeedsVerificationToggleProps = {
  fieldKey: string;
  activeFields: string[];
  onChange: (nextFields: string[]) => void;
};

export function NeedsVerificationToggle({
  fieldKey,
  activeFields,
  onChange,
}: NeedsVerificationToggleProps) {
  const isActive = activeFields.includes(fieldKey);

  function handleToggle() {
    if (isActive) {
      onChange(activeFields.filter((activeField) => activeField !== fieldKey));
      return;
    }
    onChange([...activeFields, fieldKey]);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition ${
        isActive
          ? "border-amber-400 bg-amber-100 text-amber-800"
          : "border-slate-200 bg-white text-slate-500 hover:text-slate-900"
      }`}
      aria-pressed={isActive}
      aria-label={isActive ? "Marked as needs verification" : "Mark as needs verification"}
    >
      ?
    </button>
  );
}
