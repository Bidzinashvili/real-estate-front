"use client";

import { useCallback, useEffect, useState } from "react";
import {
  persistSidebarCollapsed,
  readStoredSidebarCollapsed,
} from "@/widgets/AppSidebar/sidebarStorage";

export function useDesktopSidebarCollapsed(): {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
} {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsCollapsed(readStoredSidebarCollapsed());
  }, []);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((current) => {
      const next = !current;
      persistSidebarCollapsed(next);
      return next;
    });
  }, []);

  return { isCollapsed, toggleCollapsed };
}
