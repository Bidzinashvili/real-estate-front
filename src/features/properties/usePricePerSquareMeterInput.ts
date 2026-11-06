"use client";

import { useState } from "react";
import { calculatePricePerSquareMeter } from "@/features/properties/pricePerSquareMeter";

/** Total price from a price per m² (myhome-style two-way price entry). */
export function calculateTotalFromPricePerSquareMeter(
  pricePerSquareMeter: number | null,
  areaSquareMeters: number | null,
): number | null {
  if (
    pricePerSquareMeter === null ||
    areaSquareMeters === null ||
    !Number.isFinite(pricePerSquareMeter) ||
    !Number.isFinite(areaSquareMeters) ||
    areaSquareMeters <= 0
  ) {
    return null;
  }
  return Math.round(pricePerSquareMeter * areaSquareMeters);
}

function parsePositive(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Controlled "1 მ² ფასი" input for string-based forms.
 * - typing the m² price writes total = round(m² × area) via `onTotalChange`
 * - typing the total (elsewhere) or changing the area re-derives the m² price
 * While the agent is typing here, their raw text is kept as long as neither
 * the total nor the area changed underneath it.
 */
export function usePricePerSquareMeterInput(options: {
  totalPrice: number | null;
  areaSquareMeters: number | null;
  onTotalChange: (nextTotalInput: string) => void;
}) {
  const { totalPrice, areaSquareMeters, onTotalChange } = options;
  const [draft, setDraft] = useState<{
    input: string;
    total: number | null;
    area: number | null;
  } | null>(null);

  const derived = calculatePricePerSquareMeter(totalPrice, areaSquareMeters);
  const draftStillValid =
    draft !== null &&
    draft.total === totalPrice &&
    draft.area === areaSquareMeters;

  const value = draftStillValid
    ? draft.input
    : derived === null
      ? ""
      : String(derived);

  function onChange(raw: string) {
    const nextTotal = calculateTotalFromPricePerSquareMeter(
      parsePositive(raw),
      areaSquareMeters,
    );
    setDraft({ input: raw, total: nextTotal, area: areaSquareMeters });
    onTotalChange(nextTotal === null ? "" : String(nextTotal));
  }

  return {
    value,
    onChange,
    disabled: areaSquareMeters === null,
  };
}
