import type { ClientPreferenceValue } from "@/features/matching/matchingEnums";
import type {
  CollaborationNegotiationRole,
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
  currency?: "GEL" | "USD";
  publicComment: string | null;
};

export type CollaborationClientRequirements = {
  minRooms?: number | null;
  maxRooms?: number | null;
  minBedrooms?: number | null;
  maxBedrooms?: number | null;
  minFloor?: number | null;
  maxFloor?: number | null;
  excludeLastFloor?: boolean;
  renovations?: string[];
  buildingCondition?: string | null;
  projectExclude?: string[];
  minArea?: number | null;
  maxArea?: number | null;
  hasBalcony?: string;
  balconyAreaMin?: number | null;
  balconyAreaMax?: number | null;
  goodView?: string;
  elevator?: string;
  centralHeating?: string;
  airConditioner?: string;
  kitchenType?: string | null;
  furnished?: string;
  minBathrooms?: number | null;
  maxBathrooms?: number | null;
  parking?: string;
  minRentalPeriod?: number | null;
};

export type CollaborationClient = {
  id: string;
  dealType: string | null;
  status: string | null;
  districts?: string[];
  addresses?: string[];
  budgetMin?: number | null;
  budgetMax?: number | null;
  budgetCurrency?: "GEL" | "USD";
  pet?: ClientPreferenceValue | null;
  publicComment?: string | null;
  requirements?: CollaborationClientRequirements | null;
  name: string | null;
  phones: string[] | null;
  whatsapp: string | null;
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
  proposedByRole: CollaborationNegotiationRole | null;
  proposedAt: string | null;
  awaitingRole: CollaborationNegotiationRole | null;
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
  propertyId?: string;
  clientId?: string;
  split: CollaborationSplit;
  additionalParticipantIds?: string[];
};

export type CounterCollaborationPayload = {
  split: CollaborationSplit;
  additionalParticipantIds: string[];
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
