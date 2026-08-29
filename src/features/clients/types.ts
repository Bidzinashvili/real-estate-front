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
import type { RecordColor } from "@/features/recordColor/recordColor";
import type { SoftDeleteResponse } from "@/features/lifecycle/softDeleteTypes";

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
  renovations: Renovation[];
  buildingCondition: BuildingCondition | null;
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
  kitchenType: KitchenType | null;
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
  ownedByViewer: boolean | null;
  hideFromOthers?: boolean;
  name: string;
  clientProfileId: string | null;
  clientProfile: ClientProfileCompact | null;
  phones: string[];
  whatsapp: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  dealType: DealType;
  description: string;
  pet: string | null;
  districts: string[];
  addresses: string[];
  labels: string[];
  status: ClientStatus;
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
