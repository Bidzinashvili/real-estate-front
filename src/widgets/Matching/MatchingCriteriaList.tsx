"use client";

import type { LucideIcon } from "lucide-react";
import { CheckCircle2, CircleHelp, LockKeyhole, XCircle } from "lucide-react";
import type { MatchCriterionDto } from "@/features/matching/matchingApi.types";
import type { CriterionResult } from "@/features/matching/matchingEnums";
import { formatCriterionLabel } from "@/features/matching/criterionLabels";
import { CRITERION_RESULT_LABELS } from "@/shared/i18n/enumLabels";
import { ui } from "@/shared/i18n/ui";

type MatchingCriteriaListProps = {
  criteria: MatchCriterionDto[];
};

const STATUS_BADGE_BASE =
  "inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-tight";

const RESULT_BADGE_STYLES: Record<
  CriterionResult,
  { className: string; Icon: LucideIcon; label: string }
> = {
  MATCH: {
    className: `${STATUS_BADGE_BASE} border-success/25 bg-success-muted text-success-foreground`,
    Icon: CheckCircle2,
    label: CRITERION_RESULT_LABELS.MATCH,
  },
  MISMATCH: {
    className: `${STATUS_BADGE_BASE} border-destructive/25 bg-destructive/10 text-destructive`,
    Icon: XCircle,
    label: CRITERION_RESULT_LABELS.MISMATCH,
  },
  SKIP: {
    className: `${STATUS_BADGE_BASE} border-warning/30 bg-warning-muted text-warning-foreground`,
    Icon: CircleHelp,
    label: CRITERION_RESULT_LABELS.SKIP,
  },
};

function CriterionStatusBadge({
  result,
}: {
  result: CriterionResult;
}) {
  const badge = RESULT_BADGE_STYLES[result];
  if (!badge) {
    return null;
  }

  const StatusIcon = badge.Icon;

  return (
    <span className={badge.className}>
      <StatusIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="min-w-0 break-words">{badge.label}</span>
    </span>
  );
}

function HardLockBadge() {
  return (
    <span
      className={`${STATUS_BADGE_BASE} border-primary/25 bg-primary/10 text-primary`}
    >
      <LockKeyhole className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="min-w-0 break-words">{ui.hardLock}</span>
    </span>
  );
}

export function MatchingCriteriaList({ criteria }: MatchingCriteriaListProps) {
  if (criteria.length === 0) {
    return <p className="text-xs text-muted-foreground">შეფასებული კრიტერიუმები არ არის.</p>;
  }

  return (
    <ul className="divide-y divide-border/70">
      {criteria.map((criterion) => (
        <li
          key={`${criterion.key}-${criterion.result}`}
          className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0"
        >
          <span className="min-w-0 flex-1 text-xs leading-5 text-foreground">
            {formatCriterionLabel(criterion.key)}
          </span>
          <span className="flex min-w-0 max-w-[60%] flex-wrap justify-end gap-1">
            <CriterionStatusBadge result={criterion.result} />
            {criterion.hardLocked ? <HardLockBadge /> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
