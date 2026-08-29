import type { CollaborationProperty } from "@/features/collaboration/collaborationApi.types";

export const COLLABORATION_PROPERTY_DELETED_LABEL =
  "განცხადება მუდმივად წაშლილია";

export function formatCollaborationPropertyAddress(
  listing: CollaborationProperty | null | undefined,
): string {
  if (!listing) {
    return COLLABORATION_PROPERTY_DELETED_LABEL;
  }
  const citySuffix = listing.city ? `, ${listing.city}` : "";
  return `${listing.address}${citySuffix}`;
}

export function formatCollaborationPropertyDistrict(
  listing: CollaborationProperty | null | undefined,
): string | null {
  if (!listing) {
    return null;
  }
  return listing.district;
}
