import type {
  DealType,
  ClientStatus,
  Renovation,
  BuildingCondition,
  KitchenType,
} from "@/features/clients/clientEnums";
import type {
  ISODateString,
  LockState,
  UUID,
} from "@/features/clients/clientApi.types";
import type { ClientPreferenceValue } from "@/features/matching/matchingEnums";
import type { EntityVerificationFields } from "@/features/lifecycle/lifecycleEnums";
import type { ClientProfileCompact } from "@/features/clientProfiles/types";
import type { ReminderSummary } from "@/features/reminders/remindersApiTypes";
import type { DatabaseListScope } from "@/features/databaseList/databaseListScope";
import type { ManagingAgentSummary } from "@/features/agents/managingAgentSummary";
import type { RecordColor } from "@/features/recordColor/recordColor";
import type { SoftDeleteResponse } from "@/features/lifecycle/softDeleteTypes";
import type { ClientBudgetCurrency } from "@/features/clients/clientBudgetCurrency";
import type {
  ClientBuildingConditionRequirement,
  ClientKitchenTypeRequirement,
  ClientRenovationsRequirement,
} from "@/features/clients/clientRequirementValues";

export type RelatedPerson = {
  id: UUID;
  clientId: UUID;
  name: string;
  phone: string | null;
  whatsapp: string | null;
  relationship: string | null;
  note: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type RelatedPersonInput = {
  name?: string;
  phone?: string;
  whatsapp?: string;
  relationship?: string;
  note?: string;
};

export type ClientRelatedPersonInput = RelatedPersonInput;

export type ClientRequirements = {
  id: UUID;
  clientId: UUID;
  minRooms: number | null;
  maxRooms: number | null;
  minBedrooms: number | null;
  maxBedrooms: number | null;
  minFloor: number | null;
  maxFloor: number | null;
  excludeLastFloor: boolean;
  renovations: ClientRenovationsRequirement;
  buildingCondition: ClientBuildingConditionRequirement;
  projectExclude: string[];
  minArea: number | null;
  maxArea: number | null;
  hasBalcony: ClientPreferenceValue;
  balconyAreaMin: number | null;
  balconyAreaMax: number | null;
  goodView: ClientPreferenceValue;
  elevator: ClientPreferenceValue;
  centralHeating: ClientPreferenceValue;
  airConditioner: ClientPreferenceValue;
  kitchenType: ClientKitchenTypeRequirement;
  furnished: ClientPreferenceValue;
  minBathrooms: number | null;
  maxBathrooms: number | null;
  parking: ClientPreferenceValue;
  minRentalPeriod: number | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  minRoomsLock?: LockState;
  maxRoomsLock?: LockState;
  minBedroomsLock?: LockState;
  maxBedroomsLock?: LockState;
  minFloorLock?: LockState;
  maxFloorLock?: LockState;
  excludeLastFloorLock?: LockState;
  renovationsLock?: LockState;
  buildingConditionLock?: LockState;
  projectExcludeLock?: LockState;
  minAreaLock?: LockState;
  maxAreaLock?: LockState;
  hasBalconyLock?: LockState;
  balconyAreaMinLock?: LockState;
  balconyAreaMaxLock?: LockState;
  goodViewLock?: LockState;
  elevatorLock?: LockState;
  centralHeatingLock?: LockState;
  airConditionerLock?: LockState;
  kitchenTypeLock?: LockState;
  furnishedLock?: LockState;
  minBathroomsLock?: LockState;
  maxBathroomsLock?: LockState;
  parkingLock?: LockState;
  minRentalPeriodLock?: LockState;
};

export type Comment = {
  id: UUID;
  clientId: UUID;
  text: string;
  createdAt: ISODateString;
};

export type Client = EntityVerificationFields & {
  id: UUID;
  userId: UUID;
  managingAgent?: ManagingAgentSummary | null;
  ownedByViewer: boolean | null;
  hideFromOthers?: boolean;
  name: string;
  clientProfileId: string | null;
  clientProfile: ClientProfileCompact | null;
  phones: string[];
  whatsapp: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  budgetCurrency: ClientBudgetCurrency;
  dealType: DealType;
  description?: string;
  publicComment?: string | null;
  pet: ClientPreferenceValue | null;
  districts: string[];
  addresses: string[];
  labels: string[];
  status: ClientStatus;
  propertyId: string | null;
  archivedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  noteLastOpenedAt?: ISODateString | null;
  deletedAt: ISODateString | null;
  color?: RecordColor;
  requirements: ClientRequirements | null;
  relatedPersons: RelatedPerson[];
  districtsLock?: LockState;
  addressesLock?: LockState;
  labelsLock?: LockState;
  budgetMinLock?: LockState;
  budgetMaxLock?: LockState;
  petLock?: LockState;
  reminderSummary: ReminderSummary;
};

export type ClientDetail = Client & {
  comments: Comment[];
  internalComments: Comment[];
};

export type OwnedClientRecord = Client & {
  ownedByViewer: true;
  description: string;
  publicComment?: string | null;
};

export type AgencySharedClientRecord = Client & {
  ownedByViewer: false;
  publicComment?: string | null;
};

export type OwnedClientDetail = ClientDetail & OwnedClientRecord;

export type AgencySharedClientDetail = ClientDetail &
  AgencySharedClientRecord & {
    comments: [];
    internalComments: [];
  };

export type { CollaborationClient } from "@/features/collaboration/collaborationApi.types";

export type ClientsListResponse = {
  total: number;
  page: number;
  limit: number;
  activeCount: number;
  scope: DatabaseListScope | null;
  clients: Client[];
};

export type DeleteClientResponse = SoftDeleteResponse;

export type DeleteClientCommentResponse = {
  id: UUID;
  deleted: true;
};

export type {
  CreateClientPayload,
  UpdateClientPayload,
  CreateClientRelatedPersonPayload,
} from "@/features/clients/clientApi.types";
