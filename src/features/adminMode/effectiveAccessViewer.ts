export type AccessViewer = {
  id: string;
  role: "ADMIN" | "AGENT";
};

export function resolveEffectiveAccessViewer(
  viewer: AccessViewer | null | undefined,
  isAdminMode: boolean,
): AccessViewer | null {
  if (!viewer) {
    return null;
  }
  if (viewer.role === "ADMIN" && !isAdminMode) {
    return { id: viewer.id, role: "AGENT" };
  }
  return viewer;
}

export function hasActiveAdminPrivileges(
  viewer: AccessViewer | null | undefined,
  isAdminMode: boolean,
): boolean {
  return viewer?.role === "ADMIN" && isAdminMode;
}
