import type { Property } from "@/features/properties/propertyModelTypes";

function trimmedAuthorizedText(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmedValue = value.trim();
  return trimmedValue === "" ? null : trimmedValue;
}

export function hasAuthorizedInternalPrice(property: Property): boolean {
  return property.priceInternal !== undefined;
}

export function isPrivateCommentAuthorized(property: Property): boolean {
  return property.privateComment !== undefined || property.comment !== undefined;
}

export function isInternalTextAuthorized(property: Property): boolean {
  return property.internalText !== undefined || property.internalComment !== undefined;
}

export function hasAuthorizedPrivateNotes(property: Property): boolean {
  return isPrivateCommentAuthorized(property) || isInternalTextAuthorized(property);
}

export function readAuthorizedPrivateComment(property: Property): string | null {
  if (property.privateComment !== undefined) {
    return trimmedAuthorizedText(property.privateComment);
  }
  if (property.comment !== undefined) {
    return trimmedAuthorizedText(property.comment);
  }
  return null;
}

export function readAuthorizedInternalText(property: Property): string | null {
  if (property.internalText !== undefined) {
    return trimmedAuthorizedText(property.internalText);
  }
  if (property.internalComment !== undefined) {
    return trimmedAuthorizedText(property.internalComment);
  }
  return null;
}

export function hasAuthorizedOwnerInformation(property: Property): boolean {
  const ownerName = property.ownerName?.trim() ?? "";
  const ownerPhones = (property.ownerPhones ?? []).some(
    (ownerPhone) => ownerPhone.trim() !== "",
  );
  const ownerWhatsapp = property.ownerWhatsapp?.trim() ?? "";
  return Boolean(
    property.propertyOwner ||
      property.ownerId ||
      ownerName !== "" ||
      ownerPhones ||
      ownerWhatsapp !== "",
  );
}

export function hasAuthorizedBuildingNumber(
  apartment: { buildingNumber?: string | null } | null,
): boolean {
  return apartment != null && apartment.buildingNumber !== undefined;
}
