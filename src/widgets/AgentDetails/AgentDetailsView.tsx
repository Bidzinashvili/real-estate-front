"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUpdateAgent } from "@/features/agents/useUpdateAgent";
import { useDeleteAgent } from "@/features/agents/useDeleteAgent";
import { useAgentsList } from "@/features/agents/useAgentsList";
import { AgentDetailsCard } from "@/widgets/AgentDetails/AgentDetailsCard";
import { ConfirmDialog } from "@/widgets/ConfirmDialog/ConfirmDialog";

type AgentDetailsViewProps = {
  agentId: string;
};

export function AgentDetailsView({ agentId }: AgentDetailsViewProps) {
  const router = useRouter();
  const { agents, isLoading, error } = useAgentsList({ enabled: true });
  const agent = agents.find((item) => item.id === agentId) ?? null;
  const { update, isLoading: isSaving, error: saveError } = useUpdateAgent();
  const {
    deleteAgent,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteAgent();
  const [deleteOpen, setDeleteOpen] = useState(false);

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
  };

  const handleConfirmDelete = async () => {
    if (!agent) {
      return;
    }
    await deleteAgent(agent.id);
    router.push("/dashboard");
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
        <AgentDetailsCard
          agent={agent}
          isSaving={isSaving}
          saveError={saveError}
          onSubmit={handleSubmit}
          onDeleteClick={() => setDeleteOpen(true)}
        />
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
    </main>
  );
}

