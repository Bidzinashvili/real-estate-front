"use client";

import { CheckCircle2, LockKeyhole, XCircle } from "lucide-react";
import type { MatchCriterionDto } from "@/features/matching/matchingApi.types";
import { ui } from "@/shared/i18n/ui";

type MatchingScoreSummaryProps = {
  matchPercentage: number;
  matchedCriteriaCount: number;
  scoredCriteriaCount: number;
  criteria: MatchCriterionDto[];
};

export function MatchingScoreSummary({
  matchPercentage,
  matchedCriteriaCount,
  scoredCriteriaCount,
  criteria,
}: MatchingScoreSummaryProps) {
  const mismatchCountFromCriteria = criteria.filter(
    (criterion) => criterion.result === "MISMATCH",
  ).length;
  const mismatchCount =
    criteria.length > 0
      ? mismatchCountFromCriteria
      : Math.max(0, scoredCriteriaCount - matchedCriteriaCount);
  const hardLockedCount = criteria.filter((criterion) => criterion.hardLocked).length;

  return (
    <div className="flex min-w-0 max-w-full flex-col items-end gap-2">
      <div className="text-right">
        <p className="text-2xl font-semibold leading-none tracking-tight text-primary tabular-nums">
          {matchPercentage}%
        </p>
        <p className="mt-1 text-[11px] font-medium text-primary">{ui.matchFit}</p>
      </div>
      <ul className="flex max-w-full flex-wrap justify-end gap-x-2.5 gap-y-1">
        <li className="inline-flex items-center gap-1 text-[11px] font-medium text-success-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
          {matchedCriteriaCount} {ui.matchedCount}
        </li>
        <li className="inline-flex items-center gap-1 text-[11px] font-medium text-destructive">
          <XCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {mismatchCount} {ui.mismatchedCount}
        </li>
        <li className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
          <LockKeyhole className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {hardLockedCount} {ui.hardLock}
        </li>
      </ul>
    </div>
  );
}
