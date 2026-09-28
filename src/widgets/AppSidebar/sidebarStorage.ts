export const SIDEBAR_COLLAPSED_STORAGE_KEY = "sidebar-collapsed";

export function readStoredSidebarCollapsed(): boolean {
  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function persistSidebarCollapsed(isCollapsed: boolean): void {
  try {
    window.localStorage.setItem(
      SIDEBAR_COLLAPSED_STORAGE_KEY,
      isCollapsed ? "true" : "false",
    );
  } catch {
    // Ignore storage failures; in-memory state still applies for the session.
  }
}
