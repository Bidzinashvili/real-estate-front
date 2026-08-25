import {
  PRIMARY_CONTACT_LABEL,
  type NestedPropertyOwnerContactInput,
  type NestedPropertyOwnerInput,
  type OwnerContactDraft,
  type PropertyOwnerAssignment,
} from "@/features/propertyOwners/types";
import { isPhoneLike } from "@/features/propertyOwners/phoneLike";

export function createContactLocalId(): string {
  return `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createOwnerContactDraft(
  phone = "",
  label = PRIMARY_CONTACT_LABEL,
  isPrimary = false,
): OwnerContactDraft {
  return {
    localId: createContactLocalId(),
    label,
    phone,
    isPrimary,
  };
}

export function emptyOwnerAssignment(): PropertyOwnerAssignment {
  return {
    lookupPhone: "",
    selectedOwnerId: null,
    matchedOwnerName: "",
    matchedContactLabel: "",
    matchedContactPhone: "",
    name: "",
    comment: "",
    contacts: [createOwnerContactDraft("", PRIMARY_CONTACT_LABEL, true)],
  };
}

export function withSinglePrimaryContact(
  contacts: OwnerContactDraft[],
  primaryLocalId: string,
): OwnerContactDraft[] {
  return contacts.map((contact) => ({
    ...contact,
    isPrimary: contact.localId === primaryLocalId,
  }));
}

export function ensureOnePrimaryContact(
  contacts: OwnerContactDraft[],
): OwnerContactDraft[] {
  if (contacts.length === 0) {
    return [createOwnerContactDraft("", PRIMARY_CONTACT_LABEL, true)];
  }
  const primaryContact = contacts.find((contact) => contact.isPrimary);
  if (primaryContact) {
    return withSinglePrimaryContact(contacts, primaryContact.localId);
  }
  return withSinglePrimaryContact(contacts, contacts[0].localId);
}

export function contactsFromLegacyPhones(
  phones: string[] | undefined,
): OwnerContactDraft[] {
  const trimmedPhones = (phones ?? [])
    .map((phone) => phone.trim())
    .filter((phone) => phone !== "" && phone !== "+995");

  if (trimmedPhones.length === 0) {
    return [createOwnerContactDraft("", PRIMARY_CONTACT_LABEL, true)];
  }

  return ensureOnePrimaryContact(
    trimmedPhones.map((phone, phoneIndex) =>
      createOwnerContactDraft(
        phone,
        phoneIndex === 0 ? PRIMARY_CONTACT_LABEL : "",
        phoneIndex === 0,
      ),
    ),
  );
}

function filledContacts(contacts: OwnerContactDraft[]): OwnerContactDraft[] {
  return contacts.filter(
    (contact) => contact.phone.trim() !== "" || contact.label.trim() !== "",
  );
}

export function validateOwnerAssignment(
  assignment: PropertyOwnerAssignment,
): string | null {
  if (assignment.selectedOwnerId) {
    return null;
  }

  if (!assignment.name.trim()) {
    return "მესაკუთრის სახელი სავალდებულოა.";
  }

  const usableContacts = filledContacts(assignment.contacts).filter((contact) =>
    isPhoneLike(contact.phone),
  );
  if (usableContacts.length === 0) {
    return "საჭიროა მინიმუმ ერთი ტელეფონის ნომერი.";
  }

  const invalidContact = filledContacts(assignment.contacts).find(
    (contact) => contact.phone.trim() !== "" && !isPhoneLike(contact.phone),
  );
  if (invalidContact) {
    return "ტელეფონის ნომერი არასწორია.";
  }

  return null;
}

export function buildNestedOwnerInput(
  assignment: PropertyOwnerAssignment,
): NestedPropertyOwnerInput | null {
  if (assignment.selectedOwnerId) {
    return null;
  }

  const usableContacts = ensureOnePrimaryContact(
    filledContacts(assignment.contacts).filter((contact) =>
      isPhoneLike(contact.phone),
    ),
  );

  if (!assignment.name.trim() || usableContacts.length === 0) {
    return null;
  }

  const contacts: NestedPropertyOwnerContactInput[] = usableContacts.map(
    (contact) => ({
      label: contact.label.trim() || PRIMARY_CONTACT_LABEL,
      phone: contact.phone.trim(),
      isPrimary: contact.isPrimary,
    }),
  );

  const comment = assignment.comment.trim();

  const nestedOwner: NestedPropertyOwnerInput = {
    name: assignment.name.trim(),
    contacts,
  };
  if (comment !== "") {
    nestedOwner.comment = comment;
  }

  return nestedOwner;
}

export type OwnerWritePayload =
  | { ownerId: string }
  | { owner: NestedPropertyOwnerInput };

export function buildOwnerWritePayload(
  assignment: PropertyOwnerAssignment,
): { payload: OwnerWritePayload | null; error: string | null } {
  const validationError = validateOwnerAssignment(assignment);
  if (validationError) {
    return { payload: null, error: validationError };
  }

  if (assignment.selectedOwnerId) {
    return { payload: { ownerId: assignment.selectedOwnerId }, error: null };
  }

  const nestedOwner = buildNestedOwnerInput(assignment);
  if (!nestedOwner) {
    return { payload: null, error: "მესაკუთრის მონაცემები არასრულია." };
  }

  return { payload: { owner: nestedOwner }, error: null };
}

export function assignmentFromProperty(property: {
  propertyOwner: { id: string; name: string } | null;
  ownerName: string;
  ownerPhones: string[];
}): PropertyOwnerAssignment {
  const base = emptyOwnerAssignment();
  const ownerName = property.propertyOwner?.name ?? property.ownerName;
  const contacts = contactsFromLegacyPhones(property.ownerPhones);

  if (property.propertyOwner) {
    return {
      ...base,
      selectedOwnerId: property.propertyOwner.id,
      matchedOwnerName: property.propertyOwner.name,
      name: ownerName,
      contacts,
    };
  }

  return {
    ...base,
    name: ownerName,
    contacts,
  };
}

export function isOwnerAssignmentDirty(
  property: { propertyOwner: { id: string; name: string } | null },
  assignment: PropertyOwnerAssignment,
): boolean {
  const currentOwnerId = property.propertyOwner?.id ?? null;
  if (assignment.selectedOwnerId) {
    return assignment.selectedOwnerId !== currentOwnerId;
  }
  return assignment.lookupPhone.trim() !== "";
}

export function primaryContactFromList(
  contacts: Array<{ phone: string; isPrimary: boolean; label?: string }>,
): { phone: string; label: string } | null {
  const primary =
    contacts.find((contact) => contact.isPrimary) ?? contacts[0] ?? null;
  if (!primary || primary.phone.trim() === "") {
    return null;
  }
  return {
    phone: primary.phone,
    label: primary.label?.trim() || PRIMARY_CONTACT_LABEL,
  };
}
