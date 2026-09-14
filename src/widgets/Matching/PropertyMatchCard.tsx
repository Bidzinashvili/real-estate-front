"use client";

import Link from "next/link";
import type { ScoredPropertyMatch } from "@/features/matching/matchingApi.types";
import { getMatchImageUrl } from "@/features/matching/matchImageUrl";
import { MatchingCriteriaList } from "@/widgets/Matching/MatchingCriteriaList";
import { MatchingScoreSummary } from "@/widgets/Matching/MatchingScoreSummary";
import { RequestCollaborationButton } from "@/widgets/Collaboration/RequestCollaborationButton";
import { PropertyMatchWhatsAppButton } from "@/widgets/PropertyShare/PropertyMatchWhatsAppButton";
import { HidePropertyMatchButton } from "@/widgets/Matching/HidePropertyMatchButton";
import {
  CLIENT_PREFERENCE_LABELS,
  isClientPreferenceValue,
} from "@/features/matching/matchingEnums";
import { DEAL_TYPE_LABELS, lookupEnumLabel } from "@/shared/i18n/enumLabels";
import { LifecycleStatusBadge } from "@/widgets/Lifecycle/LifecycleStatusBadge";
import { isPropertyStatus } from "@/features/properties/propertyStatus";
import { formatAreaSquareMeters } from "@/features/properties/propertyArea";

type PropertyMatchCardProps = {
  match: ScoredPropertyMatch;
  clientId?: string;
  canShareToClient?: boolean;
  sharePhones?: string[];
  canHideProperty?: boolean;
  isHidePending?: boolean;
  onHideProperty?: (propertyId: string) => void;
  canRequestCollaboration?: boolean;
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

export function PropertyMatchCard({
  match,
  clientId,
  canShareToClient = false,
  sharePhones = [],
  canHideProperty = false,
  isHidePending = false,
  onHideProperty,
  canRequestCollaboration = true,
}: PropertyMatchCardProps) {
  const listing = match.property;
  const apartment = listing.apartment;
  const imageUrl = getMatchImageUrl(listing.images);
  const apartmentSummary = apartment
    ? [
        apartment.rooms != null ? `${apartment.rooms} ოთახი` : null,
        formatAreaSquareMeters(apartment.totalArea),
        apartment.floor != null ? `სართული ${apartment.floor}` : null,
      ]
        .filter((part): part is string => part !== null && part !== "")
        .join(" · ")
    : "";

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
            {listing.ourSiteId?.trim() ? (
              <p className="text-xs text-muted-foreground">ID: {listing.ourSiteId.trim()}</p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {listing.district} · {lookupEnumLabel(DEAL_TYPE_LABELS, listing.dealType)}
            </p>
            {isPropertyStatus(listing.status) ? (
              <div className="mt-1">
                <LifecycleStatusBadge kind="property" status={listing.status} size="sm" />
              </div>
            ) : null}
          </div>
          <MatchingScoreSummary
            matchPercentage={match.matchPercentage}
            matchedCriteriaCount={match.matchedCriteriaCount}
            scoredCriteriaCount={match.scoredCriteriaCount}
            criteria={match.criteria}
          />
        </div>
        {apartmentSummary ? (
          <p className="text-xs text-muted-foreground">{apartmentSummary}</p>
        ) : null}
        <p className="text-sm font-medium text-foreground">
          {listing.pricePublic.toLocaleString()}
        </p>
        {listing.publicComment?.trim() ? (
          <p className="line-clamp-3 text-xs text-muted-foreground">
            {listing.publicComment.trim()}
          </p>
        ) : null}
        <MatchingCriteriaList criteria={match.criteria} />
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/properties/${listing.id}`}
            className="inline-flex text-sm font-medium text-foreground underline-offset-2 hover:underline"
          >
            განცხადების გახსნა
          </Link>
          {canShareToClient ? (
            <PropertyMatchWhatsAppButton
              propertyId={listing.id}
              dealType={listing.dealType}
              propertyType={listing.propertyType}
              district={listing.district}
              city={listing.city}
              listingStatus={listing.status}
              phones={sharePhones}
            />
          ) : null}
          <RequestCollaborationButton
            propertyId={listing.id}
            clientId={clientId}
            canRequest={canRequestCollaboration}
          />
          {canHideProperty && onHideProperty ? (
            <HidePropertyMatchButton
              isPending={isHidePending}
              onHide={() => onHideProperty(listing.id)}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}

export { formatPreference };
