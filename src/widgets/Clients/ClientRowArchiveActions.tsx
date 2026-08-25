"use client";

import { archiveClient, unarchiveClient } from "@/features/clients/api";
import type { Client } from "@/features/clients/types";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import { canRestoreArchivedClient } from "@/features/lifecycle/canRestoreArchivedRecord";
import { isClientArchived } from "@/features/lifecycle/isClientArchived";
import { useArchiveAction } from "@/features/lifecycle/useArchiveAction";
import { ArchiveConfirmDialog } from "@/widgets/Lifecycle/ArchiveConfirmDialog";

type ClientRowArchiveActionsProps = {
  client: Client;
  canManage: boolean;
  onChanged: () => void;
};

export function ClientRowArchiveActions({
  client,
  canManage,
  onChanged,
}: ClientRowArchiveActionsProps) {
  const archiveAction = useArchiveAction({
    canManage,
    isArchived: isClientArchived(client),
    canRestore: canRestoreArchivedClient(client),
    onArchive: () => archiveClient(client.id),
    onRestore: () => unarchiveClient(client.id),
    onSuccess: onChanged,
  });

  if (!archiveAction.canShowArchive && !archiveAction.canShowRestore) {
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
    </>
  );
}
