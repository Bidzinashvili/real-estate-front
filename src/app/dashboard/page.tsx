"use client";

import { useRouter } from "next/navigation";
import { useCurrentUser, useSignOut } from "@/shared/hooks";
import { useAgentsList } from "@/features/agents/useAgentsList";
import { DashboardHeader } from "@/widgets/Dashboard/DashboardHeader";
import { DashboardActions } from "@/widgets/Dashboard/DashboardActions";
import { AdminAgentsSection } from "@/widgets/Dashboard/AdminAgentsSection";

function DashboardPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const signOut = useSignOut();

  const isAdmin = user?.role === "ADMIN";
  const { agents, isLoading, error } = useAgentsList({ enabled: Boolean(isAdmin) });

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading your dashboard…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <DashboardHeader email={user.email} role={user.role} onSignOut={signOut} />
        <DashboardActions isAdmin={isAdmin} />
        {isAdmin && (
          <AdminAgentsSection
            agents={agents}
            isLoading={isLoading}
            error={error}
            onAddAgent={() => router.push("/agents/new")}
          />
        )}
      </div>
    </main>
  );
}

export default DashboardPage;
