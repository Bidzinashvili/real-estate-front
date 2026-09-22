import type { ReactNode } from "react";
import type { LockState } from "@/features/matching/matchingEnums";
import { formatListingParkingDisplay } from "@/features/properties/listingParking";
import type { ListingParking, ListingParkingType } from "@/features/properties/types";
import { LISTING_PARKING_FIELD_LABEL } from "@/shared/i18n/enumLabels";
import { PreferenceLockButton } from "@/widgets/ClientForm/PreferenceLockButton";
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
  lock?: LockState;
  onLockChange?: (next: LockState) => void;
};

export function PropertyViewFact({
  label,
  value,
  tone = "default",
  lock,
  onLockChange,
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
      <div className="flex items-start justify-between gap-1.5">
        <p className="text-xs text-muted-foreground">{label}</p>
        {lock !== undefined && onLockChange ? (
          <PreferenceLockButton value={lock} onChange={onLockChange} />
        ) : null}
      </div>
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
  lock?: LockState;
  onLockChange?: (next: LockState) => void;
};

export function VerifiableBooleanFact({
  label,
  value,
  isToBeVerified,
  lock,
  onLockChange,
}: VerifiableBooleanFactProps) {
  if (isToBeVerified) {
    return (
      <PropertyViewFact
        label={label}
        value={NEEDS_VERIFICATION_LABEL}
        tone="verify"
        lock={lock}
        onLockChange={onLockChange}
      />
    );
  }
  if (value === true) {
    return (
      <PropertyViewFact
        label={label}
        value="კი"
        tone="yes"
        lock={lock}
        onLockChange={onLockChange}
      />
    );
  }
  if (value === false) {
    return (
      <PropertyViewFact
        label={label}
        value="არა"
        tone="no"
        lock={lock}
        onLockChange={onLockChange}
      />
    );
  }
  return (
    <PropertyViewFact
      label={label}
      value="უცნობი"
      tone="no"
      lock={lock}
      onLockChange={onLockChange}
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
  lock?: LockState;
  onLockChange?: (next: LockState) => void;
};

export function VerifiableNumberFact({
  label,
  value,
  isToBeVerified,
  suffix,
  emptyLabel = "—",
  requirePositive = false,
  lock,
  onLockChange,
}: VerifiableNumberFactProps) {
  if (isToBeVerified) {
    return (
      <PropertyViewFact
        label={label}
        value={NEEDS_VERIFICATION_LABEL}
        tone="verify"
        lock={lock}
        onLockChange={onLockChange}
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
        lock={lock}
        onLockChange={onLockChange}
      />
    );
  }
  const formatted = suffix ? `${value.toLocaleString()} ${suffix}` : value.toLocaleString();
  return <PropertyViewFact label={label} value={formatted} lock={lock} onLockChange={onLockChange} />;
}

type OptionalTextFactProps = {
  label: string;
  value: string | null | undefined;
  lock?: LockState;
  onLockChange?: (next: LockState) => void;
};

export function OptionalTextFact({ label, value, lock, onLockChange }: OptionalTextFactProps) {
  const text = value?.trim();
  return (
    <PropertyViewFact
      label={label}
      value={text ? text : "—"}
      lock={lock}
      onLockChange={onLockChange}
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
  lock?: LockState;
  onLockChange?: (next: LockState) => void;
};

export function ListingBalconyFacts({
  balconyCount,
  needsVerification,
  balconyArea,
  veranda,
  lock,
  onLockChange,
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
      lock={lock}
      onLockChange={onLockChange}
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
