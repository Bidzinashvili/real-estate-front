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
import { formatClientDealIntentLabel } from "@/features/clients/clientDealTypeDisplay";
import { isAgencySharedClientView } from "@/features/databaseList/viewerOwnership";
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
import { Button } from "@/shared/ui/Button";
import { DealTypeBadge } from "@/shared/ui/DealTypeBadge";
import { surfaceCardInteractiveClassName } from "@/shared/ui/surfaceStyles";
import { typography } from "@/shared/ui/typography";

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
  const isSharedRow = isAgencySharedClientView(client);
  const generatedTitle = formatSharedClientHeadline(client);
  const budgetLabel = formatBudgetRange(
    client.budgetMin,
    client.budgetMax,
    client.budgetCurrency,
  );
  const locationLine = formatClientLocationLine(client);
  const compactStats = clientCompactStats(client);
  const phoneLine =
    canOpenDetail && !isSharedRow ? (client.phones[0] ?? "") : "";
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
        "flex min-w-0 w-full flex-col overflow-hidden p-3",
        surfaceCardInteractiveClassName,
        canOpenDetail ? "cursor-pointer" : "",
        hasCustomColor ? recordColorSurfaceClassName(client.color) : "",
      )}
    >
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <DealTypeBadge label={formatClientDealIntentLabel(client.dealType)} />
          <LifecycleStatusBadge
            kind="client"
            status={client.status}
            outcomeSource={isSharedRow ? null : client.outcomeSource}
            verificationReason={client.verificationReason}
          />
          {!isSharedRow ? (
            <NoteReminderIndicator
              summary={client.reminderSummary}
              showSchedule
            />
          ) : null}
          {!isSharedRow && client.hideFromOthers !== undefined ? (
            <HideFromOthersBadge isHidden={client.hideFromOthers === true} />
          ) : null}
        </div>

        <p className={typography.pricePrimary}>
          {budgetLabel ?? "ბიუჯეტი არ არის"}
        </p>

        <p className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
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

        {isSharedRow && client.publicComment?.trim() ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">საჯარო კომენტარი: </span>
            {client.publicComment.trim()}
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
          <div
            className="space-y-2 border-t border-border/70 pt-3"
            onClick={stopCardOpen}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-center gap-2">
              {canOpenDetail ? (
                <Button
                  type="button"
                  size="sm"
                  className="min-w-[7rem] text-xs"
                  onClick={() => onOpenDetail(client.id)}
                >
                  <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  ნახვა
                </Button>
              ) : null}
              {canManage ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => onOpenReminder(client.id)}
                  aria-label="შეხსენების დაყენება"
                  title="შეხსენების დაყენება"
                >
                  <Bell className="h-4 w-4" aria-hidden />
                </Button>
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
