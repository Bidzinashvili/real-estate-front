"use client";

import { useRouter } from "next/navigation";
import { clientNoteHref } from "@/features/clientProfiles/clientProfileRoutes";
import {
  formatBudgetRange,
  formatClientNoteStatus,
  historyNoteArchivedLabel,
  historyNoteTitle,
  isHistoryNoteArchived,
  owningAgentDisplayName,
} from "@/features/clientProfiles/display";
import type { ClientProfileHistoryNote } from "@/features/clientProfiles/types";
import { formatLifecycleDate } from "@/features/lifecycle/formatLifecycleDate";
import { LifecycleStatusBadge } from "@/widgets/Lifecycle/LifecycleStatusBadge";
import { isClientStatus } from "@/features/clients/clientEnums";

type ClientProfileHistorySectionProps = {
  notes: ClientProfileHistoryNote[];
};

export function ClientProfileHistorySection({
  notes,
}: ClientProfileHistorySectionProps) {
  const router = useRouter();

  return (
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">
          კლიენტის მოთხოვნების ისტორია
        </h2>
        <span className="text-xs text-muted-foreground">{notes.length}</span>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        არქივში გადატანილი მოთხოვნებიც რჩება პროფილის ისტორიაში.
      </p>

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          ამ პროფილს მოთხოვნები არ აქვს.
        </p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => {
            const budgetLabel = formatBudgetRange(note.budgetMin, note.budgetMax);
            const createdLabel = formatLifecycleDate(note.createdAt);
            const statusLabel = formatClientNoteStatus(note.status);
            const archived = isHistoryNoteArchived(note);
            const agentName = owningAgentDisplayName(note.owningAgent);
            return (
              <li key={note.id}>
                <button
                  type="button"
                  onClick={() => router.push(clientNoteHref(note.id))}
                  className="flex w-full flex-col gap-1 rounded-lg border border-border bg-muted/40 px-4 py-3 text-left transition hover:bg-muted"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {historyNoteTitle(note)}
                    </span>
                    {note.status && isClientStatus(note.status) ? (
                      <LifecycleStatusBadge
                        kind="client"
                        status={note.status}
                        size="sm"
                      />
                    ) : statusLabel ? (
                      <span className="text-xs text-muted-foreground">
                        {statusLabel}
                      </span>
                    ) : null}
                    {archived ? (
                      <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {historyNoteArchivedLabel()}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    {note.name?.trim() ? <span>{note.name.trim()}</span> : null}
                    {budgetLabel ? <span>{budgetLabel}</span> : null}
                    {createdLabel ? <span>{createdLabel}</span> : null}
                    {agentName ? <span>აგენტი: {agentName}</span> : null}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
