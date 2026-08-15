"use client";

import Link from "next/link";
import type { ScoredClientMatch } from "@/features/matching/matchingApi.types";
import { MatchingCriteriaList } from "@/widgets/Matching/MatchingCriteriaList";
import { formatPreference } from "@/widgets/Matching/PropertyMatchCard";

type ClientMatchCardProps = {
  match: ScoredClientMatch;
};

export function ClientMatchCard({ match }: ClientMatchCardProps) {
  const client = match.client;
  const requirements = client.requirements;

  return (
    <article className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {client.dealType} · {client.status}
          </p>
          <p className="text-xs text-slate-500">
            {(client.districts ?? []).join(", ") || "No districts"}
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
          {match.matchPercentage}%
        </span>
      </div>
      <p className="text-sm text-slate-700">
        Budget: {client.budgetMin ?? "—"} – {client.budgetMax ?? "—"}
      </p>
      <p className="text-xs text-slate-600">
        Rooms {requirements.minRooms ?? "—"}–{requirements.maxRooms ?? "—"} · Area{" "}
        {requirements.minArea ?? "—"}–{requirements.maxArea ?? "—"} m² · Elevator{" "}
        {formatPreference(requirements.elevator)}
      </p>
      <p className="text-xs text-slate-600">
        Pets: {client.pet ? "Yes" : "No"}
      </p>
      <MatchingCriteriaList criteria={match.criteria} />
      <Link
        href={`/clients/${client.id}`}
        className="inline-flex text-sm font-medium text-slate-900 underline-offset-2 hover:underline"
      >
        Open client
      </Link>
    </article>
  );
}
