import type { DealType } from "@/features/properties/dealType";
import type { PropertyStatus } from "@/features/properties/propertyStatus";
import type { PropertyType } from "@/features/properties/propertyModelTypes";
import type { PropertyOwnerSummary } from "@/features/propertyOwners/propertyOwnerSummary";

export type { PropertyOwnerSummary };

export type PropertyOwnerContact = {
  id: string;
  label: string;
  phone: string;
  normalizedPhone?: string;
  isPrimary: boolean;
};

export type PropertyOwnerLinkedProperty = {
  id: string;
  dealType: DealType;
  propertyType: PropertyType;
  city: string;
  district: string;
  address: string;
  street: string | null;
  status: PropertyStatus;
  archivedAt: string | null;
  title: string | null;
};

export type PropertyOwner = {
  id: string;
  name: string;
  comment: string | null;
  contacts: PropertyOwnerContact[];
  propertyCount: number;
  properties?: PropertyOwnerLinkedProperty[];
  createdAt: string;
  updatedAt: string;
};

export type PropertyOwnerLookupResult = {
  owner: PropertyOwner | null;
  matchedContact: PropertyOwnerContact | null;
};

export type PropertyOwnersListResponse = {
  total: number;
  page: number;
  limit: number;
  owners: PropertyOwner[];
};

export type NestedPropertyOwnerContactInput = {
  label: string;
  phone: string;
  isPrimary?: boolean;
};

export type NestedPropertyOwnerInput = {
  name: string;
  comment?: string | null;
  contacts: NestedPropertyOwnerContactInput[];
};

export type CreatePropertyOwnerPayload = NestedPropertyOwnerInput;

export type UpdatePropertyOwnerPayload = {
  name?: string;
  comment?: string | null;
};

export type CreatePropertyOwnerContactPayload = {
  label: string;
  phone: string;
  isPrimary?: boolean;
};

export type UpdatePropertyOwnerContactPayload = {
  label?: string;
  phone?: string;
  isPrimary?: boolean;
};

export type OwnerContactDraft = {
  localId: string;
  label: string;
  phone: string;
  isPrimary: boolean;
};

export type PropertyOwnerAssignment = {
  lookupPhone: string;
  selectedOwnerId: string | null;
  matchedOwnerName: string;
  matchedContactLabel: string;
  matchedContactPhone: string;
  name: string;
  comment: string;
  contacts: OwnerContactDraft[];
};

export const PRIMARY_CONTACT_LABEL = "მთავარი ნომერი";
