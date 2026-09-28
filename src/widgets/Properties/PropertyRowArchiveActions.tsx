"use client";

import {
  archiveProperty,
  unarchiveProperty,
  deleteProperty,
  restoreProperty,
} from "@/features/properties/api";
import type { Property } from "@/features/properties/types";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import { DELETE_COPY } from "@/features/lifecycle/deleteCopy";
import { canRestoreArchivedProperty } from "@/features/lifecycle/canRestoreArchivedRecord";
import { isPropertyArchived } from "@/features/lifecycle/isPropertyArchived";
import { useArchiveAction } from "@/features/lifecycle/useArchiveAction";
import { useSoftDeleteAction } from "@/features/lifecycle/useSoftDeleteAction";
import { ArchiveConfirmDialog } from "@/widgets/Lifecycle/ArchiveConfirmDialog";
import { DeleteConfirmDialog } from "@/widgets/Lifecycle/DeleteConfirmDialog";

type PropertyRowArchiveActionsProps = {
  property: Property;
  canManage: boolean;
  onChanged: () => void;
};

export function PropertyRowArchiveActions({
  property,
  canManage,
  onChanged,
}: PropertyRowArchiveActionsProps) {
  const archiveAction = useArchiveAction({
    canManage,
    isArchived: isPropertyArchived(property),
    canRestore: canRestoreArchivedProperty(property),
    onArchive: () => archiveProperty(property.id),
    onRestore: () => unarchiveProperty(property.id),
    onSuccess: onChanged,
  });
  const deleteAction = useSoftDeleteAction({
    canManage,
    onDelete: () => deleteProperty(property.id),
    onRestore: () => restoreProperty(property.id),
    onSuccess: onChanged,
    onDeleted: onChanged,
  });

  if (
    !archiveAction.canShowArchive &&
    !archiveAction.canShowRestore &&
    !deleteAction.canShowDelete
  ) {
    return null;
  }

  return (
    <>
      {archiveAction.canShowArchive ? (
        <button
          type="button"
          onClick={archiveAction.requestArchive}
          className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
        >
          {ARCHIVE_COPY.moveToArchive}
        </button>
      ) : null}
      {archiveAction.canShowRestore ? (
        <button
          type="button"
          onClick={archiveAction.requestRestore}
          className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
        >
          {ARCHIVE_COPY.restoreFromArchive}
        </button>
      ) : null}
      {deleteAction.canShowDelete ? (
        <button
          type="button"
          onClick={deleteAction.requestDelete}
          className="inline-flex items-center rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive shadow-sm transition hover:bg-destructive/15"
        >
          {DELETE_COPY.actionLabel}
        </button>
      ) : null}
      {archiveAction.confirmKind ? (
        <ArchiveConfirmDialog
          open
          kind={archiveAction.confirmKind}
          isProcessing={archiveAction.isPending}
          error={archiveAction.error}
          onConfirm={() => {
            void archiveAction.confirm();
          }}
          onCancel={archiveAction.cancel}
        />
      ) : null}
      {deleteAction.isConfirmOpen ? (
        <DeleteConfirmDialog
          open
          isProcessing={deleteAction.isPending}
          error={deleteAction.error}
          onConfirm={() => {
            void deleteAction.confirm();
          }}
          onCancel={deleteAction.cancel}
        />
      ) : null}
    </>
  );
}
