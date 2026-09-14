"use client";

import { MapPin } from "lucide-react";
import { getApiBaseUrl } from "@/shared/lib/auth";
import {
  formatHotelScopeLabel,
  formatPropertyTypeLabel,
} from "@/features/properties/addPropertyFormOptions";
import {
  calculatePricePerSquareMeter,
  formatPricePerSquareMeter,
} from "@/features/properties/pricePerSquareMeter";
import { formatDealTypeLabel } from "@/features/properties/dealType";
import { formatPublicPropertyTitle } from "@/features/propertyShare/formatPublicPropertyTitle";
import type { PublicProperty } from "@/features/propertyShare/publicPropertyTypes";
import { canonicalPropertyArea } from "@/features/properties/propertyArea";
import { formatGelAmount } from "@/widgets/PropertyDetails/propertyViewFormatters";
import { PropertyViewGallery } from "@/widgets/PropertyDetails/PropertyViewGallery";
import { PublicPropertyCharacteristics } from "@/widgets/PublicProperty/PublicPropertyCharacteristics";

type PublicPropertyViewProps = {
  property: PublicProperty;
};

function publicAreaSquareMeters(property: PublicProperty): number | null {
  return canonicalPropertyArea(property);
}

function publicFullAddress(property: PublicProperty): string {
  const parts = [property.city, property.district, property.address]
    .map((part) => part.trim())
    .filter((part) => part !== "");
  return parts.join(", ");
}

export function PublicPropertyView({ property }: PublicPropertyViewProps) {
  const apiBaseUrl = getApiBaseUrl();
  const headline = formatPublicPropertyTitle(property);
  const publicPrice = formatGelAmount(property.pricePublic);
  const areaSquareMeters = publicAreaSquareMeters(property);
  const pricePerSquareMeter = calculatePricePerSquareMeter(
    property.pricePublic,
    areaSquareMeters,
  );
  const fullAddress = publicFullAddress(property);
  const typeLabel = formatPropertyTypeLabel(property.propertyType) ?? property.propertyType;
  const hotelScopeLabel = property.hotelScope
    ? formatHotelScopeLabel(property.hotelScope)
    : null;
  const publicComment = property.publicComment?.trim() ?? "";
  const galleryImages = property.images.map((image, imageIndex) => ({
    id: image.id?.trim() || `${property.id}-${imageIndex}`,
    url: image.url,
    originalName: image.originalName,
  }));

  return (
    <article className="flex w-full min-w-0 flex-col gap-5">
      {!property.available ? (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-warning-muted px-4 py-3 text-sm font-semibold text-amber-900"
        >
          ეს განცხადება აღარ არის აქტიური
        </div>
      ) : null}

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {headline}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {formatDealTypeLabel(property.dealType)}
          </span>
          <span className="inline-flex rounded-full bg-success-muted px-2.5 py-0.5 text-xs font-semibold text-success-foreground">
            {typeLabel}
            {hotelScopeLabel ? ` · ${hotelScopeLabel}` : ""}
          </span>
        </div>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.9fr)] lg:items-start">
        <div className="order-1 min-w-0">
          <PropertyViewGallery images={galleryImages} apiBaseUrl={apiBaseUrl} />
        </div>

        <section className="order-2 h-auto min-w-0 self-start overflow-visible rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6 lg:col-start-2 lg:row-start-1">
          <p className="text-xs text-muted-foreground">ფასი</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            {publicPrice ?? "—"}
          </p>
          {pricePerSquareMeter !== null ? (
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {formatPricePerSquareMeter(pricePerSquareMeter)}
            </p>
          ) : null}

          <dl className="mt-4 grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">ტიპი</dt>
              <dd className="mt-0.5 break-words text-sm font-medium text-foreground">
                {typeLabel}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">გარიგება</dt>
              <dd className="mt-0.5 break-words text-sm font-medium text-foreground">
                {formatDealTypeLabel(property.dealType)}
              </dd>
            </div>
            {property.city.trim() ? (
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">ქალაქი</dt>
                <dd className="mt-0.5 break-words text-sm font-medium text-foreground">
                  {property.city}
                </dd>
              </div>
            ) : null}
            {property.district.trim() ? (
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">უბანი</dt>
                <dd className="mt-0.5 break-words text-sm font-medium text-foreground">
                  {property.district}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">მისამართი</p>
            <p className="mt-1 flex items-start gap-1.5 text-sm font-medium text-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="min-w-0 break-words">{fullAddress || "—"}</span>
            </p>
          </div>
        </section>

        <div className="order-3 flex min-w-0 flex-col gap-5 lg:col-start-1">
          <PublicPropertyCharacteristics property={property} />
          {publicComment ? (
            <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6">
              <h2 className="text-base font-semibold text-foreground">საჯარო კომენტარი</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {publicComment}
              </p>
            </section>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function PublicPropertyNotFoundState() {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-8 text-center shadow-sm">
      <h1 className="text-xl font-semibold text-foreground">განცხადება ვერ მოიძებნა</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        ეს ბმული არასწორია ან განცხადება აღარ არსებობს.
      </p>
    </div>
  );
}

export function PublicPropertyRateLimitedState() {
  return (
    <div className="rounded-xl border border-amber-200 bg-warning-muted px-4 py-8 text-center text-sm text-amber-900">
      ძალიან ბევრი მოთხოვნაა. გთხოვთ, ცოტა ხანში სცადოთ.
    </div>
  );
}

export function PublicPropertyErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-destructive/10 px-4 py-8 text-center text-sm text-red-800">
      {message || "განცხადების ჩატვირთვა ვერ მოხერხდა."}
    </div>
  );
}
