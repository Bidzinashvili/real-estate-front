"use client";

import { Eye, MapPin } from "lucide-react";
import { formatHotelScopeLabel } from "@/features/properties/addPropertyFormOptions";
import { formatDealTypeLabel } from "@/features/properties/dealType";
import {
  formatPropertyStatusLabel,
  type Property,
  type PropertyStatus,
} from "@/features/properties/types";
import { PROPERTY_TYPE_LABELS } from "@/shared/i18n/enumLabels";
import { PropertyCardImageCarousel } from "@/widgets/Properties/PropertyCardImageCarousel";
import { PropertyListingCardManager } from "@/widgets/Properties/PropertyListingCardManager";
import { PropertyListingCardPriceRow } from "@/widgets/Properties/PropertyListingCardPriceRow";

function formatAddress(property: Property) {
  const parts = [
    property.address,
    property.district ? `(${property.district})` : null,
    property.city,
  ].filter(Boolean);

  return parts.join(" ");
}

function cardTitle(property: Property) {
  if (property.publicComment?.trim()) return property.publicComment.trim();
  if (property.description?.trim()) return property.description.trim();
  return formatAddress(property);
}

function cardRooms(property: Property) {
  const roomsCount = property.apartment?.rooms ?? property.privateHouse?.rooms;
  return roomsCount !== undefined && Number.isFinite(roomsCount)
    ? String(roomsCount)
    : "—";
}

function cardBedrooms(property: Property) {
  const bedroomsCount =
    property.apartment?.bedrooms ?? property.privateHouse?.bedrooms;
  return bedroomsCount !== undefined && Number.isFinite(bedroomsCount)
    ? String(bedroomsCount)
    : "—";
}

function cardAreaM2(property: Property) {
  const areaSquareMeters =
    property.apartment?.totalArea ??
    property.privateHouse?.totalArea ??
    property.landPlot?.landArea ??
    property.commercial?.area;
  return areaSquareMeters !== undefined && Number.isFinite(areaSquareMeters)
    ? String(areaSquareMeters)
    : "—";
}

function propertyAreaSquareMeters(property: Property): number | null {
  return (
    property.apartment?.totalArea ??
    property.privateHouse?.totalArea ??
    property.landPlot?.landArea ??
    property.commercial?.area ??
    null
  );
}

function formatOwnerLine(property: Property) {
  const name = property.ownerName?.trim();
  const phone = property.ownerPhones
    .map((ownerPhone) => ownerPhone.trim())
    .filter((ownerPhone) => ownerPhone !== "")
    .join(", ");
  if (name && phone) return `${name} • ${phone}`;
  if (name) return name;
  if (phone) return phone;
  return "—";
}

function lifecycleStatusBadgeClass(status: PropertyStatus): string {
  if (status === "TO_BE_VERIFIED") {
    return "bg-warning";
  }
  if (status === "AVAILABLE_SOON") {
    return "bg-violet-600";
  }
  if (status === "RENTED") {
    return "bg-muted-foreground";
  }
  if (status === "SOLD" || status === "ARCHIVED") {
    return "bg-muted-foreground";
  }
  return "bg-teal-600";
}

type PropertyListingCardProps = {
  property: Property;
  apiBaseUrl: string | null;
  onView: (propertyId: string) => void;
  canChangeStatus?: boolean;
  canSetReminders?: boolean;
  onListingChanged?: () => void;
};

export function PropertyListingCard({
  property,
  apiBaseUrl,
  onView,
  canChangeStatus = false,
  canSetReminders = false,
  onListingChanged,
}: PropertyListingCardProps) {
  const addressLine = formatAddress(property);
  const areaSquareMeters = propertyAreaSquareMeters(property);

  function handleImageKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onView(property.id);
    }
  }

  return (
    <article className="flex min-w-0 w-full flex-col overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border transition-shadow hover:shadow-md">
      <div className="relative">
        <div
          role="link"
          tabIndex={0}
          aria-label="განცხადების ნახვა"
          onClick={() => onView(property.id)}
          onKeyDown={handleImageKeyDown}
          className="relative aspect-[3/2] w-full cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <PropertyCardImageCarousel
            propertyId={property.id}
            images={property.images}
            apiBaseUrl={apiBaseUrl}
            alt={addressLine}
          />
          <div className="absolute left-3 top-3 z-[15] flex max-w-[calc(100%-3.25rem)] flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
              {formatDealTypeLabel(property.dealType)}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${lifecycleStatusBadgeClass(property.status)}`}
            >
              {formatPropertyStatusLabel(property.status)}
            </span>
          </div>
        </div>
        {(canChangeStatus || canSetReminders) && onListingChanged ? (
          <PropertyListingCardManager
            property={property}
            onListingChanged={onListingChanged}
            canChangeStatus={canChangeStatus}
            canSetReminders={canSetReminders}
          />
        ) : null}
      </div>

      <div className="space-y-2.5 p-3">
        <div className="flex items-start justify-between gap-3">
          <PropertyListingCardPriceRow
            pricePublic={property.pricePublic}
            areaSquareMeters={areaSquareMeters}
          />
          <span className="flex shrink-0 flex-col items-end gap-1">
            <span className="rounded-full bg-success-muted px-2 py-0.5 text-[10px] font-semibold text-success">
              {PROPERTY_TYPE_LABELS[property.propertyType] ?? property.propertyType}
            </span>
            {property.propertyType === "HOTEL" && property.hotelScope ? (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                {formatHotelScopeLabel(property.hotelScope)}
              </span>
            ) : null}
          </span>
        </div>

        <p className="line-clamp-2 text-lg font-semibold text-foreground">
          {cardTitle(property)}
        </p>

        <p className="inline-flex items-center gap-1.5 text-sm text-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0">{addressLine}</span>
        </p>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="rounded-full bg-success-muted px-2.5 py-1 text-foreground">
            {cardRooms(property)} ოთახი
          </span>
          <span className="rounded-full bg-success-muted px-2.5 py-1 text-foreground">
            {cardBedrooms(property)} საძინებელი
          </span>
          <span className="rounded-full bg-success-muted px-2.5 py-1 text-foreground">
            {cardAreaM2(property)} მ²
          </span>
        </div>

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onView(property.id);
            }}
            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:w-auto sm:min-w-[7rem]"
          >
            <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
            ნახვა
          </button>
          <p className="min-w-0 truncate text-xs text-muted-foreground">
            {formatOwnerLine(property)}
          </p>
        </div>
      </div>
    </article>
  );
}
