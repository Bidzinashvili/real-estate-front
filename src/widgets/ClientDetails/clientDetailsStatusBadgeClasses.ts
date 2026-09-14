import type { ClientStatus } from "@/features/clients/clientEnums";

export const CLIENT_DETAILS_STATUS_BADGE_CLASSES: Record<ClientStatus, string> = {
  ACTIVE: "bg-success-muted text-success-foreground",
  INACTIVE: "bg-muted text-muted-foreground",
  NEEDS_VERIFICATION: "bg-warning-muted text-warning-foreground",
  IN_PROGRESS: "bg-primary/15 text-primary",
  ARCHIVED: "bg-muted text-muted-foreground",
};
