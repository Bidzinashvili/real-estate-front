"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  getCachedGelToUsd,
  getGelToUsdCacheVersion,
  peekCachedGelToUsd,
  subscribeGelToUsdCache,
} from "@/features/currency/gelToUsdConvertCache";
import { ApiError } from "@/shared/lib/apiError";
import { useCatalogPriceDisplayStore } from "@/shared/stores/catalogPriceDisplayStore";
import { PropertyCatalogPriceCurrencyToggle } from "@/widgets/Properties/PropertyCatalogPriceCurrencyToggle";
import {
  calculatePricePerSquareMeter,
  formatPricePerSquareMeter,
} from "@/features/properties/pricePerSquareMeter";

const MAX_CONVERT_AMOUNT = 1e15;

const usdCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type PropertyListingCardPriceRowProps = {
  pricePublic: number;
  areaSquareMeters?: number | null;
};

export function PropertyListingCardPriceRow({
  pricePublic,
  areaSquareMeters,
}: PropertyListingCardPriceRowProps) {
  const displayCurrency = useCatalogPriceDisplayStore((state) => state.displayCurrency);
  const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);

  const gelToUsdCacheVersion = useSyncExternalStore(
    subscribeGelToUsdCache,
    getGelToUsdCacheVersion,
    () => 0,
  );

  const isGelAmountValid =
    Number.isFinite(pricePublic) &&
    pricePublic >= 0 &&
    pricePublic <= MAX_CONVERT_AMOUNT;

  const cachedUsdResponse =
    displayCurrency === "USD" && isGelAmountValid
      ? peekCachedGelToUsd(pricePublic)
      : undefined;

  void gelToUsdCacheVersion;

  useEffect(() => {
    if (displayCurrency !== "USD") {
      setFetchErrorMessage(null);
      return;
    }

    if (!isGelAmountValid) {
      setFetchErrorMessage("ამ ფასის კონვერტაცია შეუძლებელია.");
      return;
    }

    if (peekCachedGelToUsd(pricePublic)) {
      setFetchErrorMessage(null);
      return;
    }

    let isActive = true;
    setFetchErrorMessage(null);

    getCachedGelToUsd(pricePublic)
      .then(() => {
        if (!isActive) return;
        setFetchErrorMessage(null);
      })
      .catch((unknownError) => {
        if (!isActive) return;
        const message =
          unknownError instanceof ApiError
            ? unknownError.message
            : "დოლარის ფასის ჩატვირთვა ვერ მოხერხდა.";
        setFetchErrorMessage(message);
      });

    return () => {
      isActive = false;
    };
  }, [displayCurrency, pricePublic, isGelAmountValid]);

  let primaryLine: string;
  if (displayCurrency === "GEL") {
    primaryLine = `${pricePublic.toLocaleString()} ₾`;
  } else if (cachedUsdResponse) {
    primaryLine = usdCurrencyFormatter.format(cachedUsdResponse.result);
  } else {
    primaryLine = `${pricePublic.toLocaleString()} ₾`;
  }

  const showUsdError =
    displayCurrency === "USD" &&
    fetchErrorMessage &&
    (!isGelAmountValid || !cachedUsdResponse);
  const pricePerSquareMeter = calculatePricePerSquareMeter(
    pricePublic,
    areaSquareMeters,
  );

  return (
    <div className="min-w-0 flex-1 space-y-0.5">
      <div className="flex min-w-0 items-center gap-2">
        <p className="min-w-0 truncate text-2xl font-semibold tracking-tight text-foreground">
          {primaryLine}
        </p>
        <PropertyCatalogPriceCurrencyToggle />
      </div>
      {showUsdError ? (
        <p className="text-xs text-destructive" role="status">
          {fetchErrorMessage}
        </p>
      ) : null}
      {pricePerSquareMeter !== null ? (
        <p className="text-xs font-medium text-muted-foreground">
          {formatPricePerSquareMeter(pricePerSquareMeter)}
        </p>
      ) : null}
    </div>
  );
}
