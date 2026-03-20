import type { Property } from "@/features/properties/types";

type UserRole = "ADMIN" | "AGENT";

export function canViewPrivateListingFields(
  user: { id: string; role: UserRole },
  property: Property,
): boolean {
  if (user.role === "ADMIN") return true;
  return property.userId === user.id;
}
