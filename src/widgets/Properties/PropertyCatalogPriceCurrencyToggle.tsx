"use client";

import { PriceCurrencyToggle } from "@/features/currency/PriceCurrencyToggle";
import { useCatalogPriceDisplayStore } from "@/shared/stores/catalogPriceDisplayStore";

export function PropertyCatalogPriceCurrencyToggle() {
  const displayCurrency = useCatalogPriceDisplayStore((state) => state.displayCurrency);
  const setDisplayCurrency = useCatalogPriceDisplayStore(
    (state) => state.setDisplayCurrency,
  );

  return (
    <PriceCurrencyToggle
      value={displayCurrency}
      onChange={setDisplayCurrency}
      isolatePointerEvents
    />
  );
}
