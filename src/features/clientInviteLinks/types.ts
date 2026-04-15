import type { ClientInviteLinkStatus } from "./clientInviteEnums";

export type { ClientInviteLinkStatus };

export type ISODateString = string;
export type UUID = string;

export type CreateClientInviteLinkPayload = {
  expiresAt?: string;
  maxUses?: number;
};
export type CreateClientInviteLinkDto = CreateClientInviteLinkPayload;

export type ClientInviteLink = {
  id: UUID;
  token: UUID;
  inviteUrl: string | null;
  expiresAt: ISODateString | null;
  maxUses: number;
  status: ClientInviteLinkStatus;
  createdAt: ISODateString;
};
export type ClientInviteCreatedResponse = ClientInviteLink;

export type ClientInviteLinkListItem = ClientInviteLink & {
  agentId: UUID;
  useCount: number;
  effectiveStatus: ClientInviteLinkStatus;
};

export type ClientInviteLinksListResponse = {
  total: number;
  page: number;
  limit: number;
  links: ClientInviteLinkListItem[];
};

export type ClientInviteFormSchemaField = {
  key: string;
  type?: string;
  valueType?: string;
  required: boolean;
  itemType?: string;
  description?: string;
  maxLength?: number;
  arrayMaxSize?: number;
  nested?: string;
  usesLockShape?: boolean;
};

export type ClientInviteFormSchemaEnums = {
  DealType?: string[];
  ClientStatus?: string[];
  Renovation?: string[];
  BuildingCondition?: string[];
  KitchenType?: string[];
};

export type ClientInviteFormSchema = {
  version: string;
  dtoName: string;
  enums: ClientInviteFormSchemaEnums | Record<string, string[]>;
  fields: ClientInviteFormSchemaField[];
  lockShape?: {
    valueKey: "value";
    lockKey: "lock";
    lockEnum: "LockState";
    appliesToFieldsWithUsesLockShape: boolean;
  };
};

export type PublicClientInviteGetResponse = {
  token: UUID;
  agentId: UUID;
  expiresAt: ISODateString | null;
  maxUses: number;
  useCount: number;
  status: ClientInviteLinkStatus;
  formSchema: ClientInviteFormSchema;
};
