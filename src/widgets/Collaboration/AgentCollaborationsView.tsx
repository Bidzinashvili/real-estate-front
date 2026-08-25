"use client";

import { useMemo, useState } from "react";
import { useCollaborationsList } from "@/features/collaboration/useCollaborationsList";
import type { CollaborationStatusGroup } from "@/features/collaboration/collaborationEnums";
import type { CollaborationRequestDto } from "@/features/collaboration/collaborationApi.types";
import { CollaborationRequestCard } from "@/widgets/Collaboration/CollaborationRequestCard";

type AgentTabId = "incoming" | "sent" | "waitingAdmin" | "approved" | "rejected";

const AGENT_TABS: { id: AgentTabId; label: string }[] = [
  { id: "incoming", label: "შემოსული" },
  { id: "sent", label: "გაგზავნილი" },
  { id: "waitingAdmin", label: "ადმინის დასტურს ელოდება" },
  { id: "approved", label: "დამტკიცებულია" },
  { id: "rejected", label: "უარყოფილია" },
];

function statusGroupForTab(tabId: AgentTabId): CollaborationStatusGroup {
  if (tabId === "incoming" || tabId === "sent") {
    return "PENDING";
  }
  if (tabId === "waitingAdmin") {
    return "WAITING_ADMIN";
  }
  if (tabId === "approved") {
    return "APPROVED";
  }
  return "REJECTED";
}

function filterRowsForTab(
  tabId: AgentTabId,
  collaborations: CollaborationRequestDto[],
): CollaborationRequestDto[] {
  if (tabId === "incoming") {
    return collaborations.filter((item) => item.viewerRole === "RECIPIENT");
  }
  if (tabId === "sent") {
    return collaborations.filter(
      (item) => item.viewerRole === "REQUESTER" || item.viewerRole === "ADDITIONAL",
    );
  }
  return collaborations;
}

export function AgentCollaborationsView() {
  const [tabId, setTabId] = useState<AgentTabId>("incoming");
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useCollaborationsList({
    mode: "agent",
    query: {
      statusGroup: statusGroupForTab(tabId),
      page,
      limit: 20,
    },
    pollIntervalMs: 45_000,
  });

  const rows = useMemo(
    () => filterRowsForTab(tabId, data?.collaborations ?? []),
    [tabId, data],
  );
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / (data?.limit || 20)));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">თანამშრომლობა</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          შემოსული მოთხოვნები, გაგზავნილი მოთხოვნები და დამტკიცების სტატუსი.
        </p>
      </div>

      <div className="flex flex-wrap gap-1 rounded-full bg-muted/80 p-1">
        {AGENT_TABS.map((tabItem) => (
          <button
            key={tabItem.id}
            type="button"
            onClick={() => {
              setTabId(tabItem.id);
              setPage(1);
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              tabId === tabItem.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">მოთხოვნები იტვირთება…</p> : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {!isLoading && !error && rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">თანამშრომლობის მოთხოვნები არ არის.</p>
      ) : null}
      {!isLoading && !error && rows.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {rows.map((collaboration) => (
            <CollaborationRequestCard
              key={collaboration.id}
              collaboration={collaboration}
              href={`/collaborations/${collaboration.id}`}
            />
          ))}
        </div>
      ) : null}

      {data && data.total > 0 ? (
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            გვერდი {data.page} / {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={data.page <= 1}
              onClick={() => setPage(data.page - 1)}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              წინა
            </button>
            <button
              type="button"
              disabled={data.page >= totalPages}
              onClick={() => setPage(data.page + 1)}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              შემდეგი
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
