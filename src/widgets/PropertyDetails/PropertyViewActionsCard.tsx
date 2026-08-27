"use client";

import Link from "next/link";
import { Archive, Bell, RefreshCw, Tags, Undo2, Trash2 } from "lucide-react";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import { DELETE_COPY } from "@/features/lifecycle/deleteCopy";
import type { Property } from "@/features/properties/types";
import { canEditRecordColor, type RecordColor } from "@/features/recordColor/recordColor";
import { RecordColorPicker } from "@/widgets/RecordColor/RecordColorPicker";
import { HideFromOthersToggle } from "@/widgets/HideFromOthers/HideFromOthersToggle";

type PropertyViewActionsCardProps = {
  property: Property;
  canEdit: boolean;
  isArchivePending: boolean;
  archiveError: string | null;
  matchPercentage: number | null;
  canShowArchive: boolean;
  canShowRestore: boolean;
  canShowDelete: boolean;
  isDeletePending: boolean;
  isSavingColor: boolean;
  isSavingHideFromOthers: boolean;
  hideFromOthersError: string | null;
  onOpenReminders: () => void;
  onRequestArchive: () => void;
  onRequestRestore: () => void;
  onRequestDelete: () => void;
  onOpenChangeStatus: () => void;
  onSelectColor: (color: RecordColor) => void;
  onToggleHideFromOthers: (nextHidden: boolean) => void;
};

export function PropertyViewActionsCard({
  property,
  canEdit,
  isArchivePending,
  archiveError,
  matchPercentage,
  canShowArchive,
  canShowRestore,
  canShowDelete,
  isDeletePending,
  isSavingColor,
  isSavingHideFromOthers,
  hideFromOthersError,
  onOpenReminders,
  onRequestArchive,
  onRequestRestore,
  onRequestDelete,
  onOpenChangeStatus,
  onSelectColor,
  onToggleHideFromOthers,
}: PropertyViewActionsCardProps) {
  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
      <div className="flex flex-wrap items-center gap-2">
        {canEditRecordColor(canEdit, property.color) && property.color !== undefined ? (
          <RecordColorPicker
            value={property.color}
            disabled={isSavingColor}
            align="left"
            onSelect={onSelectColor}
          />
        ) : null}
        {canEdit ? (
          <HideFromOthersToggle
            isHidden={property.hideFromOthers}
            disabled={isSavingHideFromOthers}
            onToggle={onToggleHideFromOthers}
          />
        ) : null}
        <button
          type="button"
          onClick={onOpenReminders}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
        >
          <Bell className="h-3.5 w-3.5" aria-hidden="true" />
          შეხსენება
        </button>
        {canEdit ? (
          <Link
            href={`/properties/${property.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            <Tags className="h-3.5 w-3.5" aria-hidden="true" />
            ფერადი ლეიბლები
          </Link>
        ) : null}
        {canEdit ? (
          <button
            type="button"
            onClick={onOpenChangeStatus}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            სტატუსის შეცვლა
          </button>
        ) : null}
        {canShowArchive ? (
          <button
            type="button"
            disabled={isArchivePending}
            onClick={onRequestArchive}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Archive className="h-3.5 w-3.5" aria-hidden="true" />
            {isArchivePending ? ARCHIVE_COPY.archiving : ARCHIVE_COPY.moveToArchive}
          </button>
        ) : null}
        {canShowRestore ? (
          <button
            type="button"
            disabled={isArchivePending}
            onClick={onRequestRestore}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
            {isArchivePending ? ARCHIVE_COPY.restoring : ARCHIVE_COPY.restoreFromArchive}
          </button>
        ) : null}
        {canShowDelete ? (
          <button
            type="button"
            disabled={isDeletePending}
            onClick={onRequestDelete}
            className="inline-flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive transition hover:bg-destructive/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            {DELETE_COPY.actionLabel}
          </button>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-success-muted px-3 py-1.5 text-xs font-semibold text-success-foreground">
          ინფორმაციის შევსება: {matchPercentage ?? "—"}%
        </span>
      </div>
      {archiveError ? (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {archiveError}
        </p>
      ) : null}
      {hideFromOthersError ? (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {hideFromOthersError}
        </p>
      ) : null}
    </section>
  );
}
