"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUpdateAgent } from "@/features/agents/useUpdateAgent";
import { useDeleteAgent } from "@/features/agents/useDeleteAgent";
import { useAgentDetails } from "@/features/agents/useAgentDetails";
import { useResendAgentSetup } from "@/features/agents/useResendAgentSetup";
import { useResetAgentPassword } from "@/features/agents/useResetAgentPassword";
import { AgentDetailsCard } from "@/widgets/AgentDetails/AgentDetailsCard";
import { AdminResetPasswordDialog } from "@/widgets/AgentDetails/AdminResetPasswordDialog";
import { ConfirmDialog } from "@/widgets/ConfirmDialog/ConfirmDialog";
import { PasswordSetBadge } from "@/widgets/Agents/PasswordSetBadge";
import { AUTH_COPY } from "@/features/auth/authCopy";

type AgentDetailsViewProps = {
  agentId: string;
};

export function AgentDetailsView({ agentId }: AgentDetailsViewProps) {
  const router = useRouter();
  const { agent, isLoading, error, reload } = useAgentDetails(agentId);
  const { update, isLoading: isSaving, error: saveError } = useUpdateAgent();
  const {
    deleteAgent,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteAgent();
  const {
    resend,
    isLoading: isResending,
    error: resendError,
  } = useResendAgentSetup();
  const {
    resetPassword,
    isLoading: isResetting,
    error: resetError,
  } = useResetAgentPassword();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/dashboard");
  };

  const handleSubmit = async (values: {
    fullName: string;
    email: string;
    phone: string;
  }) => {
    if (!agent) {
      return;
    }
    await update(agent.id, values);
    reload();
  };

  const handleConfirmDelete = async () => {
    if (!agent) {
      return;
    }
    await deleteAgent(agent.id);
    router.push("/dashboard");
  };

  const handleResendSetup = async () => {
    if (!agent) {
      return;
    }
    setStatusMessage(null);
    await resend(agent.id);
    setStatusMessage(AUTH_COPY.resendSetupSuccess);
  };

  const handleResetPassword = async (newPassword: string) => {
    if (!agent) {
      return;
    }
    setStatusMessage(null);
    await resetPassword(agent.id, newPassword);
    setResetOpen(false);
    setStatusMessage(AUTH_COPY.adminResetSuccess);
    reload();
  };

  if (isLoading || (!agent && !error)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted text-foreground">
        <p className="text-muted-foreground">აგენტის დეტალები იტვირთება…</p>
      </main>
    );
  }

  if (error || !agent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted text-foreground">
        <div className="flex w-full max-w-xl flex-col gap-4 px-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="self-start text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>უკან</span>
            </span>
          </button>
          <p className="text-muted-foreground">
            {error ?? "აგენტი ვერ მოიძებნა."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted text-foreground">
      <div className="flex w-full max-w-xl flex-col gap-4 px-4 py-8">
        <button
          type="button"
          onClick={handleGoBack}
          className="self-start text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>უკან</span>
          </span>
        </button>
        <div className="flex items-center gap-2">
          <PasswordSetBadge passwordSet={agent.passwordSet} />
        </div>
        <AgentDetailsCard
          agent={agent}
          isSaving={isSaving}
          saveError={saveError}
          onSubmit={handleSubmit}
          onDeleteClick={() => setDeleteOpen(true)}
        />

        <section className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
          <h2 className="text-base font-semibold text-foreground">
            {AUTH_COPY.securitySectionTitle}
          </h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {agent.passwordSet === false ? (
              <button
                type="button"
                onClick={() => void handleResendSetup()}
                disabled={isResending}
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isResending ? AUTH_COPY.submitting : AUTH_COPY.resendSetup}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setStatusMessage(null);
                setResetOpen(true);
              }}
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
            >
              {AUTH_COPY.adminResetPassword}
            </button>
          </div>
          {statusMessage ? (
            <p className="mt-3 text-sm text-foreground" role="status">
              {statusMessage}
            </p>
          ) : null}
          {resendError ? (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {resendError}
            </p>
          ) : null}
        </section>

        {deleteError && (
          <p className="px-1 text-sm text-destructive" role="alert">
            {deleteError}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="წავშალოთ ეს აგენტი?"
        description="აგენტი წაიშლება სიიდან. საჭიროების შემთხვევაში მოგვიანებით კვლავ შეგიძლიათ დამატება."
        confirmLabel="დიახ, წაშლა"
        cancelLabel="გაუქმება"
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />

      <AdminResetPasswordDialog
        open={resetOpen}
        agentName={agent.fullName}
        isProcessing={isResetting}
        error={resetError}
        onSubmit={handleResetPassword}
        onCancel={() => setResetOpen(false)}
      />
    </main>
  );
}
