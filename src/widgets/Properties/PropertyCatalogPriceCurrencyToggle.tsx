"use client";

import { useCatalogPriceDisplayStore } from "@/shared/stores/catalogPriceDisplayStore";

export function PropertyCatalogPriceCurrencyToggle() {
  const displayCurrency = useCatalogPriceDisplayStore((state) => state.displayCurrency);
  const setDisplayCurrency = useCatalogPriceDisplayStore(
    (state) => state.setDisplayCurrency,
  );
  const isGelSelected = displayCurrency === "GEL";

  return (
    <div
      role="group"
      aria-label="განცხადების ფასის ვალუტა"
      className="relative inline-flex h-9 w-[5.5rem] shrink-0 items-stretch rounded-full border border-border/90 bg-card p-0.5 shadow-sm"
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute left-0.5 top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-success shadow-sm transition-transform duration-200 ease-out ${
          isGelSelected ? "translate-x-0" : "translate-x-[calc(100%+2px)]"
        }`}
      />
      <button
        type="button"
        aria-pressed={isGelSelected}
        onClick={(event) => {
          event.stopPropagation();
          setDisplayCurrency("GEL");
        }}
        className={`relative z-10 flex flex-1 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
          isGelSelected ? "text-white" : "text-muted-foreground"
        }`}
      >
        ₾
      </button>
      <button
        type="button"
        aria-pressed={!isGelSelected}
        onClick={(event) => {
          event.stopPropagation();
          setDisplayCurrency("USD");
        }}
        className={`relative z-10 flex flex-1 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
          !isGelSelected ? "text-white" : "text-foreground"
        }`}
      >
        $
      </button>
    </div>
  );
}
