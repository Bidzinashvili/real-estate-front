import type {
  CollaborationClient,
  CollaborationProperty,
  CollaborationRequestDto,
} from "@/features/collaboration/collaborationApi.types";

export const COLLABORATION_PROPERTY_DELETED_LABEL =
  "განცხადება მუდმივად წაშლილია";

export const COLLABORATION_CLIENT_TARGET_LABEL = "კლიენტის თანამშრომლობა";

export function formatCollaborationClientLabel(
  clientRecord: CollaborationClient | null | undefined,
  identitiesRevealed: boolean,
): string {
  if (!clientRecord) {
    return COLLABORATION_CLIENT_TARGET_LABEL;
  }
  if (identitiesRevealed && clientRecord.name?.trim()) {
    return clientRecord.name.trim();
  }
  return "კლიენტი · დეტალები დამალულია დამტკიცებამდე";
}

export function formatCollaborationRequestHeadline(
  collaboration: Pick<CollaborationRequestDto, "property" | "client">,
  identitiesRevealed = false,
): string {
  if (collaboration.property) {
    return formatCollaborationPropertyAddress(collaboration.property);
  }
  return formatCollaborationClientLabel(collaboration.client, identitiesRevealed);
}

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
