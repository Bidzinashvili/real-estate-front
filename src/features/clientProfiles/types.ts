import type { ClientStatus, DealType } from "@/features/clients/clientEnums";

export type ClientProfilePhone = {
  id: string;
  label: string;
  phone: string;
  normalizedPhone?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ClientProfileOwningAgent = {
  id: string;
  fullName: string;
};

export type ClientProfileHistoryNote = {
  id: string;
  name: string | null;
  dealType: DealType | null;
  status: ClientStatus | null;
  archivedAt: string | null;
  createdAt: string;
  districts: string[];
  budgetMin: number | null;
  budgetMax: number | null;
  userId?: string;
  owningAgent?: ClientProfileOwningAgent | null;
};

export type ClientProfileAuditAction =
  | "BLACKLIST"
  | "UNBLACKLIST"
  | "LINK"
  | "REASSIGN"
  | "MERGE"
  | "ADD_PHONE"
  | "REMOVE_PHONE";

export type ClientProfileAudit = {
  id: string;
  action: string;
  createdAt: string;
  userId: string | null;
};

export type ClientProfile = {
  id: string;
  name: string | null;
  comment: string | null;
  phones: ClientProfilePhone[];
  clients: ClientProfileHistoryNote[];
  blacklisted: boolean;
  blacklistReason: string | null;
  blacklistedAt: string | null;
  blacklistedByUserId: string | null;
  occurrenceCount: number;
  ownOccurrenceCount: number;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  dealTypes: DealType[];
  canViewDetails: boolean;
  audits: ClientProfileAudit[];
  createdAt: string;
  updatedAt: string;
};

export type ClientProfileListItem = {
  id: string;
  name: string | null;
  comment: string | null;
  primaryPhone: string | null;
  phones: ClientProfilePhone[];
  blacklisted: boolean;
  occurrenceCount: number;
  ownOccurrenceCount: number;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  dealTypes: DealType[];
  canViewDetails: boolean;
};

export type ClientProfileLookupProfile = {
  id: string;
  name: string | null;
  phones: ClientProfilePhone[];
  clients: ClientProfileHistoryNote[];
  comment: string | null;
  blacklistReason: string | null;
  blacklisted: boolean;
  canViewDetails: boolean;
  occurrenceCount: number;
  ownOccurrenceCount: number;
};

export type ClientProfileLookupResult = {
  matched: boolean;
  profileId: string | null;
  matchedPhone: string | null;
  occurrenceCount: number;
  ownOccurrenceCount: number;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  dealTypes: DealType[];
  blacklisted: boolean;
  profile: ClientProfileLookupProfile | null;
};

export type ClientProfilesListResponse = {
  total: number;
  page: number;
  limit: number;
  profiles: ClientProfileListItem[];
};

export type ClientProfileCompact = {
  id: string;
  blacklisted: boolean;
  occurrenceCount: number;
};

export type UpdateClientProfilePayload = {
  name?: string;
  comment?: string | null;
};

export type CreateClientProfilePhonePayload = {
  label?: string;
  phone: string;
  isPrimary?: boolean;
};

export type UpdateClientProfilePhonePayload = {
  label?: string;
  phone?: string;
  isPrimary?: boolean;
};

export type LinkClientNotePayload = {
  clientId: string;
  addPhones?: boolean;
};

export type BlacklistClientProfilePayload = {
  reason: string;
};

export type MergeClientProfilePayload = {
  sourceProfileId: string;
};
