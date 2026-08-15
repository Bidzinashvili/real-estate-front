"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { DashboardReminderRow } from "@/features/reminders/dashboardReminderNormalizer";
import { deleteReminder } from "@/features/reminders/remindersApi";
import { formatReminderDueRelative } from "@/shared/lib/formatReminderDueRelative";
import { ConfirmDialog } from "@/widgets/ConfirmDialog/ConfirmDialog";
import { DashboardReminderEditModal } from "@/widgets/Dashboard/DashboardReminderEditModal";

type DashboardRemindersSectionProps = {
  reminders: DashboardReminderRow[];
  isLoading: boolean;
  error: string | null;
  onRemindersChanged?: () => void;
};

function formatDueTooltip(isoTimestamp: string): string {
  const parsed = new Date(isoTimestamp);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toLocaleString();
}

function subjectTypeLabel(subjectType: DashboardReminderRow["subjectType"]): string {
  if (subjectType === "CLIENT") {
    return "კლიენტი";
  }
  return "განცხადება";
}

function deleteConfirmDescription(row: DashboardReminderRow): string {
  if (row.reminderVariant === "LISTING_VERIFICATION") {
    return "განცხადების გადამოწმების შეხსენება წაიშლება. ახლის დაყენება შეგიძლიათ განცხადების მენიუდან.";
  }
  if (row.reminderVariant === "CLIENT_REMINDER") {
    return "კლიენტის შეხსენება წაიშლება.";
  }
  return "დაგეგმილი შეხსენება წაიშლება.";
}

export function DashboardRemindersSection({
  reminders,
  isLoading,
  error,
  onRemindersChanged,
}: DashboardRemindersSectionProps) {
  const [editingRow, setEditingRow] = useState<DashboardReminderRow | null>(null);
  const [deleteTargetRow, setDeleteTargetRow] = useState<DashboardReminderRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteTargetRow) {
      return;
    }
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await deleteReminder(deleteTargetRow.id);
      setDeleteError(null);
      setDeleteTargetRow(null);
      onRemindersChanged?.();
    } catch (errorUnknown) {
      const message =
        errorUnknown instanceof Error
          ? errorUnknown.message
          : "შეხსენების წაშლა ვერ მოხერხდა.";
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteTargetRow(null);
      setDeleteError(null);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">შეხსენებები იტვირთება…</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">შეხსენებები</h2>
      </div>

      {deleteError ? (
        <p className="mb-2 text-sm text-destructive" role="alert">
          {deleteError}
        </p>
      ) : null}

      {reminders.length === 0 ? (
        <p className="text-sm text-muted-foreground">შეხსენებები ჯერ არ არის.</p>
      ) : (
        <div className="overflow-x-auto overflow-hidden rounded-xl bg-card text-sm shadow-sm ring-1 ring-border">
          <table className="min-w-full border-collapse">
            <thead className="bg-muted text-left text-xs font-medium text-muted-foreground">
              <tr>
                <th className="px-4 py-3">ვადა</th>
                <th className="px-4 py-3">ტიპი</th>
                <th className="px-4 py-3">ვისთვის</th>
                <th className="min-w-[10rem] px-4 py-3">რომელი</th>
                <th className="hidden px-4 py-3 lg:table-cell">შენიშვნა</th>
                <th className="px-4 py-3 text-right">მოქმედებები</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((row) => {
                return (
                  <tr key={row.id} className="border-t border-border">
                    <td
                      className="max-w-[14rem] px-4 py-3 text-foreground"
                      title={formatDueTooltip(row.dueAtIso) || undefined}
                    >
                      <span className="block">
                        {formatReminderDueRelative(row.dueAtIso)}
                      </span>
                      {row.sentAtIso ? (
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          გაიგზავნა{" "}
                          {formatDueTooltip(row.sentAtIso) || row.sentAtIso}
                        </span>
                      ) : null}
                    </td>
                    <td className="max-w-[10rem] px-4 py-3 text-foreground">
                      {row.reminderKindLabel}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {subjectTypeLabel(row.subjectType)}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {row.subjectType === "PROPERTY" ? (
                        <Link
                          href={`/properties/${row.subjectId}`}
                          className="font-medium text-teal-800 underline-offset-2 hover:underline"
                        >
                          {row.subjectTitle}
                        </Link>
                      ) : (
                        <Link
                          href={`/clients/${row.subjectId}`}
                          className="font-medium text-teal-800 underline-offset-2 hover:underline"
                        >
                          {row.subjectTitle}
                        </Link>
                      )}
                    </td>
                    <td className="hidden max-w-xs truncate px-4 py-3 text-muted-foreground lg:table-cell">
                      {row.note ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingRow(row)}
                          title="შეხსენების რედაქტირება"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
                          aria-label="შეხსენების რედაქტირება"
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            setDeleteTargetRow(row);
                          }}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                          aria-label="შეხსენების წაშლა"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editingRow ? (
        <DashboardReminderEditModal
          key={editingRow.id}
          row={editingRow}
          onClose={() => setEditingRow(null)}
          onSaved={() => onRemindersChanged?.()}
        />
      ) : null}

      <ConfirmDialog
        open={deleteTargetRow !== null}
        title="წავშალოთ ეს შეხსენება?"
        description={
          deleteTargetRow ? deleteConfirmDescription(deleteTargetRow) : ""
        }
        confirmLabel="წაშლა"
        cancelLabel="გაუქმება"
        isProcessing={isDeleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={handleCancelDelete}
      />
    </section>
  );
}
