"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchCollaborationById,
  fetchAdminCollaborationById,
} from "@/features/collaboration/collaborationApi";
import type { CollaborationRequestDto } from "@/features/collaboration/collaborationApi.types";

type UseCollaborationDetailsArgs = {
  collaborationId: string;
  mode: "agent" | "admin";
  enabled?: boolean;
};

type UseCollaborationDetailsResult = {
  collaboration: CollaborationRequestDto | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<CollaborationRequestDto | null>;
};

export function useCollaborationDetails({
  collaborationId,
  mode,
  enabled = true,
}: UseCollaborationDetailsArgs): UseCollaborationDetailsResult {
  const [collaboration, setCollaboration] = useState<CollaborationRequestDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetails = useCallback(async (): Promise<CollaborationRequestDto | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result =
        mode === "admin"
          ? await fetchAdminCollaborationById(collaborationId)
          : await fetchCollaborationById(collaborationId);
      setCollaboration(result);
      return result;
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "თანამშრომლობის მოთხოვნის ჩატვირთვა ვერ მოხერხდა.";
      setError(message);
      setCollaboration(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [collaborationId, mode]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    void loadDetails();
  }, [enabled, loadDetails]);

  return { collaboration, isLoading, error, refetch: loadDetails };
}
