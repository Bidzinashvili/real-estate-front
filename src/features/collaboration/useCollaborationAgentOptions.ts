"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCollaborationAgentOptions } from "@/features/collaboration/collaborationApi";
import type { CollaborationAgentOption } from "@/features/collaboration/collaborationApi.types";

type UseCollaborationAgentOptionsArgs = {
  enabled: boolean;
  search: string;
};

type UseCollaborationAgentOptionsResult = {
  agents: CollaborationAgentOption[];
  isLoading: boolean;
  error: string | null;
};

export function useCollaborationAgentOptions({
  enabled,
  search,
}: UseCollaborationAgentOptionsArgs): UseCollaborationAgentOptionsResult {
  const [agents, setAgents] = useState<CollaborationAgentOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const loadAgents = useCallback(async () => {
    if (!enabled) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchCollaborationAgentOptions(debouncedSearch);
      setAgents(result.agents ?? []);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "აგენტების ჩატვირთვა ვერ მოხერხდა.";
      setError(message);
      setAgents([]);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, debouncedSearch]);

  useEffect(() => {
    void loadAgents();
  }, [loadAgents]);

  return { agents, isLoading, error };
}
