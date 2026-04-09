type ClientDetailsRequirementRowProps = {
  label: string;
  value: string | number | boolean | null | undefined;
};

export function ClientDetailsRequirementRow({
  label,
  value,
}: ClientDetailsRequirementRowProps) {
  if (value === null || value === undefined) return null;
  const displayValue =
    typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800">{displayValue}</span>
    </div>
  );
}
