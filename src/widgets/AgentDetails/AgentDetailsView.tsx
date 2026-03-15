"use client";

import { useState } from "react";
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
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <p className="text-slate-500">Loading agent details…</p>
      </main>
    );
  }

  if (error || !agent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="flex w-full max-w-xl flex-col gap-4 px-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="self-start text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            ← Back to dashboard
          </button>
          <p className="text-slate-500">
            {error ?? "We could not find this agent."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
      <div className="flex w-full max-w-xl flex-col gap-4 px-4">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="self-start text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          ← Back to dashboard
        </button>
        <AgentDetailsCard
          agent={agent}
          isSaving={isSaving}
          saveError={saveError}
          onSubmit={handleSubmit}
          onDeleteClick={() => setDeleteOpen(true)}
        />
        {deleteError && (
          <p className="px-1 text-sm text-red-600" role="alert">
            {deleteError}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete this agent?"
        description="This will remove the agent from your list. You can always add them again later."
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </main>
  );
}

