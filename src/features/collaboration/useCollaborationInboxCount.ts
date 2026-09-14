"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchAdminCollaborations,
  fetchCollaborations,
} from "@/features/collaboration/collaborationApi";

const INBOX_POLL_INTERVAL_MS = 45_000;

type UseCollaborationInboxCountArgs = {
  enabled: boolean;
  role: "ADMIN" | "AGENT" | null;
};

type UseCollaborationInboxCountResult = {
  count: number;
  refetch: () => Promise<void>;
};

export function useCollaborationInboxCount({
  enabled,
  role,
}: UseCollaborationInboxCountArgs): UseCollaborationInboxCountResult {
  const [count, setCount] = useState(0);

  const loadCount = useCallback(async () => {
    if (!enabled || !role) {
      setCount(0);
      return;
    }
    try {
      if (role === "ADMIN") {
        const result = await fetchAdminCollaborations({
          statusGroup: "WAITING_ADMIN",
          page: 1,
          limit: 1,
        });
        setCount(result.total);
        return;
      }
      const result = await fetchCollaborations({
        statusGroup: "PENDING",
        page: 1,
        limit: 100,
      });
      const incomingCount = result.collaborations.filter(
        (item) => item.viewerRole === "RECIPIENT",
      ).length;
      setCount(incomingCount);
    } catch {
      setCount(0);
    }
  }, [enabled, role]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    void loadCount();
    const intervalId = window.setInterval(() => {
      void loadCount();
    }, INBOX_POLL_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [enabled, loadCount]);

  return { count, refetch: loadCount };
}
