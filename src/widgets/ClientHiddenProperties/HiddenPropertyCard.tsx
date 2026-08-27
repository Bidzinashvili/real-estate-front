"use client";

import Link from "next/link";
import { Archive } from "lucide-react";
import { formatHiddenAt } from "@/features/clientHiddenProperties/formatHiddenAt";
import { HIDDEN_PROPERTY_COPY } from "@/features/clientHiddenProperties/hiddenPropertyCopy";
import type { HiddenPropertyItem } from "@/features/clientHiddenProperties/types";
import { isPropertyArchived } from "@/features/lifecycle/isPropertyArchived";
import { formatDealTypeLabel } from "@/features/properties/dealType";
import { getApiBaseUrl } from "@/shared/lib/auth";
import { PROPERTY_TYPE_LABELS } from "@/shared/i18n/enumLabels";
import { LifecycleStatusBadge } from "@/widgets/Lifecycle/LifecycleStatusBadge";
import { PropertyCardImageCarousel } from "@/widgets/Properties/PropertyCardImageCarousel";

type HiddenPropertyCardProps = {
  item: HiddenPropertyItem;
  canRestore: boolean;
  isRestorePending: boolean;
  onRestore: () => void;
};

export function HiddenPropertyCard({
  item,
  canRestore,
  isRestorePending,
  onRestore,
}: HiddenPropertyCardProps) {
  const apiBaseUrl = getApiBaseUrl();
  const coverImages = item.coverImage
    ? [{ url: item.coverImage.url, originalName: item.coverImage.originalName }]
    : [];
  const hiddenAtLabel = formatHiddenAt(item.hiddenAt);
  const streetLine = item.street?.trim() || null;
  const isArchived = isPropertyArchived(item);

  return (
    <article className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border">
      <div className="flex flex-col gap-3 p-3 sm:flex-row">
        <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-36">
          <PropertyCardImageCarousel
            propertyId={item.id}
            images={coverImages}
            apiBaseUrl={apiBaseUrl}
            alt={item.address || PROPERTY_TYPE_LABELS[item.propertyType]}
          />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-success-muted px-2 py-0.5 text-[11px] font-semibold text-success">
              {PROPERTY_TYPE_LABELS[item.propertyType] ?? item.propertyType}
            </span>
            <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[11px] font-semibold text-white">
              {formatDealTypeLabel(item.dealType)}
            </span>
            <LifecycleStatusBadge kind="property" status={item.status} size="sm" />
            {isArchived ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                <Archive className="h-3 w-3" aria-hidden="true" />
                {HIDDEN_PROPERTY_COPY.archivedBadge}
              </span>
            ) : null}
          </div>
          <p className="text-sm font-semibold text-foreground">{item.address || "—"}</p>
          <p className="text-xs text-muted-foreground">
            {[item.district, streetLine && streetLine !== item.address ? streetLine : null]
              .filter(Boolean)
              .join(" · ") || "—"}
          </p>
          <p className="text-sm font-medium text-foreground">
            {item.pricePublic.toLocaleString()} ₾
          </p>
          {hiddenAtLabel ? (
            <p className="text-xs text-muted-foreground">
              {HIDDEN_PROPERTY_COPY.hiddenAtPrefix}: {hiddenAtLabel}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/properties/${item.id}`}
              className="inline-flex text-sm font-medium text-foreground underline-offset-2 hover:underline"
            >
              {HIDDEN_PROPERTY_COPY.openListing}
            </Link>
            {canRestore ? (
              <button
                type="button"
                onClick={onRestore}
                disabled={isRestorePending}
                className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRestorePending ? "ბრუნდება…" : HIDDEN_PROPERTY_COPY.unhideAction}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
