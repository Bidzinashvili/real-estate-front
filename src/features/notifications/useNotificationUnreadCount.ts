"use client";

import { useMemo } from "react";
import { useNotificationsList } from "@/features/notifications/useNotificationsList";

type UseNotificationUnreadCountArgs = {
  enabled: boolean;
};

export function useNotificationUnreadCount({
  enabled,
}: UseNotificationUnreadCountArgs): { count: number; refetch: () => Promise<unknown> } {
  const { notifications, refetch } = useNotificationsList({ enabled });

  const count = useMemo(
    () => notifications.filter((item) => item.readAt === null).length,
    [notifications],
  );

  return { count, refetch };
}
