"use client";

import { useEffect, useState } from "react";
import { canRunClientMatches } from "@/features/matching/canRunClientMatches";
import { useCurrentUser } from "@/shared/hooks";
import { useRouter } from "next/navigation";
import { deleteClientComment, updateClient, verifyClient, archiveClient, unarchiveClient, deleteClient, restoreClient } from "@/features/clients/api";
import { useAddClientComment } from "@/features/clients/useAddClientComment";
import type { ClientDetail, Comment } from "@/features/clients/types";
import type { LockState } from "@/features/clients/clientApi.types";
import {
  collectClientDetailTemporaryLocks,
  resolveClientDetailLock,
} from "@/features/matching/collectTemporaryLocks";
import {
  isClientPersistableLockKey,
  type ClientPersistableLockKey,
} from "@/features/matching/matchingEnums";
import { MatchingLockHint } from "@/widgets/ClientForm/PreferenceLockButton";
import { ClientCommentThread } from "./ClientCommentThread";
import { ClientDetailsRelatedPersonsSection } from "./ClientDetailsRelatedPersonsSection";
import { ClientDetailsRequirementsSection } from "./ClientDetailsRequirementsSection";
import { ClientDetailsSummaryCard } from "./ClientDetailsSummaryCard";
import { ClientDetailsTopBar } from "./ClientDetailsTopBar";
import { ClientProfileLinkSection } from "@/widgets/ClientDetails/ClientProfileLinkSection";
import { ClientHiddenPropertiesSection } from "@/widgets/ClientHiddenProperties/ClientHiddenPropertiesSection";
import { viewerCanManageRecord } from "@/features/databaseList/viewerOwnership";
import { ClientChangeStatusModal } from "@/widgets/Clients/ClientChangeStatusModal";
import { VerificationReminderPanel } from "@/widgets/Lifecycle/VerificationReminderPanel";
import { NoteRemindersSection } from "@/widgets/Reminders/NoteRemindersSection";
import type { ReminderConfigPayload } from "@/features/lifecycle/lifecycleEnums";
import { canRestoreArchivedClient } from "@/features/lifecycle/canRestoreArchivedRecord";
import { isClientArchived } from "@/features/lifecycle/isClientArchived";
import { useArchiveAction } from "@/features/lifecycle/useArchiveAction";
import { useSoftDeleteAction } from "@/features/lifecycle/useSoftDeleteAction";
import { ArchiveConfirmDialog } from "@/widgets/Lifecycle/ArchiveConfirmDialog";
import { DeleteConfirmDialog } from "@/widgets/Lifecycle/DeleteConfirmDialog";
import type { RecordColor } from "@/features/recordColor/recordColor";
import { useUpdateRecordColor } from "@/features/recordColor/useUpdateRecordColor";
import { useUpdateHideFromOthers } from "@/features/hideFromOthers/useUpdateHideFromOthers";

type ClientDetailsContentProps = {
  client: ClientDetail;
  onClientChanged: () => void;
};

