"use client";

import { Bell } from "lucide-react";
import type { ReminderSummary } from "@/features/reminders/remindersApiTypes";
import { formatReminderScheduleLabel } from "@/features/reminders/formatReminderSchedule";

type NoteReminderIndicatorProps = {
  summary: ReminderSummary | null | undefined;
  size?: "sm" | "md";
  showSchedule?: boolean;
};

export function NoteReminderIndicator({
  summary,
  size = "md",
  showSchedule = false,
}: NoteReminderIndicatorProps) {
  if (!summary || summary.activeCount <= 0) {
    return null;
  }

  const isDue = summary.hasDueReminder;
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const nextLabel = summary.nextReminderAt
    ? formatReminderScheduleLabel(summary.nextReminderAt)
    : null;
  const title = nextLabel
    ? `შემდეგი შეხსენება: ${nextLabel}`
    : isDue
      ? "მოსული შეხსენება"
      : "აქტიური შეხსენება";

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        isDue
          ? "bg-orange-100 text-orange-800 ring-1 ring-orange-200"
          : "bg-muted text-muted-foreground"
      }`}
      title={title}
    >
      <Bell className={`${iconSize} shrink-0 ${isDue ? "text-orange-700" : ""}`} aria-hidden />
      {summary.activeCount > 1 ? <span>{summary.activeCount}</span> : null}
      {showSchedule && nextLabel ? (
        <span className="max-w-[9rem] truncate">{nextLabel}</span>
      ) : null}
      <span className="sr-only">{title}</span>
    </span>
  );
}
