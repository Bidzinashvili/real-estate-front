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
    return "Client";
  }
  return "Property";
}

function deleteConfirmDescription(row: DashboardReminderRow): string {
  if (row.reminderVariant === "LISTING_VERIFICATION") {
    return "This clears the verification follow-up on the listing. You can set a new one from the property card menu.";
  }
  if (row.reminderVariant === "CLIENT_REMINDER") {
    return "This clears the follow-up reminder on the client record.";
  }
  return "This removes the scheduled reminder row.";
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
          : "Could not remove this reminder.";
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
    return <p className="text-sm text-slate-600">Loading reminders…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-800">Reminders</h2>
      </div>

      {deleteError ? (
        <p className="mb-2 text-sm text-red-600" role="alert">
          {deleteError}
        </p>
      ) : null}

      {reminders.length === 0 ? (
        <p className="text-sm text-slate-600">No reminders yet.</p>
      ) : (
        <div className="overflow-x-auto overflow-hidden rounded-xl bg-white text-sm shadow-sm ring-1 ring-slate-200">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-50 text-left text-xs font-medium text-slate-500">
              <tr>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">For</th>
                <th className="min-w-[10rem] px-4 py-3">Which</th>
                <th className="hidden px-4 py-3 lg:table-cell">Note</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((row) => {
                return (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td
                      className="max-w-[14rem] px-4 py-3 text-slate-900"
                      title={formatDueTooltip(row.dueAtIso) || undefined}
                    >
                      <span className="block">
                        {formatReminderDueRelative(row.dueAtIso)}
                      </span>
                      {row.sentAtIso ? (
                        <span className="mt-0.5 block text-xs text-slate-500">
                          Sent{" "}
                          {formatDueTooltip(row.sentAtIso) || row.sentAtIso}
                        </span>
                      ) : null}
                    </td>
                    <td className="max-w-[10rem] px-4 py-3 text-slate-700">
                      {row.reminderKindLabel}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {subjectTypeLabel(row.subjectType)}
                    </td>
                    <td className="px-4 py-3 text-slate-900">
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
                    <td className="hidden max-w-xs truncate px-4 py-3 text-slate-600 lg:table-cell">
                      {row.note ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingRow(row)}
                          title="Edit reminder"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                          aria-label="Edit reminder"
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            setDeleteTargetRow(row);
                          }}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-red-50 hover:text-red-700"
                          aria-label="Delete reminder"
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
        title="Remove this reminder?"
        description={
          deleteTargetRow ? deleteConfirmDescription(deleteTargetRow) : ""
        }
        confirmLabel="Remove"
        cancelLabel="Cancel"
        isProcessing={isDeleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={handleCancelDelete}
      />
    </section>
  );
}
