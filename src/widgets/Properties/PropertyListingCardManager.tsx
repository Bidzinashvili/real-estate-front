"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { verifyProperty, archiveProperty, unarchiveProperty, deleteProperty, restoreProperty } from "@/features/properties/api";
import type { Property } from "@/features/properties/types";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import { DELETE_COPY } from "@/features/lifecycle/deleteCopy";
import { canRestoreArchivedProperty } from "@/features/lifecycle/canRestoreArchivedRecord";
import { isPropertyArchived } from "@/features/lifecycle/isPropertyArchived";
import { useArchiveAction } from "@/features/lifecycle/useArchiveAction";
import { useSoftDeleteAction } from "@/features/lifecycle/useSoftDeleteAction";
import { ArchiveConfirmDialog } from "@/widgets/Lifecycle/ArchiveConfirmDialog";
import { DeleteConfirmDialog } from "@/widgets/Lifecycle/DeleteConfirmDialog";
import { PropertyListingChangeStatusModal } from "@/widgets/Properties/PropertyListingChangeStatusModal";
import { PropertyListingRemindersModal } from "@/widgets/Properties/PropertyListingRemindersModal";
import type { RecordColor } from "@/features/recordColor/recordColor";
import { RecordColorSwatches } from "@/widgets/RecordColor/RecordColorSwatches";
import { HideFromOthersToggle } from "@/widgets/HideFromOthers/HideFromOthersToggle";

type PropertyListingCardManagerProps = {
  property: Property;
  onListingChanged: () => void;
  canChangeStatus?: boolean;
  canSetReminders?: boolean;
  canEditColor?: boolean;
  onSelectColor?: (color: RecordColor) => void;
  isSavingColor?: boolean;
  colorError?: string | null;
  canToggleHideFromOthers?: boolean;
  onToggleHideFromOthers?: (nextHidden: boolean) => void;
  isSavingHideFromOthers?: boolean;
  hideFromOthersError?: string | null;
};

