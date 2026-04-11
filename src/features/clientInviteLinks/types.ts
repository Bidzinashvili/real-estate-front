import type { ClientInviteLinkStatus } from "./clientInviteEnums";

export type { ClientInviteLinkStatus };

export type CreateClientInviteLinkDto = {
  expiresAt?: string;
  maxUses?: number;
};

export type ClientInviteCreatedResponse = {
  id: string;
  token: string;
  inviteUrl: string | null;
  expiresAt: string | null;
  maxUses: number;
  status: ClientInviteLinkStatus;
  createdAt: string;
};

export type ClientInviteLinkListItem = {
  id: string;
  token: string;
  expiresAt: string | null;
  status: ClientInviteLinkStatus;
  maxUses: number;
  useCount: number;
  createdAt: string;
  effectiveStatus: ClientInviteLinkStatus;
  inviteUrl: string | null;
};

export type ClientInviteLinksListResponse = {
  total: number;
  page: number;
  limit: number;
  links: ClientInviteLinkListItem[];
};

export type ClientInviteFormSchemaField = {
  key: string;
  type: string;
  required: boolean;
  itemType?: string;
  description?: string;
  maxLength?: number;
  arrayMaxSize?: number;
  nested?: ClientInviteFormSchemaField[];
};

export type ClientInviteFormSchemaEnums = {
  DealType?: string[];
  ClientStatus?: string[];
  Renovation?: string[];
  BuildingCondition?: string[];
  KitchenType?: string[];
};

export type ClientInviteFormSchema = {
  version: "1";
  dtoName: string;
  enums: ClientInviteFormSchemaEnums;
  fields: ClientInviteFormSchemaField[];
};

export type PublicClientInviteGetResponse = {
  token: string;
  agentId: string;
  expiresAt: string | null;
  maxUses: number;
  useCount: number;
  status: ClientInviteLinkStatus;
  formSchema: ClientInviteFormSchema;
};
