"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ManagingAgentSummary } from "@/features/agents/managingAgentSummary";
import { useManagingAgentDisplay } from "@/features/agents/useManagingAgentDisplay";

type RecordManagingAgentLineProps = {
  userId?: string | null;
  managingAgent?: ManagingAgentSummary | null;
  className?: string;
};

export function RecordManagingAgentLine({
  userId,
  managingAgent,
  className,
}: RecordManagingAgentLineProps) {
  const { isVisible, agentId, displayName, isLoading } = useManagingAgentDisplay({
    userId,
    managingAgent,
  });

  if (!isVisible) {
    return null;
  }

  const resolvedLabel = isLoading ? "იტვირთება…" : displayName ?? "—";
  const lineClassName = className ?? "text-sm text-muted-foreground";

  if (agentId && displayName) {
    return (
      <p className={lineClassName}>
        <span>აგენტი: </span>
        <Link
          href={`/agents/${agentId}`}
          className="inline-flex items-center gap-0.5 font-medium text-foreground underline-offset-2 hover:underline"
        >
          {resolvedLabel}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </p>
    );
  }

  return (
    <p className={lineClassName}>
      <span>აგენტი: </span>
      <span className="font-medium text-foreground">{resolvedLabel}</span>
    </p>
  );
}
