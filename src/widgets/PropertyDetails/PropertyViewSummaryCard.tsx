import { MapPin } from "lucide-react";
import type { Property } from "@/features/properties/types";
import {
  calculatePricePerSquareMeter,
  formatPricePerSquareMeter,
} from "@/features/properties/pricePerSquareMeter";
import {
  formatDealTypeLabel,
  formatGelAmount,
  formatPropertyFullAddress,
  formatPropertyStatusLabel,
  propertyAreaSquareMeters,
  propertyStatusBadgeClass,
  propertyTypeDisplayLabel,
} from "@/widgets/PropertyDetails/propertyViewFormatters";

type PropertyViewSummaryCardProps = {
  property: Property;
  canViewPrivateFields: boolean;
};

export function PropertyViewSummaryCard({
  property,
  canViewPrivateFields,
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
    <section className="h-auto overflow-visible rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">ფასი</p>
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
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${propertyStatusBadgeClass(property.status)}`}
            >
              {formatPropertyStatusLabel(property.status)}
            </span>
          </dd>
        </div>
      </dl>

      <div className="mt-4 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">მისამართი</p>
        <p className="mt-1 flex items-start gap-1.5 text-sm font-medium text-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="min-w-0 break-words">{fullAddress || "—"}</span>
        </p>
      </div>
    </section>
  );
}
