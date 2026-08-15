"use client";

import Link from "next/link";
import type { ScoredPropertyMatch } from "@/features/matching/matchingApi.types";
import { getMatchImageUrl } from "@/features/matching/matchImageUrl";
import { MatchingCriteriaList } from "@/widgets/Matching/MatchingCriteriaList";
import {
  CLIENT_PREFERENCE_LABELS,
  isClientPreferenceValue,
} from "@/features/matching/matchingEnums";

type PropertyMatchCardProps = {
  match: ScoredPropertyMatch;
};

function formatPreference(value: string | boolean | null | undefined): string {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
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
    <article className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-40 w-full object-cover" />
      ) : (
        <div className="flex h-40 items-center justify-center bg-slate-100 text-xs text-slate-500">
          No photo
        </div>
      )}
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {listing.address}
              {listing.city ? `, ${listing.city}` : ""}
            </p>
            <p className="text-xs text-slate-500">
              {listing.district} · {listing.dealType} · {listing.status}
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
            {match.matchPercentage}%
          </span>
        </div>
        {apartment ? (
          <p className="text-xs text-slate-600">
            {apartment.rooms ?? "—"} rooms · {apartment.totalArea ?? "—"} m² · floor{" "}
            {apartment.floor ?? "—"}
          </p>
        ) : null}
        <p className="text-sm font-medium text-slate-800">
          {listing.pricePublic.toLocaleString()}
        </p>
        <MatchingCriteriaList criteria={match.criteria} />
        <Link
          href={`/properties/${listing.id}`}
          className="inline-flex text-sm font-medium text-slate-900 underline-offset-2 hover:underline"
        >
          Open listing
        </Link>
      </div>
    </article>
  );
}

export { formatPreference };