export function ClientDetailsContent({ client, onClientChanged }: ClientDetailsContentProps) {
  const router = useRouter();
  const {
    addComment,
    addInternalComment,
    isLoading: isPostingComment,
    error: commentError,
  } = useAddClientComment();

  const [deletingPublicCommentId, setDeletingPublicCommentId] = useState<
    string | null
  >(null);
  const [publicCommentDeleteError, setPublicCommentDeleteError] = useState<
    string | null
  >(null);

  const { user } = useCurrentUser();
  const canRunMatches = canRunClientMatches(user, client.userId);
  const canEditStatus =
    user !== null && (user.role === "ADMIN" || user.id === client.userId);
  const canManageHidden = viewerCanManageRecord(client, user);
  const archiveAction = useArchiveAction({
    canManage: canEditStatus,
    isArchived: isClientArchived(client),
    canRestore: canRestoreArchivedClient(client),
    onArchive: () => archiveClient(client.id),
    onRestore: () => unarchiveClient(client.id),
    onSuccess: onClientChanged,
  });
  const deleteAction = useSoftDeleteAction({
    canManage: canEditStatus,
    onDelete: () => deleteClient(client.id),
    onRestore: () => restoreClient(client.id),
    onSuccess: onClientChanged,
    onDeleted: () => {
      router.push(isClientArchived(client) ? "/archive?tab=clients" : "/clients");
    },
  });
  const relatedPersons = client.relatedPersons ?? [];
  const [lockOverlay, setLockOverlay] = useState<
    Partial<Record<ClientPersistableLockKey, LockState>>
  >({});
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [isSavingReminder, setIsSavingReminder] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [reminderError, setReminderError] = useState<string | null>(null);
  const { saveColor, isSaving: isSavingColor, error: colorError } =
    useUpdateRecordColor();
  const {
    saveHideFromOthers,
    isSaving: isSavingHideFromOthers,
    error: hideFromOthersError,
  } = useUpdateHideFromOthers();

  useEffect(() => {
    setLockOverlay({});
  }, [client.id, client.updatedAt]);

  const [publicComments, setPublicComments] = useState<Comment[]>(
    client.comments ?? [],
  );
  const [internalComments, setInternalComments] = useState<Comment[]>(
    client.internalComments ?? [],
  );

  const handleAddComment = async (text: string) => {
    setPublicCommentDeleteError(null);
    const newComment = await addComment(client.id, text);
    setPublicComments((prev) => [newComment, ...prev]);
  };

  const handleDeletePublicComment = async (commentId: string) => {
    setPublicCommentDeleteError(null);
    setDeletingPublicCommentId(commentId);
    try {
      await deleteClientComment(client.id, commentId);
      setPublicComments((prev) => prev.filter((item) => item.id !== commentId));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "კომენტარის წაშლა ვერ მოხერხდა.";
      setPublicCommentDeleteError(message);
    } finally {
      setDeletingPublicCommentId(null);
    }
  };

  const handleAddInternalComment = async (text: string) => {
    const newComment = await addInternalComment(client.id, text);
    setInternalComments((prev) => [newComment, ...prev]);
  };

  function getLock(fieldKey: string): LockState {
    return resolveClientDetailLock(lockOverlay, client, fieldKey);
  }

  function handleLockChange(fieldKey: string, nextLock: LockState) {
    if (!isClientPersistableLockKey(fieldKey)) {
      return;
    }
    setLockOverlay((previousOverlay) => ({
      ...previousOverlay,
      [fieldKey]: nextLock,
    }));
  }

  const temporaryLockedFields = collectClientDetailTemporaryLocks(lockOverlay, client);

  async function handleSelectColor(nextColor: RecordColor) {
    if (!canEditStatus || client.color === undefined) {
      return;
    }
    try {
      await saveColor("client", client.id, nextColor);
      onClientChanged();
    } catch {
      return;
    }
  }

  async function handleToggleHideFromOthers(nextHidden: boolean) {
    if (!canEditStatus) {
      return;
    }
    try {
      await saveHideFromOthers("client", client.id, nextHidden);
      onClientChanged();
    } catch {
      return;
    }
  }

  async function handleSaveReminder(payload: ReminderConfigPayload) {
    if (!canEditStatus) {
      return;
    }
    setIsSavingReminder(true);
    setReminderError(null);
    try {
      await updateClient(client.id, { reminder: payload });
      onClientChanged();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "შეხსენების შენახვა ვერ მოხერხდა.";
      setReminderError(message);
      throw error;
    } finally {
      setIsSavingReminder(false);
    }
  }

  async function handleVerifyNow() {
    if (!canEditStatus) {
      return;
    }
    setIsVerifying(true);
    setReminderError(null);
    try {
      await verifyClient(client.id);
      onClientChanged();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "კლიენტის გადამოწმება ვერ მოხერხდა.";
      setReminderError(message);
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className="space-y-6">
      <ClientDetailsTopBar
        clientId={client.id}
        canRunMatches={canRunMatches}
        canEditStatus={canEditStatus}
        canShowArchive={archiveAction.canShowArchive}
        canShowRestore={archiveAction.canShowRestore}
        isArchivePending={archiveAction.isPending}
        temporaryLockedFields={temporaryLockedFields}
        recordColor={client.color}
        isSavingColor={isSavingColor}
        colorError={colorError}
        hideFromOthers={client.hideFromOthers}
        isSavingHideFromOthers={isSavingHideFromOthers}
        hideFromOthersError={hideFromOthersError}
        onNavigateToList={() =>
          router.push(isClientArchived(client) ? "/archive?tab=clients" : "/clients")
        }
        onNavigateToEdit={() => router.push(`/clients/${client.id}/edit`)}
        onRequestDelete={deleteAction.requestDelete}
        onOpenChangeStatus={() => setIsChangeStatusOpen(true)}
        onRequestArchive={archiveAction.requestArchive}
        onRequestRestore={archiveAction.requestRestore}
        onSelectColor={(nextColor) => {
          void handleSelectColor(nextColor);
        }}
        onToggleHideFromOthers={(nextHidden) => {
          void handleToggleHideFromOthers(nextHidden);
        }}
      />

      <MatchingLockHint />

      <ClientDetailsSummaryCard
        client={client}
        getLock={getLock}
        onLockChange={handleLockChange}
      />

      <ClientProfileLinkSection client={client} onLinked={onClientChanged} />

      <VerificationReminderPanel
        fields={client}
        presetSet="verification"
        canEdit={canEditStatus}
        isSaving={isSavingReminder}
        isVerifying={isVerifying}
        error={reminderError}
        onSaveReminder={handleSaveReminder}
        onVerifyNow={handleVerifyNow}
      />

      <NoteRemindersSection
        targetType="CLIENT"
        clientId={client.id}
        canCreate={canEditStatus}
      />

      {client.requirements && (
        <ClientDetailsRequirementsSection
          requirements={client.requirements}
          getLock={getLock}
          onLockChange={handleLockChange}
        />
      )}

      <ClientDetailsRelatedPersonsSection relatedPersons={relatedPersons} />

      <ClientHiddenPropertiesSection client={client} canManage={canManageHidden} />

      <ClientCommentThread
        title="კომენტარები"
        comments={publicComments}
        isSubmitting={isPostingComment}
        submitError={commentError}
        onSubmit={handleAddComment}
        onDeleteComment={handleDeletePublicComment}
        deletingCommentId={deletingPublicCommentId}
        deleteError={publicCommentDeleteError}
      />

      <ClientCommentThread
        title="შიდა შენიშვნები"
        comments={internalComments}
        isSubmitting={isPostingComment}
        submitError={commentError}
        onSubmit={handleAddInternalComment}
      />

      {deleteAction.error ? (
        <p className="text-sm text-destructive" role="alert">
          {deleteAction.error}
        </p>
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
      <ClientChangeStatusModal
        open={isChangeStatusOpen}
        client={client}
        onClose={() => setIsChangeStatusOpen(false)}
        onSaved={onClientChanged}
      />
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
    </div>
  );
}
