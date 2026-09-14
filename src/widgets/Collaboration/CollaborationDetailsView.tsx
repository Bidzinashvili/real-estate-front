"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCurrentUser } from "@/shared/hooks";
import { useCollaborationDetails } from "@/features/collaboration/useCollaborationDetails";
import {
  acceptCollaboration,
  approveAdminCollaboration,
  rejectAdminCollaboration,
  rejectCollaboration,
} from "@/features/collaboration/collaborationApi";
import { CollaborationDetailBody } from "@/widgets/Collaboration/CollaborationDetailBody";

type CollaborationDetailsViewProps = {
  collaborationId: string;
};

export function CollaborationDetailsView({ collaborationId }: CollaborationDetailsViewProps) {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const isAdmin = user?.role === "ADMIN";
  const { collaboration, isLoading, error, refetch } = useCollaborationDetails({
    collaborationId,
    mode: isAdmin ? "admin" : "agent",
    enabled: Boolean(user),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function runAction(action: () => Promise<unknown>) {
    setIsSubmitting(true);
    setActionError(null);
    try {
      await action();
      await refetch();
    } catch (actionFailure) {
      const message =
        actionFailure instanceof Error
          ? actionFailure.message
          : "მოქმედება ვერ შესრულდა.";
      setActionError(message);
      await refetch();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => router.push("/collaborations")}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        თანამშრომლობაზე დაბრუნება
      </button>

      {isUserLoading || isLoading ? (
        <p className="text-sm text-muted-foreground">მოთხოვნა იტვირთება…</p>
      ) : null}
      {!isUserLoading && !isLoading && error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {!isUserLoading && !isLoading && !error && collaboration ? (
        <CollaborationDetailBody
          collaboration={collaboration}
          isAdmin={Boolean(isAdmin)}
          isSubmitting={isSubmitting}
          actionError={actionError}
          onAccept={() => void runAction(() => acceptCollaboration(collaborationId))}
          onReject={() => void runAction(() => rejectCollaboration(collaborationId))}
          onAdminApprove={() => void runAction(() => approveAdminCollaboration(collaborationId))}
          onAdminReject={() => void runAction(() => rejectAdminCollaboration(collaborationId))}
        />
      ) : null}
    </div>
  );
}
