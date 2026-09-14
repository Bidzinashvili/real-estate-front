import { formatDealTypeLabel } from "@/features/properties/dealType";
import { formatPropertyTypeLabel } from "@/features/properties/addPropertyFormOptions";
import type { PropertyOwnerLinkedProperty } from "@/features/propertyOwners/types";

export function ownerLinkedPropertyTitle(
  listing: PropertyOwnerLinkedProperty,
): string {
  const explicitTitle = listing.title?.trim();
  if (explicitTitle) {
    return explicitTitle;
  }

  const dealLabel = formatDealTypeLabel(listing.dealType);
  const typeLabel = formatPropertyTypeLabel(listing.propertyType) ?? listing.propertyType;
  const place = listing.district.trim() || listing.city.trim();
  const parts = [dealLabel, typeLabel, place].filter((part) => part !== "");
  return parts.join(" ") || "განცხადება";
}

export function ownerLinkedPropertySubtitle(
  listing: PropertyOwnerLinkedProperty,
): string {
  const street = listing.street?.trim() ?? "";
  if (street) {
    return street;
  }
  return listing.address.trim();
}
