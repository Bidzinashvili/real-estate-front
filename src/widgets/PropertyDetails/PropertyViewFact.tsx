import type { ReactNode } from "react";
import { NEEDS_VERIFICATION_LABEL } from "@/widgets/PropertyDetails/propertyViewFormatters";

export type PropertyViewFactTone = "default" | "verify" | "yes" | "no";

type PropertyViewFactProps = {
  label: string;
  value: string;
  tone?: PropertyViewFactTone;
};

export function PropertyViewFact({
  label,
  value,
  tone = "default",
}: PropertyViewFactProps) {
  const valueClassName =
    tone === "verify"
      ? "text-warning-foreground"
      : tone === "yes"
        ? "text-success-foreground"
        : tone === "no"
          ? "text-muted-foreground"
          : "text-foreground";

  return (
    <div className="min-w-0 rounded-xl bg-muted/70 px-3 py-2.5 ring-1 ring-border">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-0.5 break-words text-sm font-medium ${valueClassName}`}>{value}</p>
    </div>
  );
}

export function PropertyViewFactGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{children}</div>;
}

type VerifiableBooleanFactProps = {
  label: string;
  value: boolean | null | undefined;
  isToBeVerified: boolean;
};

export function VerifiableBooleanFact({
  label,
  value,
  isToBeVerified,
}: VerifiableBooleanFactProps) {
  if (isToBeVerified) {
    return (
      <PropertyViewFact label={label} value={NEEDS_VERIFICATION_LABEL} tone="verify" />
    );
  }
  if (value === true) {
    return <PropertyViewFact label={label} value="კი" tone="yes" />;
  }
  if (value === false) {
    return <PropertyViewFact label={label} value="არა" tone="no" />;
  }
  return <PropertyViewFact label={label} value="უცნობი" tone="no" />;
}

type VerifiableNumberFactProps = {
  label: string;
  value: number | null | undefined;
  isToBeVerified: boolean;
  suffix?: string;
};

export function VerifiableNumberFact({
  label,
  value,
  isToBeVerified,
  suffix,
}: VerifiableNumberFactProps) {
  if (isToBeVerified) {
    return (
      <PropertyViewFact label={label} value={NEEDS_VERIFICATION_LABEL} tone="verify" />
    );
  }
  if (value === null || value === undefined || Number.isNaN(value)) {
    return <PropertyViewFact label={label} value="—" />;
  }
  const formatted = suffix ? `${value.toLocaleString()} ${suffix}` : value.toLocaleString();
  return <PropertyViewFact label={label} value={formatted} />;
}

type OptionalTextFactProps = {
  label: string;
  value: string | null | undefined;
};

export function OptionalTextFact({ label, value }: OptionalTextFactProps) {
  const text = value?.trim();
  return <PropertyViewFact label={label} value={text ? text : "—"} />;
}