export function PropertyListingCardManager({
  property,
  onListingChanged,
  canChangeStatus = false,
  canSetReminders = false,
  canEditColor = false,
  onSelectColor,
  isSavingColor = false,
  colorError = null,
  canToggleHideFromOthers = false,
  onToggleHideFromOthers,
  isSavingHideFromOthers = false,
  hideFromOthersError = null,
}: PropertyListingCardManagerProps) {
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const archiveAction = useArchiveAction({
    canManage: canChangeStatus,
    isArchived: isPropertyArchived(property),
    canRestore: canRestoreArchivedProperty(property),
    onArchive: () => archiveProperty(property.id),
    onRestore: () => unarchiveProperty(property.id),
    onSuccess: onListingChanged,
  });
  const deleteAction = useSoftDeleteAction({
    canManage: canChangeStatus,
    onDelete: () => deleteProperty(property.id),
    onRestore: () => restoreProperty(property.id),
    onSuccess: onListingChanged,
    onDeleted: onListingChanged,
  });

  useEffect(() => {
    if (!isActionMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const node = menuContainerRef.current;
      if (!node) return;
      if (node.contains(event.target as Node)) return;
      setIsActionMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isActionMenuOpen]);

  function stopOverlayEvent(event: React.SyntheticEvent) {
    event.stopPropagation();
  }

  return (
    <>
      <div
        ref={menuContainerRef}
        className="absolute right-3 top-3 z-20"
        onClick={stopOverlayEvent}
        onMouseDown={stopOverlayEvent}
        onPointerDown={stopOverlayEvent}
      >
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsActionMenuOpen((previous) => !previous);
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white shadow-sm backdrop-blur-[2px] transition hover:bg-black/60"
          aria-expanded={isActionMenuOpen}
          aria-haspopup="menu"
          aria-label="განცხადების მოქმედებები"
        >
          <MoreVertical className="h-4 w-4" aria-hidden />
        </button>

        {isActionMenuOpen ? (
          <div
            role="menu"
            className="absolute right-0 top-full mt-1 min-w-[13rem] overflow-hidden rounded-xl border border-border bg-card py-1 text-sm shadow-lg ring-1 ring-border/60"
            onClick={stopOverlayEvent}
            onMouseDown={stopOverlayEvent}
          >
            {canChangeStatus ? (
              <button
                type="button"
                role="menuitem"
                className="flex w-full px-3 py-2 text-left text-foreground transition hover:bg-muted"
                onMouseDown={stopOverlayEvent}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsActionMenuOpen(false);
                  setIsRemindersOpen(false);
                  setIsChangeStatusOpen(true);
                }}
              >
                სტატუსის შეცვლა
              </button>
            ) : null}
            {canChangeStatus ? (
              <button
                type="button"
                role="menuitem"
                disabled={isVerifying}
                className="flex w-full px-3 py-2 text-left text-foreground transition hover:bg-muted disabled:opacity-60"
                onMouseDown={stopOverlayEvent}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsActionMenuOpen(false);
                  setVerifyError(null);
                  setIsVerifying(true);
                  void verifyProperty(property.id)
                    .then(() => {
                      onListingChanged();
                    })
                    .catch((error: unknown) => {
                      const message =
                        error instanceof Error
                          ? error.message
                          : "განცხადების გადამოწმება ვერ მოხერხდა.";
                      setVerifyError(message);
                    })
                    .finally(() => {
                      setIsVerifying(false);
                    });
                }}
              >
                {isVerifying ? "მოწმდება…" : "გადავამოწმე"}
              </button>
            ) : null}
            {canSetReminders ? (
              <button
                type="button"
                role="menuitem"
                className="flex w-full px-3 py-2 text-left text-foreground transition hover:bg-muted"
                onMouseDown={stopOverlayEvent}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsActionMenuOpen(false);
                  setIsChangeStatusOpen(false);
                  setIsRemindersOpen(true);
                }}
              >
                შეხსენებების დაყენება
              </button>
            ) : null}
            {archiveAction.canShowArchive ? (
              <button
                type="button"
                role="menuitem"
                className="flex w-full px-3 py-2 text-left text-foreground transition hover:bg-muted"
                onMouseDown={stopOverlayEvent}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsActionMenuOpen(false);
                  archiveAction.requestArchive();
                }}
              >
                {ARCHIVE_COPY.moveToArchive}
              </button>
            ) : null}
            {archiveAction.canShowRestore ? (
              <button
                type="button"
                role="menuitem"
                className="flex w-full px-3 py-2 text-left text-foreground transition hover:bg-muted"
                onMouseDown={stopOverlayEvent}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsActionMenuOpen(false);
                  archiveAction.requestRestore();
                }}
              >
                {ARCHIVE_COPY.restoreFromArchive}
              </button>
            ) : null}
            {deleteAction.canShowDelete ? (
              <button
                type="button"
                role="menuitem"
                className="flex w-full px-3 py-2 text-left text-destructive transition hover:bg-muted"
                onMouseDown={stopOverlayEvent}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsActionMenuOpen(false);
                  deleteAction.requestDelete();
                }}
              >
                {DELETE_COPY.actionLabel}
              </button>
            ) : null}
            {canToggleHideFromOthers && onToggleHideFromOthers ? (
              <HideFromOthersToggle
                isHidden={property.hideFromOthers}
                disabled={isSavingHideFromOthers}
                variant="menuitem"
                onToggle={(nextHidden) => {
                  setIsActionMenuOpen(false);
                  onToggleHideFromOthers(nextHidden);
                }}
              />
            ) : null}
            {canEditColor && property.color !== undefined && onSelectColor ? (
              <div
                className="border-t border-border px-3 py-2"
                onClick={stopOverlayEvent}
                onMouseDown={stopOverlayEvent}
              >
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">ფერი</p>
                <RecordColorSwatches
                  value={property.color}
                  disabled={isSavingColor}
                  onSelect={(nextColor) => {
                    setIsActionMenuOpen(false);
                    onSelectColor(nextColor);
                  }}
                />
              </div>
            ) : null}
          </div>
        ) : null}
        {verifyError ? (
          <p className="mt-1 max-w-[14rem] rounded-lg bg-card px-2 py-1 text-xs text-destructive shadow-sm">
            {verifyError}
          </p>
        ) : null}
        {colorError ? (
          <p className="mt-1 max-w-[14rem] rounded-lg bg-card px-2 py-1 text-xs text-destructive shadow-sm">
            {colorError}
          </p>
        ) : null}
        {hideFromOthersError ? (
          <p className="mt-1 max-w-[14rem] rounded-lg bg-card px-2 py-1 text-xs text-destructive shadow-sm">
            {hideFromOthersError}
          </p>
        ) : null}
      </div>

      {canChangeStatus ? (
        <PropertyListingChangeStatusModal
          open={isChangeStatusOpen}
          property={property}
          onClose={() => setIsChangeStatusOpen(false)}
          onSaved={onListingChanged}
        />
      ) : null}

      {canSetReminders ? (
        <PropertyListingRemindersModal
          open={isRemindersOpen}
          property={property}
          onClose={() => setIsRemindersOpen(false)}
          onScheduled={onListingChanged}
        />
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
