"use client";

import type { MouseEvent } from "react";
import { Bell, Eye, MapPin } from "lucide-react";
import { canRunClientMatches } from "@/features/matching/canRunClientMatches";
import { clientMatchesHref } from "@/features/matching/matchingRoutes";
import { ui } from "@/shared/i18n/ui";
import { MatchPercentActions } from "@/widgets/Matching/MatchPercentActions";
import { LifecycleStatusBadge } from "@/widgets/Lifecycle/LifecycleStatusBadge";
import { formatLifecycleDate } from "@/features/lifecycle/formatLifecycleDate";
import { ClientRowArchiveActions } from "@/widgets/Clients/ClientRowArchiveActions";
import type { Client } from "@/features/clients/types";
import { ClientProfileCompactIndicator } from "@/widgets/ClientProfiles/ClientProfileCompactIndicator";
import { NoteReminderIndicator } from "@/widgets/Reminders/NoteReminderIndicator";
import { DEAL_TYPE_LABELS } from "@/features/clients/clientEnums";
import { isPrivacySafeSharedClient } from "@/features/databaseList/viewerOwnership";
import {
  clientCompactStats,
  formatBudgetRange,
  formatClientLocationLine,
  formatSharedClientHeadline,
} from "@/features/clients/formatSharedClientCriteria";
import {
  canEditRecordColor,
  isCustomRecordColor,
  type RecordColor,
} from "@/features/recordColor/recordColor";
import { recordColorSurfaceClassName } from "@/features/recordColor/recordColorSurface";
import { useUpdateRecordColor } from "@/features/recordColor/useUpdateRecordColor";
import { RecordColorPicker } from "@/widgets/RecordColor/RecordColorPicker";
import { HideFromOthersBadge } from "@/widgets/HideFromOthers/HideFromOthersBadge";
import { HideFromOthersToggle } from "@/widgets/HideFromOthers/HideFromOthersToggle";
import { useUpdateHideFromOthers } from "@/features/hideFromOthers/useUpdateHideFromOthers";
import { ClosedRecordStatChips } from "@/widgets/DatabaseList/ClosedRecordStatChips";
import { RecordTimestamp } from "@/widgets/RecordTimestamp/RecordTimestamp";
import { cn } from "@/shared/lib/utils";

type ClientListCardProps = {
  client: Client;
  isArchiveScope: boolean;
  canManage: boolean;
  canOpenDetail: boolean;
  currentUser: { id: string; role: "ADMIN" | "AGENT" } | null;
  onOpenDetail: (clientId: string) => void;
  onOpenReminder: (clientId: string) => void;
  onChanged: () => void;
};

