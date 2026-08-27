import { viewerCanManageRecord, viewerOwnsRecord } from "@/features/databaseList/viewerOwnership";
import type { Property } from "@/features/properties/types";

type UserRole = "ADMIN" | "AGENT";

export function canViewPrivateListingFields(
  user: { id: string; role: UserRole },
  property: Property,
): boolean {
  return viewerCanManageRecord(property, user);
}

export function canManageProperty(
  user: { id: string; role: UserRole } | null | undefined,
  property: Property,
): boolean {
  return viewerCanManageRecord(property, user);
}

export function isOwnedProperty(
  user: { id: string; role: UserRole } | null | undefined,
  property: Property,
): boolean {
  return viewerOwnsRecord(property, user);
}
