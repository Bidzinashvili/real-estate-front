"use client";

import { useEffect, useState } from "react";
import { DollarSign, Loader2 } from "lucide-react";
import { getCachedUsdRate } from "@/features/currency/usdRateCache";
import type { UsdRateResponse } from "@/features/currency/types";
import { formatTbilisiDateTime } from "@/shared/lib/formatDate";
import { StatCard } from "@/shared/ui/StatCard";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { typography } from "@/shared/ui/typography";

const gelAmountFormatter = new Intl.NumberFormat("ka-GE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

export function DashboardUsdRateCard() {
  const [rateData, setRateData] = useState<UsdRateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    void getCachedUsdRate()
      .then((response) => {
        if (!cancelled) {
          setRateData(response);
        }
      })
      .catch((errorUnknown: unknown) => {
        if (!cancelled) {
          const message =
            errorUnknown instanceof Error
              ? errorUnknown.message
              : "კურსის ჩატვირთვა ვერ მოხერხდა.";
          setError(message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <SurfaceCard padding="sm" className="flex max-w-md items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        USD კურსი…
      </SurfaceCard>
    );
  }

  if (error || !rateData) {
    return (
      <StatCard
        className="max-w-md"
        label="USD / GEL"
        value={<span className="text-sm font-normal text-destructive">მიუწვდომელია</span>}
        icon={<DollarSign className="h-4 w-4" aria-hidden />}
      />
    );
  }

  const formattedUnitRate = gelAmountFormatter.format(rateData.unitRate);
  const formattedDate = formatTbilisiDateTime(rateData.date) || rateData.date;
  const sourceLabel = rateData.source?.trim();
  const isStale = rateData.stale === true;
  const hintParts = [`განახლებულია: ${formattedDate}`];
  if (sourceLabel) {
    hintParts.push(sourceLabel);
  }
  if (isStale) {
    hintParts.push("ბოლო ხელმისაწვდომი კურსი");
  }

  return (
    <StatCard
      className="max-w-md"
      label="USD / GEL"
      value={
        <span className={typography.pricePrimary}>
          1 USD = {formattedUnitRate} ₾
        </span>
      }
      hint={hintParts.join(" · ")}
      icon={<DollarSign className="h-4 w-4" aria-hidden />}
    />
  );
}
