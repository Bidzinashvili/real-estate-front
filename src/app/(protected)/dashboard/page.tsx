"use client";

import { useRouter } from "next/navigation";
import { useCurrentUser, useSignOut } from "@/shared/hooks";
import { useAgentsList } from "@/features/agents/useAgentsList";
import { usePropertiesList } from "@/features/properties/usePropertiesList";
import { DashboardHeader } from "@/widgets/Dashboard/DashboardHeader";
import { DashboardActions } from "@/widgets/Dashboard/DashboardActions";
import { AdminAgentsSection } from "@/widgets/Dashboard/AdminAgentsSection";
import { AdminPropertiesSection } from "@/widgets/Dashboard/AdminPropertiesSection";

function DashboardPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const signOut = useSignOut();

  const isAdmin = user?.role === "ADMIN";
  const { agents, isLoading, error } = useAgentsList({ enabled: Boolean(isAdmin) });
  const {
    properties,
    isLoading: isLoadingProperties,
    error: propertiesError,
  } = usePropertiesList({ enabled: Boolean(isAdmin) });

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader email={user.email} role={user.role} onSignOut={signOut} />
      <DashboardActions isAdmin={isAdmin} />
      {isAdmin && (
        <>
          <AdminAgentsSection
            agents={agents}
            isLoading={isLoading}
            error={error}
            onAddAgent={() => router.push("/agents/new")}
          />
          <AdminPropertiesSection
            properties={properties}
            isLoading={isLoadingProperties}
            error={propertiesError}
          />
        </>
      )}
    </>
  );
}

export default DashboardPage;

