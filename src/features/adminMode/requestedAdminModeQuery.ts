import { useAdminModeStore } from "@/features/adminMode/adminModeStore";
import { useUserStore } from "@/shared/stores/userStore";

export type AdminModeQuery = {
  adminMode?: true;
};

export function requestedAdminModeQuery(): AdminModeQuery {
  const user = useUserStore.getState().user;
  const isAdminMode = useAdminModeStore.getState().isAdminMode;
  if (user?.role === "ADMIN" && isAdminMode) {
    return { adminMode: true };
  }
  return {};
}

export function adminModeSearchParams(explicitAdminMode?: boolean): AdminModeQuery {
  if (explicitAdminMode === true) {
    return { adminMode: true };
  }
  if (explicitAdminMode === false) {
    return {};
  }
  return requestedAdminModeQuery();
}

export function withRequestedAdminMode<Query extends { adminMode?: boolean }>(
  query: Query | undefined,
): Query {
  const requested = requestedAdminModeQuery();
  if (query == null) {
    return requested as Query;
  }
  if (requested.adminMode === true) {
    return { ...query, adminMode: true };
  }
  if (query.adminMode !== true) {
    return query;
  }
  const queryWithoutAdminMode: Query = { ...query };
  delete queryWithoutAdminMode.adminMode;
  return queryWithoutAdminMode;
}
