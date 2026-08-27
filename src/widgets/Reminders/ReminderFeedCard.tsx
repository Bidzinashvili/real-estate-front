"use client";

import { useRouter } from "next/navigation";
import { Archive, Bell, Clock3 } from "lucide-react";
import type { DashboardReminderRow } from "@/features/reminders/dashboardReminderNormalizer";
import { isKeepStyleReminder } from "@/features/reminders/dashboardReminderNormalizer";
import {
  formatReminderDateTime,
  formatReminderScheduleLabel,
} from "@/features/reminders/formatReminderSchedule";
import { getApiBaseUrl } from "@/shared/lib/auth";
import { formatDealTypeLabel, isDealType } from "@/features/properties/dealType";
import { formatPropertyStatusLabel, isPropertyStatus } from "@/features/properties/propertyStatus";
import { PROPERTY_TYPE_LABELS } from "@/shared/i18n/enumLabels";
import {
  CLIENT_STATUS_LABELS,
  DEAL_TYPE_LABELS,
  isClientStatus,
} from "@/features/clients/clientEnums";
import { PropertyCardImageCarousel } from "@/widgets/Properties/PropertyCardImageCarousel";
import { ReminderCardActions } from "@/widgets/Reminders/ReminderCardActions";
import { ReminderPickerModal } from "@/widgets/Reminders/ReminderPickerModal";
import { DashboardReminderEditModal } from "@/widgets/Dashboard/DashboardReminderEditModal";
import { useState } from "react";

type ReminderFeedCardProps = {
  reminder: DashboardReminderRow;
  onChanged: () => void;
};

function propertyNoteHref(propertyId: string): string {
  return `/properties/${propertyId}`;
}

function clientNoteHref(clientId: string): string {
  return `/clients/${clientId}`;
}

function formatPropertyTypeLabel(propertyType: string | null): string | null {
  if (!propertyType) return null;
  return PROPERTY_TYPE_LABELS[propertyType as keyof typeof PROPERTY_TYPE_LABELS] ?? null;
}

function formatPreviewDealType(dealType: string | null): string | null {
  if (!dealType || !isDealType(dealType)) return null;
  return formatDealTypeLabel(dealType);
}

function formatClientDealType(dealType: string | null): string | null {
  if (!dealType) return null;
  return DEAL_TYPE_LABELS[dealType as keyof typeof DEAL_TYPE_LABELS] ?? null;
}

export function ReminderFeedCard({ reminder, onChanged }: ReminderFeedCardProps) {
  const router = useRouter();
  const apiBaseUrl = getApiBaseUrl();
  const [isKeepEditOpen, setIsKeepEditOpen] = useState(false);
  const [isLifecycleEditOpen, setIsLifecycleEditOpen] = useState(false);
  const isDue = reminder.isDue;
  const isProperty = reminder.targetType === "PROPERTY";
  const propertyPreview = reminder.property;
  const clientPreview = reminder.client;
  const isArchived = Boolean(
    isProperty ? propertyPreview?.archivedAt : clientPreview?.archivedAt,
  );

  const noteHref = isProperty
    ? propertyNoteHref(reminder.subjectId)
    : clientNoteHref(reminder.subjectId);

  const handleOpenNote = () => {
    router.push(noteHref);
  };

  const handleEdit = () => {
    if (isKeepStyleReminder(reminder.reminderVariant)) {
      setIsKeepEditOpen(true);
      return;
    }
    setIsLifecycleEditOpen(true);
  };

  const title = isProperty
    ? propertyPreview?.title?.trim() || reminder.subjectTitle
    : clientPreview?.name || reminder.subjectTitle;
  const addressLine = isProperty
    ? [propertyPreview?.address, propertyPreview?.district, propertyPreview?.city]
        .filter(Boolean)
        .join(" ")
    : null;
  const coverImages = propertyPreview?.coverImage
    ? [
        {
          url: propertyPreview.coverImage.url,
          originalName: propertyPreview.coverImage.originalName,
        },
      ]
    : [];
  const propertyStatusLabel =
    propertyPreview?.status && isPropertyStatus(propertyPreview.status)
      ? formatPropertyStatusLabel(propertyPreview.status)
      : propertyPreview?.status ?? null;
  const clientStatusLabel =
    clientPreview?.status && isClientStatus(clientPreview.status)
      ? CLIENT_STATUS_LABELS[clientPreview.status]
      : clientPreview?.status ?? null;

  return (
    <article
      className={`overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ${
        isDue ? "ring-orange-300" : "ring-border"
      }`}
    >
      <div className={`flex flex-col gap-3 p-3 sm:flex-row ${isDue ? "bg-orange-50/70" : ""}`}>
        {isProperty ? (
          <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-36">
            <PropertyCardImageCarousel
              propertyId={reminder.subjectId}
              images={coverImages}
              apiBaseUrl={apiBaseUrl}
              alt={title}
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                isDue
                  ? "bg-orange-100 text-orange-800"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isDue ? (
                <Bell className="h-3 w-3" aria-hidden />
              ) : (
                <Clock3 className="h-3 w-3" aria-hidden />
              )}
              {isDue ? "მოსული შეხსენება" : "მოლოდინი"}
            </span>
            {isArchived ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                <Archive className="h-3 w-3" aria-hidden />
                არქივშია
              </span>
            ) : null}
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {reminder.reminderKindLabel}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-foreground">{title}</h3>

          {isProperty ? (
            <p className="text-sm text-muted-foreground">{addressLine || "—"}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {[
                formatClientDealType(clientPreview?.dealType ?? null),
                clientPreview?.districts.join(", ") || null,
                clientStatusLabel,
              ]
                .filter(Boolean)
                .join(" • ") || "კლიენტი"}
            </p>
          )}

          {isProperty ? (
            <p className="text-xs text-muted-foreground">
              {[
                formatPreviewDealType(propertyPreview?.dealType ?? null),
                formatPropertyTypeLabel(propertyPreview?.propertyType ?? null),
                propertyStatusLabel,
              ]
                .filter(Boolean)
                .join(" • ")}
            </p>
          ) : null}

          <div className="space-y-0.5 text-sm">
            {isDue ? (
              <p className="font-medium text-foreground">
                შეხსენება იყო: {formatReminderDateTime(reminder.notifyAt)}
              </p>
            ) : (
              <p className="font-medium text-foreground">
                შეხსენება: {formatReminderScheduleLabel(reminder.notifyAt)}
              </p>
            )}
            {isDue && reminder.triggeredAtIso ? (
              <p className="text-xs text-muted-foreground">
                ამოვარდა: {formatReminderDateTime(reminder.triggeredAtIso)}
              </p>
            ) : null}
          </div>

          {reminder.note ? (
            <p className="line-clamp-3 text-sm text-foreground">{reminder.note}</p>
          ) : null}

          <ReminderCardActions
            reminder={reminder}
            onOpenNote={handleOpenNote}
            onEdit={handleEdit}
            onChanged={onChanged}
          />
        </div>
      </div>

      {isKeepEditOpen ? (
        <ReminderPickerModal
          mode="edit"
          open
          reminderId={reminder.id}
          initialNotifyAt={reminder.notifyAt}
          initialNote={reminder.note}
          onClose={() => setIsKeepEditOpen(false)}
          onSaved={onChanged}
        />
      ) : null}

      {isLifecycleEditOpen ? (
        <DashboardReminderEditModal
          row={reminder}
          onClose={() => setIsLifecycleEditOpen(false)}
          onSaved={onChanged}
        />
      ) : null}
    </article>
  );
}
