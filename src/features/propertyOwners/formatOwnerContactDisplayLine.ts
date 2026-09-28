import {
  PRIMARY_CONTACT_LABEL,
  type PropertyOwnerContact,
} from "@/features/propertyOwners/types";

export function isPrimaryOwnerContact(contact: PropertyOwnerContact): boolean {
  if (contact.isPrimary) {
    return true;
  }
  return contact.label.trim() === PRIMARY_CONTACT_LABEL;
}

export function formatOwnerContactDisplayLine(
  contact: PropertyOwnerContact,
  ownerDisplayName: string,
): string {
  const phone = contact.phone.trim();
  if (isPrimaryOwnerContact(contact)) {
    const name = ownerDisplayName.trim();
    if (name !== "") {
      return `${name} — ${phone}`;
    }
    const legacyLabel = contact.label.trim();
    if (legacyLabel !== "" && legacyLabel !== PRIMARY_CONTACT_LABEL) {
      return `${legacyLabel} — ${phone}`;
    }
    return phone;
  }

  const label = contact.label.trim();
  if (label !== "") {
    return `${label} — ${phone}`;
  }

  return phone;
}

export type OwnerPhoneDisplayItem = {
  key: string;
  phone: string;
  displayLine: string;
};

export function buildOwnerPhoneDisplayItems(
  contacts: PropertyOwnerContact[] | null | undefined,
  ownerDisplayName: string,
  fallbackPhones: string[],
): OwnerPhoneDisplayItem[] {
  if (contacts && contacts.length > 0) {
    return contacts
      .filter((contact) => contact.phone.trim() !== "")
      .map((contact) => ({
        key: contact.id,
        phone: contact.phone.trim(),
        displayLine: formatOwnerContactDisplayLine(contact, ownerDisplayName),
      }));
  }

  return fallbackPhones.map((phone, phoneIndex) => ({
    key: `owner-phone-${phoneIndex}-${phone}`,
    phone,
    displayLine: phone,
  }));
}
