"use client";

import Link from "next/link";
import type { ScoredClientMatch } from "@/features/matching/matchingApi.types";
import { MatchingCriteriaList } from "@/widgets/Matching/MatchingCriteriaList";
import { formatPreference } from "@/widgets/Matching/PropertyMatchCard";
import {
  CLIENT_STATUS_LABELS,
  DEAL_TYPE_LABELS,
  lookupEnumLabel,
} from "@/shared/i18n/enumLabels";
import { formatCriteriaMatchSummary } from "@/shared/i18n/ui";

type ClientMatchCardProps = {
  match: ScoredClientMatch;
};

export function ClientMatchCard({ match }: ClientMatchCardProps) {
  const client = match.client;
  const requirements = client.requirements;

  return (
    <article className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {lookupEnumLabel(DEAL_TYPE_LABELS, client.dealType)} ·{" "}
            {lookupEnumLabel(CLIENT_STATUS_LABELS, client.status)}
          </p>
          <p className="text-xs text-muted-foreground">
            {(client.districts ?? []).join(", ") || "უბნები არ არის"}
          </p>
        </div>
        <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
          {match.matchPercentage}%
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        {formatCriteriaMatchSummary(match.matchedCriteriaCount, match.scoredCriteriaCount)}
      </p>
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
      <Link
        href={`/clients/${client.id}`}
        className="inline-flex text-sm font-medium text-foreground underline-offset-2 hover:underline"
      >
        კლიენტის გახსნა
      </Link>
    </article>
  );
}
