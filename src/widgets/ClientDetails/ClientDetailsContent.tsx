"use client";

import { useState } from "react";
import { useCurrentUser } from "@/shared/hooks";
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

  const { user } = useCurrentUser();
  const canRunMatches =
    user?.role === "ADMIN" || (user?.role === "AGENT" && user.id === client.userId);
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

  return (
    <>
      <ClientDetailsTopBar
        clientId={client.id}
        canRunMatches={canRunMatches}
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
    </>
  );
}
