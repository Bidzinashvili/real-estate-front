"use client";

import type { MatchCriterionDto } from "@/features/matching/matchingApi.types";
import { formatCriterionLabel } from "@/features/matching/criterionLabels";

type MatchingCriteriaListProps = {
  criteria: MatchCriterionDto[];
};

export function MatchingCriteriaList({ criteria }: MatchingCriteriaListProps) {
  if (criteria.length === 0) {
    return <p className="text-xs text-slate-500">No scored criteria.</p>;
  }

  return (
    <ul className="space-y-1">
      {criteria.map((criterion) => (
        <li
          key={`${criterion.key}-${criterion.result}`}
          className="flex items-center justify-between gap-2 text-xs"
        >
          <span className="text-slate-700">{formatCriterionLabel(criterion.key)}</span>
          <span
            className={
              criterion.result === "MATCH"
                ? "font-medium text-emerald-700"
                : "font-medium text-rose-700"
            }
          >
            {criterion.result === "MATCH" ? "Match" : "Mismatch"}
            {criterion.hardLocked ? " · hard lock" : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}
