import { create } from "zustand";

export type CatalogListingPriceCurrency = "GEL" | "USD";

type CatalogPriceDisplayState = {
  displayCurrency: CatalogListingPriceCurrency;
  setDisplayCurrency: (next: CatalogListingPriceCurrency) => void;
};

export const useCatalogPriceDisplayStore = create<CatalogPriceDisplayState>((set) => ({
  displayCurrency: "GEL",
  setDisplayCurrency: (next) => set({ displayCurrency: next }),
}));
