"use client";

import Link from "next/link";
import type { ScoredClientMatch } from "@/features/matching/matchingApi.types";
import { MatchingCriteriaList } from "@/widgets/Matching/MatchingCriteriaList";
import { MatchingScoreSummary } from "@/widgets/Matching/MatchingScoreSummary";
import { formatPreference } from "@/widgets/Matching/PropertyMatchCard";
import { RequestCollaborationButton } from "@/widgets/Collaboration/RequestCollaborationButton";
import {
  DEAL_TYPE_LABELS,
  lookupEnumLabel,
} from "@/shared/i18n/enumLabels";
import { LifecycleStatusBadge } from "@/widgets/Lifecycle/LifecycleStatusBadge";
import { isClientStatus } from "@/features/clients/clientEnums";

type ClientMatchCardProps = {
  match: ScoredClientMatch;
  propertyId: string;
};

export function ClientMatchCard({ match, propertyId }: ClientMatchCardProps) {
  const client = match.client;
  const requirements = client.requirements;

  return (
    <article className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {lookupEnumLabel(DEAL_TYPE_LABELS, client.dealType)}
          </p>
          {isClientStatus(client.status) ? (
            <div className="mt-1">
              <LifecycleStatusBadge kind="client" status={client.status} size="sm" />
            </div>
          ) : null}
          <p className="text-xs text-muted-foreground">
            {(client.districts ?? []).join(", ") || "უბნები არ არის"}
          </p>
        </div>
        <MatchingScoreSummary
          matchPercentage={match.matchPercentage}
          matchedCriteriaCount={match.matchedCriteriaCount}
          scoredCriteriaCount={match.scoredCriteriaCount}
          criteria={match.criteria}
        />
      </div>
      <p className="text-sm text-foreground">
        ბიუჯეტი: {client.budgetMin ?? "—"} – {client.budgetMax ?? "—"}
      </p>
      <p className="text-xs text-muted-foreground">
        ოთახები {requirements.minRooms ?? "—"}–{requirements.maxRooms ?? "—"} · ფართობი{" "}
        {requirements.minArea ?? "—"}–{requirements.maxArea ?? "—"} მ² · ლიფტი{" "}
        {formatPreference(requirements.elevator)}
      </p>
      <p className="text-xs text-muted-foreground">
        შინაური ცხოველები: {client.pet ? "კი" : "არა"}
      </p>
      <MatchingCriteriaList criteria={match.criteria} />
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/clients/${client.id}`}
          className="inline-flex text-sm font-medium text-foreground underline-offset-2 hover:underline"
        >
          კლიენტის გახსნა
        </Link>
        <RequestCollaborationButton propertyId={propertyId} clientId={client.id} />
      </div>
    </article>
  );
}
