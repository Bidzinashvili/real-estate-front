import type { ReactNode } from "react";
import { formatListingParkingDisplay } from "@/features/properties/listingParking";
import type { ListingParking, ListingParkingType } from "@/features/properties/types";
import { LISTING_PARKING_FIELD_LABEL } from "@/shared/i18n/enumLabels";
import { NEEDS_VERIFICATION_LABEL } from "@/widgets/PropertyDetails/propertyViewFormatters";
import {
  BALCONY_FIELD_LABEL,
  BALCONY_VERANDA_LABEL,
  formatBalconyCountDisplay,
  isBalconyUiToVerify,
} from "@/features/properties/listingBalcony";

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
      <PropertyViewFact
        label={label}
        value={NEEDS_VERIFICATION_LABEL}
        tone="verify"
      />
    );
  }
  if (value === true) {
    return (
      <PropertyViewFact
        label={label}
        value="კი"
        tone="yes"
      />
    );
  }
  if (value === false) {
    return (
      <PropertyViewFact
        label={label}
        value="არა"
        tone="no"
      />
    );
  }
  return (
    <PropertyViewFact
      label={label}
      value="უცნობი"
      tone="no"
    />
  );
}

type VerifiableNumberFactProps = {
  label: string;
  value: number | null | undefined;
  isToBeVerified: boolean;
  suffix?: string;
  emptyLabel?: string;
  requirePositive?: boolean;
};

export function VerifiableNumberFact({
  label,
  value,
  isToBeVerified,
  suffix,
  emptyLabel = "—",
  requirePositive = false,
}: VerifiableNumberFactProps) {
  if (isToBeVerified) {
    return (
      <PropertyViewFact
        label={label}
        value={NEEDS_VERIFICATION_LABEL}
        tone="verify"
      />
    );
  }
  const isMissing =
    value === null ||
    value === undefined ||
    Number.isNaN(value) ||
    (requirePositive && value <= 0);
  if (isMissing) {
    return (
      <PropertyViewFact
        label={label}
        value={emptyLabel}
        tone="no"
      />
    );
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
  return (
    <PropertyViewFact
      label={label}
      value={text ? text : "—"}
    />
  );
}

type ListingParkingFactProps = {
  parking: ListingParking;
  parkingTypes: ListingParkingType[];
};

export function ListingParkingFact({ parking, parkingTypes }: ListingParkingFactProps) {
  const tone: PropertyViewFactTone =
    parking === "YES" ? "yes" : parking === "NO" ? "no" : "verify";

  return (
    <PropertyViewFact
      label={LISTING_PARKING_FIELD_LABEL}
      value={formatListingParkingDisplay(parking, parkingTypes)}
      tone={tone}
    />
  );
}

type ListingBalconyFactsProps = {
  balconyCount: number | null | undefined;
  needsVerification?: string[] | null;
  balconyArea?: number | null;
  veranda?: boolean | null;
};

export function ListingBalconyFacts({
  balconyCount,
  needsVerification,
  balconyArea,
  veranda,
}: ListingBalconyFactsProps) {
  const isToVerify = isBalconyUiToVerify(balconyCount, needsVerification);
  const formattedArea =
    balconyArea !== null && balconyArea !== undefined && Number.isFinite(balconyArea)
      ? `${balconyArea.toLocaleString()} მ²`
      : null;
  const facts = [
    <PropertyViewFact
      key="count"
      label={BALCONY_FIELD_LABEL}
      value={formatBalconyCountDisplay({ balconyCount, needsVerification })}
      tone={isToVerify ? "verify" : balconyCount === 0 ? "no" : "default"}
    />,
    formattedArea ? (
      <PropertyViewFact key="area" label="აივნის ფართობი" value={formattedArea} />
    ) : null,
    veranda === true ? (
      <PropertyViewFact key="veranda" label={BALCONY_VERANDA_LABEL} value="კი" tone="yes" />
    ) : null,
  ];

  return <>{facts}</>;
}