export function ClientListCard({
  client,
  isArchiveScope,
  canManage,
  canOpenDetail,
  currentUser,
  onOpenDetail,
  onOpenReminder,
  onChanged,
}: ClientListCardProps) {
  const isSharedRow = isPrivacySafeSharedClient(client);
  const generatedTitle = formatSharedClientHeadline(client);
  const budgetLabel = formatBudgetRange(client.budgetMin, client.budgetMax);
  const locationLine = formatClientLocationLine(client);
  const compactStats = clientCompactStats(client);
  const phoneLine = isSharedRow ? "" : (client.phones[0] ?? "");
  const { saveColor, isSaving: isSavingColor, error: colorError } =
    useUpdateRecordColor();
  const {
    saveHideFromOthers,
    isSaving: isSavingHideFromOthers,
    error: hideFromOthersError,
  } = useUpdateHideFromOthers();
  const canEditColor = canEditRecordColor(canManage, client.color);
  const hasCustomColor = isCustomRecordColor(client.color);

  async function handleSelectColor(nextColor: RecordColor) {
    if (client.color === undefined) {
      return;
    }
    try {
      await saveColor("client", client.id, nextColor);
      onChanged();
    } catch {
      return;
    }
  }

  async function handleToggleHideFromOthers(nextHidden: boolean) {
    if (!canManage) {
      return;
    }
    try {
      await saveHideFromOthers("client", client.id, nextHidden);
      onChanged();
    } catch {
      return;
    }
  }

  function stopCardOpen(event: MouseEvent) {
    event.stopPropagation();
  }

  return (
    <article
      onClick={canOpenDetail ? () => onOpenDetail(client.id) : undefined}
      className={cn(
        "flex min-w-0 w-full flex-col overflow-hidden rounded-3xl p-3 shadow-sm ring-1 transition-shadow hover:shadow-md",
        canOpenDetail ? "cursor-pointer" : "",
        hasCustomColor
          ? recordColorSurfaceClassName(client.color)
          : "bg-card ring-border",
      )}
    >
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
            {DEAL_TYPE_LABELS[client.dealType]}
          </span>
          <LifecycleStatusBadge
            kind="client"
            status={client.status}
            outcomeSource={isSharedRow ? null : client.outcomeSource}
            verificationReason={client.verificationReason}
          />
          <NoteReminderIndicator
            summary={client.reminderSummary}
            showSchedule
          />
          <HideFromOthersBadge isHidden={client.hideFromOthers === true} />
        </div>

        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {budgetLabel ?? "ბიუჯეტი არ არის"}
        </p>

        <p className="line-clamp-2 text-lg font-semibold leading-snug text-foreground">
          {generatedTitle}
        </p>

        {!isSharedRow && client.name.trim() ? (
          <p className="truncate text-sm font-medium text-foreground">
            {client.name}
          </p>
        ) : null}

        {locationLine ? (
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="min-w-0">{locationLine}</span>
          </p>
        ) : null}

        <ClosedRecordStatChips items={compactStats} />

        {phoneLine ? (
          <p className="truncate text-xs text-muted-foreground">{phoneLine}</p>
        ) : null}

        <ClientProfileCompactIndicator
          clientProfileId={isSharedRow ? null : client.clientProfileId}
          clientProfile={client.clientProfile}
          compact
          allowProfileLink={!isSharedRow && canOpenDetail}
        />

        {isArchiveScope && formatLifecycleDate(client.archivedAt) ? (
          <p className="text-xs text-muted-foreground">
            დაარქივებულია: {formatLifecycleDate(client.archivedAt)}
          </p>
        ) : null}

        <RecordTimestamp
          createdAt={client.createdAt}
          updatedAt={client.updatedAt}
        />

        {canOpenDetail || canManage ? (
          <div className="space-y-2 pt-1" onClick={stopCardOpen} onKeyDown={(event) => event.stopPropagation()}>
            <div className="flex flex-wrap items-center gap-2">
              {canOpenDetail ? (
                <button
                  type="button"
                  onClick={() => onOpenDetail(client.id)}
                  className="inline-flex h-9 min-w-[7rem] items-center justify-center gap-1.5 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
                >
                  <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  ნახვა
                </button>
              ) : null}
              {canManage ? (
                <button
                  type="button"
                  onClick={() => onOpenReminder(client.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:bg-muted"
                  aria-label="შეხსენების დაყენება"
                  title="შეხსენების დაყენება"
                >
                  <Bell className="h-4 w-4" aria-hidden />
                </button>
              ) : null}
              {canEditColor && client.color !== undefined ? (
                <RecordColorPicker
                  value={client.color}
                  disabled={isSavingColor}
                  triggerClassName="h-9 w-9"
                  onSelect={(nextColor) => {
                    void handleSelectColor(nextColor);
                  }}
                />
              ) : null}
              {canManage && client.hideFromOthers !== undefined ? (
                <HideFromOthersToggle
                  isHidden={client.hideFromOthers}
                  disabled={isSavingHideFromOthers}
                  variant="icon"
                  onToggle={(nextHidden) => {
                    void handleToggleHideFromOthers(nextHidden);
                  }}
                />
              ) : null}
              {canRunClientMatches(currentUser, client) ? (
                <MatchPercentActions
                  allHref={clientMatchesHref(client.id, "GLOBAL")}
                  mineHref={clientMatchesHref(client.id, "MINE")}
                  allLabel={`${ui.matchAll}: ${ui.allListings}`}
                  mineLabel={`${ui.matchMine}: ${ui.myListings}`}
                  sessionKind="client"
                  entityId={client.id}
                />
              ) : null}
              <ClientRowArchiveActions
                client={client}
                canManage={canManage}
                onChanged={onChanged}
              />
            </div>
            {colorError ? (
              <p className="text-xs text-destructive" role="alert">
                {colorError}
              </p>
            ) : null}
            {hideFromOthersError ? (
              <p className="text-xs text-destructive" role="alert">
                {hideFromOthersError}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
