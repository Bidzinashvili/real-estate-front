import type { ClientStatus } from "@/features/clients/clientEnums";

export const CLIENT_DETAILS_STATUS_BADGE_CLASSES: Record<ClientStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  ARCHIVED: "bg-slate-100 text-slate-600",
};
