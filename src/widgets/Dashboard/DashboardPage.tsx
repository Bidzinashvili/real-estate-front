"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser, useSignOut } from "@/shared/hooks";
import { useAgentsList } from "@/features/agents/useAgentsList";
import { usePropertiesList } from "@/features/properties/usePropertiesList";
import { DashboardHeader } from "@/widgets/Dashboard/DashboardHeader";
import { DashboardActions } from "@/widgets/Dashboard/DashboardActions";
import type { GetRemindersQuery } from "@/features/reminders/remindersApi";
import { useRemindersList } from "@/features/reminders/useRemindersList";
import { AdminAgentsSection } from "@/widgets/Dashboard/AdminAgentsSection";
import { AdminPropertiesSection } from "@/widgets/Dashboard/AdminPropertiesSection";
import { DashboardRemindersSection } from "@/widgets/Dashboard/DashboardRemindersSection";
import { DashboardAdminAnnouncement } from "@/widgets/Dashboard/DashboardAdminAnnouncement";
import { DashboardSummaryStrip } from "@/widgets/Dashboard/DashboardSummaryStrip";
import { DashboardUsdRateCard } from "@/widgets/Dashboard/DashboardUsdRateCard";
import { DashboardNotificationsPreview } from "@/widgets/Dashboard/DashboardNotificationsPreview";
import { LoadingState } from "@/shared/ui/PageState";

const DASHBOARD_REMINDERS_QUERY: GetRemindersQuery = {
  timing: "ALL",
  limit: 500,
  page: 1,
};
const DASHBOARD_REMINDERS_POLL_INTERVAL_MS = 60_000;

export function DashboardPage() {
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

  const {
    reminders,
    isLoading: isLoadingReminders,
    error: remindersError,
    refetch: refetchReminders,
  } = useRemindersList({
    enabled: Boolean(user),
    query: DASHBOARD_REMINDERS_QUERY,
    pollIntervalMs: DASHBOARD_REMINDERS_POLL_INTERVAL_MS,
  });

  const dueRemindersCount = useMemo(() => {
    return reminders.filter((row) => !row.sentAtIso).length;
  }, [reminders]);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingState title="მთავარი იტვირთება…" className="w-full max-w-sm" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader email={user.email} role={user.role} onSignOut={signOut} />

      <DashboardAdminAnnouncement isAdmin={isAdmin} />

      <DashboardSummaryStrip role={user.role} dueRemindersCount={dueRemindersCount} />

      <DashboardUsdRateCard />

      <DashboardNotificationsPreview />

      <DashboardRemindersSection
        reminders={reminders}
        isLoading={isLoadingReminders}
        error={remindersError}
        onRemindersChanged={() => void refetchReminders()}
      />

      <DashboardActions isAdmin={isAdmin} />

      {isAdmin ? (
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
      ) : null}
    </div>
  );
}
