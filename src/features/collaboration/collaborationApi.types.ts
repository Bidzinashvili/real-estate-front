import type {
  CollaborationParticipantRole,
  CollaborationSplit,
  CollaborationStatus,
  CollaborationStatusGroup,
  CollaborationViewerRole,
  MonitoringState,
} from "@/features/collaboration/collaborationEnums";

export type CollaborationUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
};

export type CollaborationParticipant = {
  role: CollaborationParticipantRole;
  user: CollaborationUser | null;
};

export type CollaborationProperty = {
  id: string;
  city: string;
  district: string;
  address: string;
  dealType: "SALE" | "RENT" | "DAILY_RENT";
  propertyType: string;
  status: string;
  pricePublic: number;
  publicComment: string | null;
};

export type CollaborationClient = {
  id: string;
  name: string | null;
  phones: string[] | null;
  whatsapp: string | null;
  dealType: string | null;
  status: string | null;
};

export type CollaborationMonitorSummary = {
  id: string;
  collaborationRequestId: string;
  split: CollaborationSplit;
  approvedAt: string;
  approvedByAdminId: string;
  monitoringState: MonitoringState;
  propertyStatus: string;
};

export type CollaborationRequestDto = {
  id: string;
  status: CollaborationStatus;
  statusGroup: CollaborationStatusGroup;
  split: CollaborationSplit;
  viewerRole: CollaborationViewerRole | null;
  property: CollaborationProperty | null;
  clientId: string | null;
  client: CollaborationClient | null;
  participants: CollaborationParticipant[];
  createdAt: string;
  updatedAt: string;
  acceptedAt: string | null;
  rejectedAt: string | null;
  approvedAt: string | null;
  adminDecidedAt: string | null;
  monitor: CollaborationMonitorSummary | null;
};

export type CollaborationListResponse = {
  total: number;
  page: number;
  limit: number;
  collaborations: CollaborationRequestDto[];
};

export type CreateCollaborationPayload = {
  propertyId: string;
  clientId?: string;
  split: CollaborationSplit;
  additionalParticipantIds?: string[];
};

export type CollaborationListQuery = {
  status?: CollaborationStatus;
  statusGroup?: CollaborationStatusGroup;
  page?: number;
  limit?: number;
};

export type CollaborationAgentOption = {
  id: string;
  fullName: string;
};

export type CollaborationAgentOptionsResponse = {
  agents: CollaborationAgentOption[];
};

export type CollaborationMonitorDto = {
  id: string;
  collaborationRequestId: string;
  split: CollaborationSplit;
  approvedAt: string;
  approvedByAdminId: string;
  monitoringState: MonitoringState;
  propertyStatus: string;
  property: CollaborationProperty | null;
  collaboration: CollaborationRequestDto;
};

export type CollaborationMonitorListResponse = {
  total: number;
  page: number;
  limit: number;
  monitors: CollaborationMonitorDto[];
};

export type CollaborationMonitorListQuery = {
  page?: number;
  limit?: number;
};
