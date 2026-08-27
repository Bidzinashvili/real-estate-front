import { MapPin } from "lucide-react";
import type { Property } from "@/features/properties/types";
import type { LockState, PropertyFieldLocks } from "@/features/matching/matchingEnums";
import { readPropertyFieldLock } from "@/features/matching/persistEntityLock";
import { PreferenceLockButton } from "@/widgets/ClientForm/PreferenceLockButton";
import {
  calculatePricePerSquareMeter,
  formatPricePerSquareMeter,
} from "@/features/properties/pricePerSquareMeter";
import {
  formatDealTypeLabel,
  formatGelAmount,
  formatPropertyFullAddress,
  propertyAreaSquareMeters,
  propertyTypeDisplayLabel,
} from "@/widgets/PropertyDetails/propertyViewFormatters";
import { LifecycleStatusBadge } from "@/widgets/Lifecycle/LifecycleStatusBadge";
import { isCustomRecordColor } from "@/features/recordColor/recordColor";
import { recordColorSurfaceClassName } from "@/features/recordColor/recordColorSurface";
import { RecordTimestamp } from "@/widgets/RecordTimestamp/RecordTimestamp";
import { cn } from "@/shared/lib/utils";

type PropertyViewSummaryCardProps = {
  property: Property;
  canViewPrivateFields: boolean;
  fieldLocks?: PropertyFieldLocks;
  onFieldLockChange?: (lockKey: "price" | "street", nextLock: LockState) => void;
};

export function PropertyViewSummaryCard({
  property,
  canViewPrivateFields,
  fieldLocks,
  onFieldLockChange,
}: PropertyViewSummaryCardProps) {
  const publicPrice = formatGelAmount(property.pricePublic);
  const internalPrice = formatGelAmount(property.priceInternal);
  const areaSquareMeters = propertyAreaSquareMeters(property);
  const pricePerSquareMeter = calculatePricePerSquareMeter(
    property.pricePublic,
    areaSquareMeters,
  );
  const fullAddress = formatPropertyFullAddress(property);

  return (
    <section
      className={cn(
        "h-auto overflow-visible rounded-2xl p-5 shadow-sm ring-1 sm:p-6",
        isCustomRecordColor(property.color)
          ? recordColorSurfaceClassName(property.color)
          : "bg-card ring-border",
      )}
    >
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs text-muted-foreground">ფასი</p>
          {fieldLocks && onFieldLockChange ? (
            <PreferenceLockButton
              value={readPropertyFieldLock(fieldLocks, "price")}
              onChange={(nextLock) => onFieldLockChange("price", nextLock)}
            />
          ) : null}
        </div>
        <p className="text-3xl font-semibold tracking-tight text-foreground">
          {publicPrice ?? "—"}
        </p>
        {pricePerSquareMeter !== null ? (
          <p className="text-xs font-medium text-muted-foreground">
            {formatPricePerSquareMeter(pricePerSquareMeter)}
          </p>
        ) : null}
      </div>

      {canViewPrivateFields ? (
        <div className="mt-4 rounded-xl bg-warning-muted/60 px-3 py-2.5 ring-1 ring-border">
          <p className="text-xs text-muted-foreground">შიდა ფასი</p>
          <p className="mt-0.5 text-lg font-semibold text-foreground">
            {internalPrice ?? "—"}
          </p>
        </div>
      ) : null}

      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">ტიპი</dt>
          <dd className="mt-0.5 break-words text-sm font-medium text-foreground">
            {propertyTypeDisplayLabel(property)}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">გარიგება</dt>
          <dd className="mt-0.5 break-words text-sm font-medium text-foreground">
            {formatDealTypeLabel(property.dealType)}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">სტატუსი</dt>
          <dd className="mt-1">
            <LifecycleStatusBadge
              kind="property"
              status={property.status}
              outcomeSource={property.outcomeSource}
              verificationReason={property.verificationReason}
            />
          </dd>
        </div>
      </dl>

      <div className="mt-4 border-t border-border pt-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs text-muted-foreground">მისამართი</p>
          {fieldLocks && onFieldLockChange ? (
            <PreferenceLockButton
              value={readPropertyFieldLock(fieldLocks, "street")}
              onChange={(nextLock) => onFieldLockChange("street", nextLock)}
            />
          ) : null}
        </div>
        <p className="mt-1 flex items-start gap-1.5 text-sm font-medium text-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="min-w-0 break-words">{fullAddress || "—"}</span>
        </p>
      </div>

      <RecordTimestamp
        className="mt-4"
        createdAt={property.createdAt}
        updatedAt={property.updatedAt}
      />
    </section>
  );
}
