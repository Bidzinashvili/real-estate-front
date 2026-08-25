"use client";

import { useEffect, useState } from "react";
import { canRunClientMatches } from "@/features/matching/canRunClientMatches";
import { useCurrentUser } from "@/shared/hooks";
import { useRouter } from "next/navigation";
import { deleteClientComment, updateClient, verifyClient, archiveClient, unarchiveClient } from "@/features/clients/api";
import { useAddClientComment } from "@/features/clients/useAddClientComment";
import { useDeleteClient } from "@/features/clients/useDeleteClient";
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
import { ConfirmDialog } from "@/widgets/ConfirmDialog/ConfirmDialog";
import { ClientCommentThread } from "./ClientCommentThread";
import { ClientDetailsRelatedPersonsSection } from "./ClientDetailsRelatedPersonsSection";
import { ClientDetailsRequirementsSection } from "./ClientDetailsRequirementsSection";
import { ClientDetailsSummaryCard } from "./ClientDetailsSummaryCard";
import { ClientDetailsTopBar } from "./ClientDetailsTopBar";
import { ClientProfileLinkSection } from "@/widgets/ClientDetails/ClientProfileLinkSection";
import { ClientChangeStatusModal } from "@/widgets/Clients/ClientChangeStatusModal";
import { VerificationReminderPanel } from "@/widgets/Lifecycle/VerificationReminderPanel";
import type { ReminderConfigPayload } from "@/features/lifecycle/lifecycleEnums";
import { canRestoreArchivedClient } from "@/features/lifecycle/canRestoreArchivedRecord";
import { isClientArchived } from "@/features/lifecycle/isClientArchived";
import { useArchiveAction } from "@/features/lifecycle/useArchiveAction";
import { ArchiveConfirmDialog } from "@/widgets/Lifecycle/ArchiveConfirmDialog";

type ClientDetailsContentProps = {
  client: ClientDetail;
  onClientChanged: () => void;
};

export function ClientDetailsContent({ client, onClientChanged }: ClientDetailsContentProps) {
  const router = useRouter();
  const { remove, isLoading: isDeleting, error: deleteError } = useDeleteClient();
  const {
    addComment,
    addInternalComment,
    isLoading: isPostingComment,
    error: commentError,
  } = useAddClientComment();
  const [deleteOpen, setDeleteOpen] = useState(false);
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
  const archiveAction = useArchiveAction({
    canManage: canEditStatus,
    isArchived: isClientArchived(client),
    canRestore: canRestoreArchivedClient(client),
    onArchive: () => archiveClient(client.id),
    onRestore: () => unarchiveClient(client.id),
    onSuccess: onClientChanged,
  });
  const relatedPersons = client.relatedPersons ?? [];
  const [lockOverlay, setLockOverlay] = useState<
    Partial<Record<ClientPersistableLockKey, LockState>>
  >({});
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [isSavingReminder, setIsSavingReminder] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [reminderError, setReminderError] = useState<string | null>(null);

  useEffect(() => {
    setLockOverlay({});
  }, [client.id, client.updatedAt]);

  const [publicComments, setPublicComments] = useState<Comment[]>(
    client.comments ?? [],
  );
  const [internalComments, setInternalComments] = useState<Comment[]>(
    client.internalComments ?? [],
  );

  const handleDelete = async () => {
    await remove(client.id);
    router.push("/clients");
  };

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
        onNavigateToList={() =>
          router.push(isClientArchived(client) ? "/archive?tab=clients" : "/clients")
        }
        onNavigateToEdit={() => router.push(`/clients/${client.id}/edit`)}
        onRequestDelete={() => setDeleteOpen(true)}
        onOpenChangeStatus={() => setIsChangeStatusOpen(true)}
        onRequestArchive={archiveAction.requestArchive}
        onRequestRestore={archiveAction.requestRestore}
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

      {client.requirements && (
        <ClientDetailsRequirementsSection
          requirements={client.requirements}
          getLock={getLock}
          onLockChange={handleLockChange}
        />
      )}

      <ClientDetailsRelatedPersonsSection relatedPersons={relatedPersons} />

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

      {deleteError && (
        <p className="text-sm text-destructive" role="alert">
          {deleteError}
        </p>
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="წავშალოთ ეს კლიენტი?"
        description="კლიენტი დაარქივდება. აღსადგენად დაუკავშირდით მხარდაჭერას."
        confirmLabel="დიახ, წაშლა"
        cancelLabel="გაუქმება"
        isProcessing={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
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
