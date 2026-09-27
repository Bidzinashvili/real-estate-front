"use client";

import { useCatalogListingPriceLine } from "@/features/currency/useCatalogListingPriceLine";
import type { SupportedListingCurrency } from "@/features/currency/types";
import { useCatalogPriceDisplayStore } from "@/shared/stores/catalogPriceDisplayStore";
import { PropertyCatalogPriceCurrencyToggle } from "@/widgets/Properties/PropertyCatalogPriceCurrencyToggle";
import {
  calculatePricePerSquareMeter,
  formatPricePerSquareMeter,
} from "@/features/properties/pricePerSquareMeter";

type PropertyListingCardPriceRowProps = {
  pricePublic: number;
  listingCurrency: SupportedListingCurrency;
  areaSquareMeters?: number | null;
};

export function PropertyListingCardPriceRow({
  pricePublic,
  listingCurrency,
  areaSquareMeters,
}: PropertyListingCardPriceRowProps) {
  const displayCurrency = useCatalogPriceDisplayStore((state) => state.displayCurrency);
  const priceLine = useCatalogListingPriceLine(
    pricePublic,
    listingCurrency,
    displayCurrency,
  );

  const pricePerSquareMeter = calculatePricePerSquareMeter(
    pricePublic,
    areaSquareMeters,
  );

  return (
    <div className="min-w-0 flex-1 space-y-0.5">
      <div className="flex min-w-0 items-center gap-2">
        <p className="min-w-0 truncate text-2xl font-semibold tracking-tight text-foreground">
          {priceLine.primaryLine}
        </p>
        <PropertyCatalogPriceCurrencyToggle />
      </div>
      {priceLine.status === "error" ? (
        <p className="text-xs text-destructive" role="status">
          {priceLine.message}
        </p>
      ) : null}
      {pricePerSquareMeter !== null ? (
        <p className="text-xs font-medium text-muted-foreground">
          {formatPricePerSquareMeter(pricePerSquareMeter, listingCurrency)}
        </p>
      ) : null}
    </div>
  );
}
