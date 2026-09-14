import { useAdminModeStore } from "@/features/adminMode/adminModeStore";
import { useUserStore } from "@/shared/stores/userStore";

export function requestedAdminModeQuery(): { adminMode?: true } {
  const user = useUserStore.getState().user;
  const isAdminMode = useAdminModeStore.getState().isAdminMode;
  if (user?.role === "ADMIN" && isAdminMode) {
    return { adminMode: true };
  }
  return {};
}
