"use client";

import { useMemo } from "react";
import type { Property } from "@/features/properties/propertyModelTypes";
import { hasAuthorizedOwnerInformation } from "@/features/properties/authorizedPropertyFields";
import {
  buildOwnerPhoneDisplayItems,
  type OwnerPhoneDisplayItem,
} from "@/features/propertyOwners/formatOwnerContactDisplayLine";
import { usePropertyOwnerDetails } from "@/features/propertyOwners/usePropertyOwnerDetails";

type UsePropertyOwnerContactsForPropertyResult = {
  phoneDisplayItems: OwnerPhoneDisplayItem[];
};

function readFallbackOwnerPhones(property: Property): string[] {
  return (property.ownerPhones ?? [])
    .map((ownerPhone) => ownerPhone.trim())
    .filter((ownerPhone) => ownerPhone !== "");
}

export function usePropertyOwnerContactsForProperty(
  property: Property,
  enabled = true,
): UsePropertyOwnerContactsForPropertyResult {
  const mayLoadOwnerProfile =
    enabled &&
    hasAuthorizedOwnerInformation(property) &&
    Boolean(property.propertyOwner?.id);

  const ownerId = mayLoadOwnerProfile ? property.propertyOwner!.id : "";

  const { owner } = usePropertyOwnerDetails(ownerId);

  const phoneDisplayItems = useMemo(() => {
    const fallbackPhones = readFallbackOwnerPhones(property);
    const ownerDisplayName =
      property.propertyOwner?.name?.trim() ||
      property.ownerName?.trim() ||
      owner?.name?.trim() ||
      "";

    const contacts =
      owner && owner.contacts.length > 0 ? owner.contacts : null;

    return buildOwnerPhoneDisplayItems(
      contacts,
      ownerDisplayName,
      fallbackPhones,
    );
  }, [
    owner,
    property.ownerName,
    property.ownerPhones,
    property.propertyOwner?.name,
  ]);

  return { phoneDisplayItems };
}
