"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteClientComment } from "@/features/clients/api";
import { useAddClientComment } from "@/features/clients/useAddClientComment";
import { useDeleteClient } from "@/features/clients/useDeleteClient";
import type { ClientDetail, Comment } from "@/features/clients/types";
import { ConfirmDialog } from "@/widgets/ConfirmDialog/ConfirmDialog";
import { ClientCommentThread } from "./ClientCommentThread";
import { ClientDetailsRelatedPersonsSection } from "./ClientDetailsRelatedPersonsSection";
import { ClientDetailsRequirementsSection } from "./ClientDetailsRequirementsSection";
import { ClientDetailsSummaryCard } from "./ClientDetailsSummaryCard";
import { ClientDetailsTopBar } from "./ClientDetailsTopBar";

type ClientDetailsContentProps = {
  client: ClientDetail;
};

export function ClientDetailsContent({ client }: ClientDetailsContentProps) {
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

  const relatedPersons = client.relatedPersons ?? [];

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
          : "Could not delete this comment right now.";
      setPublicCommentDeleteError(message);
    } finally {
      setDeletingPublicCommentId(null);
    }
  };

  const handleAddInternalComment = async (text: string) => {
    const newComment = await addInternalComment(client.id, text);
    setInternalComments((prev) => [newComment, ...prev]);
  };

  return (
    <>
      <ClientDetailsTopBar
        onNavigateToList={() => router.push("/clients")}
        onNavigateToEdit={() => router.push(`/clients/${client.id}/edit`)}
        onRequestDelete={() => setDeleteOpen(true)}
      />

      <ClientDetailsSummaryCard client={client} />

      {client.requirements && (
        <ClientDetailsRequirementsSection requirements={client.requirements} />
      )}

      <ClientDetailsRelatedPersonsSection relatedPersons={relatedPersons} />

      <ClientCommentThread
        title="Comments"
        comments={publicComments}
        isSubmitting={isPostingComment}
        submitError={commentError}
        onSubmit={handleAddComment}
        onDeleteComment={handleDeletePublicComment}
        deletingCommentId={deletingPublicCommentId}
        deleteError={publicCommentDeleteError}
      />

      <ClientCommentThread
        title="Internal notes"
        comments={internalComments}
        isSubmitting={isPostingComment}
        submitError={commentError}
        onSubmit={handleAddInternalComment}
      />

      {deleteError && (
        <p className="text-sm text-red-600" role="alert">
          {deleteError}
        </p>
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="Delete this client?"
        description="This will soft-delete the client record. You can contact support to restore it."
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        isProcessing={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
