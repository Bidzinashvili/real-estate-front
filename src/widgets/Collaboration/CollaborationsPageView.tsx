"use client";

import { useCurrentUser } from "@/shared/hooks";
import { AgentCollaborationsView } from "@/widgets/Collaboration/AgentCollaborationsView";
import { AdminCollaborationsView } from "@/widgets/Collaboration/AdminCollaborationsView";

export function CollaborationsPageView() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading || !user) {
    return <p className="text-sm text-muted-foreground">თანამშრომლობა იტვირთება…</p>;
  }

  if (user.role === "ADMIN") {
    return <AdminCollaborationsView />;
  }

  return <AgentCollaborationsView />;
}
