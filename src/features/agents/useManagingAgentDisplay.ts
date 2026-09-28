"use client";

import { useMemo } from "react";
import { useActiveAdminPrivileges } from "@/features/adminMode/useEffectiveAccessViewer";
import {
  formatManagingAgentDisplayName,
  type ManagingAgentSummary,
} from "@/features/agents/managingAgentSummary";
import { useAgentsList } from "@/features/agents/useAgentsList";

type UseManagingAgentDisplayOptions = {
  userId?: string | null;
  managingAgent?: ManagingAgentSummary | null;
};

type UseManagingAgentDisplayResult = {
  isVisible: boolean;
  agentId: string | null;
  displayName: string | null;
  isLoading: boolean;
};

export function useManagingAgentDisplay(
  options: UseManagingAgentDisplayOptions,
): UseManagingAgentDisplayResult {
  const hasAdminPrivileges = useActiveAdminPrivileges();
  const embeddedAgent = options.managingAgent ?? null;
  const embeddedDisplayName = formatManagingAgentDisplayName(embeddedAgent);
  const ownerUserId = options.userId?.trim() || embeddedAgent?.id.trim() || "";
  const needsAgentListLookup =
    hasAdminPrivileges &&
    Boolean(ownerUserId) &&
    embeddedDisplayName === null;

  const { agents, isLoading } = useAgentsList({
    enabled: needsAgentListLookup,
  });

  return useMemo(() => {
    if (!hasAdminPrivileges || !ownerUserId) {
      return {
        isVisible: false,
        agentId: null,
        displayName: null,
        isLoading: false,
      };
    }

    if (embeddedDisplayName) {
      return {
        isVisible: true,
        agentId: embeddedAgent?.id ?? ownerUserId,
        displayName: embeddedDisplayName,
        isLoading: false,
      };
    }

    const matchedAgent = agents.find((agent) => agent.id === ownerUserId);
    if (matchedAgent) {
      const resolvedName =
        formatManagingAgentDisplayName({
          id: matchedAgent.id,
          fullName: matchedAgent.fullName,
          email: matchedAgent.email,
        }) ?? null;
      return {
        isVisible: true,
        agentId: matchedAgent.id,
        displayName: resolvedName,
        isLoading: false,
      };
    }

    return {
      isVisible: true,
      agentId: ownerUserId,
      displayName: null,
      isLoading: needsAgentListLookup && isLoading,
    };
  }, [
    agents,
    embeddedAgent?.id,
    embeddedDisplayName,
    hasAdminPrivileges,
    isLoading,
    needsAgentListLookup,
    ownerUserId,
  ]);
}
