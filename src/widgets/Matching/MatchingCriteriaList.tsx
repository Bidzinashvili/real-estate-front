"use client";

import type { MatchCriterionDto } from "@/features/matching/matchingApi.types";
import { formatCriterionLabel } from "@/features/matching/criterionLabels";
import { CRITERION_RESULT_LABELS } from "@/shared/i18n/enumLabels";

type MatchingCriteriaListProps = {
  criteria: MatchCriterionDto[];
};

export function MatchingCriteriaList({ criteria }: MatchingCriteriaListProps) {
  if (criteria.length === 0) {
    return <p className="text-xs text-muted-foreground">შეფასებული კრიტერიუმები არ არის.</p>;
  }

  return (
    <ul className="space-y-1">
      {criteria.map((criterion) => (
        <li
          key={`${criterion.key}-${criterion.result}`}
          className="flex items-center justify-between gap-2 text-xs"
        >
          <span className="text-foreground">{formatCriterionLabel(criterion.key)}</span>
          <span
            className={
              criterion.result === "MATCH"
                ? "font-medium text-success"
                : criterion.result === "SKIP"
                  ? "font-medium text-muted-foreground"
                  : "font-medium text-destructive"
            }
          >
            {CRITERION_RESULT_LABELS[criterion.result] ?? criterion.result}
            {criterion.hardLocked ? " · მკაცრი პირობა" : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}
