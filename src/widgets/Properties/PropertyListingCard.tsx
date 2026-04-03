"use client";

import { Heart, MapPin } from "lucide-react";
import { formatDealTypeLabel } from "@/features/properties/dealType";
import type { Property } from "@/features/properties/types";
import { PropertyCardImageCarousel } from "@/widgets/Properties/PropertyCardImageCarousel";

function formatAddress(property: Property) {
  const parts = [
    property.address,
    property.district ? `(${property.district})` : null,
    property.city,
  ].filter(Boolean);

  return parts.join(" ");
}

function cardTitle(property: Property) {
  if (property.description?.trim()) return property.description.trim();
  return formatAddress(property);
}

function cardRooms(property: Property) {
  const n = property.apartment?.rooms ?? property.privateHouse?.rooms;
  return n !== undefined && Number.isFinite(n) ? String(n) : "—";
}

function cardBedrooms(property: Property) {
  const n = property.apartment?.bedrooms ?? property.privateHouse?.bedrooms;
  return n !== undefined && Number.isFinite(n) ? String(n) : "—";
}

function cardAreaM2(property: Property) {
  const n =
    property.apartment?.totalArea ??
    property.privateHouse?.totalArea ??
    property.landPlot?.landArea ??
    property.commercial?.area;
  return n !== undefined && Number.isFinite(n) ? String(n) : "—";
}

function formatOwnerLine(property: Property) {
  const name = property.ownerName?.trim();
  const phone = property.ownerPhone?.trim();
  if (name && phone) return `${name} • ${phone}`;
  if (name) return name;
  if (phone) return phone;
  return "—";
}

type PropertyListingCardProps = {
  property: Property;
  apiBaseUrl: string | null;
  onView: (propertyId: string) => void;
};

export function PropertyListingCard({
  property,
  apiBaseUrl,
  onView,
}: PropertyListingCardProps) {
  const addressLine = formatAddress(property);

  return (
    <article className="flex min-w-0 w-full flex-col overflow-hidden rounded-3xl bg-[#dfe8e4] shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <PropertyCardImageCarousel
          propertyId={property.id}
          images={property.images}
          apiBaseUrl={apiBaseUrl}
          alt={addressLine}
        />
        <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
          {formatDealTypeLabel(property.dealType)}
        </div>
        <button
          type="button"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white"
          aria-label="Favorite"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2.5 p-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-2xl font-semibold tracking-tight text-slate-900">
            {property.pricePublic.toLocaleString()} ₾
          </p>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            {property.propertyType}
          </span>
        </div>

        <p className="line-clamp-2 text-lg font-semibold text-slate-800">
          {cardTitle(property)}
        </p>

        <p className="inline-flex items-center gap-1.5 text-sm text-slate-700">
          <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
          <span className="min-w-0">{addressLine}</span>
        </p>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-slate-700">
            {cardRooms(property)} rooms
          </span>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-slate-700">
            {cardBedrooms(property)} bedrooms
          </span>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-slate-700">
            {cardAreaM2(property)} m²
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <p className="min-w-0 truncate text-xs text-slate-500">
            {formatOwnerLine(property)}
          </p>
          <button
            type="button"
            onClick={() => onView(property.id)}
            className="shrink-0 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
}
