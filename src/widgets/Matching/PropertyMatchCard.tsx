"use client";

import Link from "next/link";
import type { ScoredPropertyMatch } from "@/features/matching/matchingApi.types";
import { getMatchImageUrl } from "@/features/matching/matchImageUrl";
import { MatchingCriteriaList } from "@/widgets/Matching/MatchingCriteriaList";
import { MatchingScoreSummary } from "@/widgets/Matching/MatchingScoreSummary";
import {
  CLIENT_PREFERENCE_LABELS,
  isClientPreferenceValue,
} from "@/features/matching/matchingEnums";
import { DEAL_TYPE_LABELS, lookupEnumLabel, PROPERTY_STATUS_LABELS } from "@/shared/i18n/enumLabels";

type PropertyMatchCardProps = {
  match: ScoredPropertyMatch;
};

function formatPreference(value: string | boolean | null | undefined): string {
  if (typeof value === "boolean") {
    return value ? "კი" : "არა";
  }
  if (typeof value === "string" && isClientPreferenceValue(value)) {
    return CLIENT_PREFERENCE_LABELS[value];
  }
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return String(value);
}

export function PropertyMatchCard({ match }: PropertyMatchCardProps) {
  const listing = match.property;
  const apartment = listing.apartment;
  const imageUrl = getMatchImageUrl(listing.images);

  return (
    <article className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-40 w-full object-cover" />
      ) : (
        <div className="flex h-40 items-center justify-center bg-muted text-xs text-muted-foreground">
          ფოტო არ არის
        </div>
      )}
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {listing.address}
              {listing.city ? `, ${listing.city}` : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              {listing.district} · {lookupEnumLabel(DEAL_TYPE_LABELS, listing.dealType)} ·{" "}
              {lookupEnumLabel(PROPERTY_STATUS_LABELS, listing.status)}
            </p>
          </div>
          <MatchingScoreSummary
            matchPercentage={match.matchPercentage}
            matchedCriteriaCount={match.matchedCriteriaCount}
            scoredCriteriaCount={match.scoredCriteriaCount}
            criteria={match.criteria}
          />
        </div>
        {apartment ? (
          <p className="text-xs text-muted-foreground">
            {apartment.rooms ?? "—"} ოთახი · {apartment.totalArea ?? "—"} მ² · სართული{" "}
            {apartment.floor ?? "—"}
          </p>
        ) : null}
        <p className="text-sm font-medium text-foreground">
          {listing.pricePublic.toLocaleString()}
        </p>
        <MatchingCriteriaList criteria={match.criteria} />
        <Link
          href={`/properties/${listing.id}`}
          className="inline-flex text-sm font-medium text-foreground underline-offset-2 hover:underline"
        >
          განცხადების გახსნა
        </Link>
      </div>
    </article>
  );
}

export { formatPreference };
