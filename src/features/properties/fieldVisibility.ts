/**
 * Field visibility for properties: which fields are visible to other agents vs. owner/admin.
 * "private" = owner + admin only (with admin mode on)
 * "public" = visible to all agents
 *
 * Keep in sync with the backend `PropertyService.sanitizeForViewer`
 * (home-agency-api/src/property/property.service.ts). The create/edit forms
 * show these as eye icons (shared/ui/VisibilityHint.tsx): every field defaults
 * to public, private ones pass `visibility="private"`.
 */
export const PROPERTY_FIELD_VISIBILITY: Record<string, "public" | "private"> = {
  // Owner/contact info
  ownerName: "private",
  ownerPhones: "private",
  ownerWhatsapp: "private",

  // Pricing
  pricePublic: "public",
  priceInternal: "private",
  currency: "public",

  // Property IDs
  myHomeId: "private",
  ssGeId: "private",
  externalIds: "private",
  ourSiteId: "public",

  // Identifiers
  title: "private",
  cadastralCode: "private",

  // Structure
  buildingNumber: "private",

  // Comments
  publicComment: "public",
  privateComment: "private",
  internalText: "private",

  // Images
  images: "public", // but individual images can have hiddenFromOthers flag

  // Organization
  color: "private",
  hideFromOthers: "private",
  readyToUpload: "private",
};

export function getPropertyFieldVisibility(field: string): "public" | "private" | undefined {
  return PROPERTY_FIELD_VISIBILITY[field];
}

export function isPropertyFieldPublic(field: string): boolean {
  return getPropertyFieldVisibility(field) === "public";
}
