"use client";

import { useState } from "react";
import Link from "next/link";
import { useCollaborationsList } from "@/features/collaboration/useCollaborationsList";
import { useAdminMonitorsList } from "@/features/collaboration/useAdminMonitors";
import type { CollaborationStatusGroup } from "@/features/collaboration/collaborationEnums";
import {
  COLLABORATION_SPLIT_LABELS,
  MONITORING_STATE_LABELS,
} from "@/features/collaboration/collaborationLabels";
import { CollaborationRequestCard } from "@/widgets/Collaboration/CollaborationRequestCard";
import { CollaborationStatusBadge } from "@/widgets/Collaboration/CollaborationStatusBadge";

type AdminTabId = "waitingAdmin" | "approved" | "rejected" | "notebook";

const ADMIN_TABS: { id: AdminTabId; label: string }[] = [
  { id: "waitingAdmin", label: "დასამტკიცებელი" },
  { id: "approved", label: "დამტკიცებულია" },
  { id: "rejected", label: "უარყოფილია" },
  { id: "notebook", label: "ნოუთბუქი" },
];

function statusGroupForTab(tabId: Exclude<AdminTabId, "notebook">): CollaborationStatusGroup {
  if (tabId === "waitingAdmin") {
    return "WAITING_ADMIN";
  }
  if (tabId === "approved") {
    return "APPROVED";
  }
  return "REJECTED";
}

export function AdminCollaborationsView() {
  const [tabId, setTabId] = useState<AdminTabId>("waitingAdmin");
  const [page, setPage] = useState(1);
  const isNotebook = tabId === "notebook";
  const list = useCollaborationsList({
    enabled: !isNotebook,
    mode: "admin",
    query: {
      statusGroup: isNotebook ? undefined : statusGroupForTab(tabId),
      page,
      limit: 20,
    },
    pollIntervalMs: tabId === "waitingAdmin" ? 45_000 : undefined,
  });
  const monitors = useAdminMonitorsList({
    enabled: isNotebook,
    page,
    limit: 20,
  });

  const isLoading = isNotebook ? monitors.isLoading : list.isLoading;
  const error = isNotebook ? monitors.error : list.error;
  const total = isNotebook ? monitors.data?.total ?? 0 : list.data?.total ?? 0;
  const currentPage = isNotebook ? monitors.data?.page ?? page : list.data?.page ?? page;
  const limit = isNotebook ? monitors.data?.limit ?? 20 : list.data?.limit ?? 20;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">თანამშრომლობა — ადმინი</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          მიღებული მოთხოვნების დამტკიცება და განცხადებების მონიტორინგი.
        </p>
      </div>

      <div className="flex flex-wrap gap-1 rounded-full bg-muted/80 p-1">
        {ADMIN_TABS.map((tabItem) => (
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

      {isLoading ? <p className="text-sm text-muted-foreground">ჩანაწერები იტვირთება…</p> : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {!isNotebook && !isLoading && !error && (list.data?.collaborations.length ?? 0) === 0 ? (
        <p className="text-sm text-muted-foreground">თანამშრომლობის მოთხოვნები არ არის.</p>
      ) : null}

      {!isNotebook && !isLoading && !error && (list.data?.collaborations.length ?? 0) > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {list.data?.collaborations.map((collaboration) => (
            <CollaborationRequestCard
              key={collaboration.id}
              collaboration={collaboration}
              href={`/collaborations/${collaboration.id}`}
            />
          ))}
        </div>
      ) : null}

      {isNotebook && !isLoading && !error && (monitors.data?.monitors.length ?? 0) === 0 ? (
        <p className="text-sm text-muted-foreground">მონიტორინგის ჩანაწერები არ არის.</p>
      ) : null}

      {isNotebook && !isLoading && !error && (monitors.data?.monitors.length ?? 0) > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {monitors.data?.monitors.map((monitor) => (
            <article
              key={monitor.id}
              className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {monitor.property.address}
                    {monitor.property.city ? `, ${monitor.property.city}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{monitor.property.district}</p>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
                  {MONITORING_STATE_LABELS[monitor.monitoringState]}
                </span>
              </div>
              <p className="text-sm text-foreground">
                {COLLABORATION_SPLIT_LABELS[monitor.split]}
              </p>
              <CollaborationStatusBadge status={monitor.collaboration.status} />
              <p className="text-xs text-muted-foreground">
                ეს აგენტები გააცნეს ერთმანეთს ამ განცხადებაზე თანამშრომლობისთვის. განცხადება უნდა
                კონტროლდებოდეს, გაიყიდება თუ გაიქირავება.
              </p>
              <Link
                href={`/collaborations/monitors/${monitor.id}`}
                className="inline-flex text-sm font-medium text-foreground underline-offset-2 hover:underline"
              >
                ჩანაწერის ნახვა
              </Link>
            </article>
          ))}
        </div>
      ) : null}

      {total > 0 ? (
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            გვერდი {currentPage} / {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              წინა
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
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
