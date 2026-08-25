export const PROPERTY_OWNERS_LIST_HREF = "/property-owners";

export const PROPERTY_OWNERS_NEW_HREF = "/property-owners/new";

export function propertyOwnerHref(ownerId: string): string {
  return `/property-owners/${ownerId}`;
}
