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
  minBedrooms: number | null;
  minFloor: number | null;
  maxFloor: number | null;
  excludeLastFloor: boolean;
  renovation: Renovation | null;
  buildingCondition: BuildingCondition | null;
  projectExclude: string[];
  minArea: number | null;
  hasBalcony: boolean | null;
  balconyAreaMin: number | null;
  balconyAreaMax: number | null;
  goodView: boolean | null;
  elevator: boolean | null;
  centralHeating: boolean | null;
  airConditioner: boolean | null;
  kitchenType: KitchenType | null;
  furnished: boolean | null;
  minBathrooms: number | null;
  parking: boolean | null;
  minRentalPeriod: number | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  minRoomsLock?: LockState;
  minBedroomsLock?: LockState;
  minFloorLock?: LockState;
  maxFloorLock?: LockState;
  excludeLastFloorLock?: LockState;
  renovationLock?: LockState;
  buildingConditionLock?: LockState;
  projectExcludeLock?: LockState;
  minAreaLock?: LockState;
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
  parkingLock?: LockState;
  minRentalPeriodLock?: LockState;
};

export type Comment = {
  id: UUID;
  clientId: UUID;
  text: string;
  createdAt: ISODateString;
};

export type Client = {
  id: UUID;
  userId: UUID;
  name: string;
  phones: string[];
  whatsapp: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  dealType: DealType;
  description: string;
  pet: string | null;
  districts: string[];
  addresses: string[];
  status: ClientStatus;
  reminderDate: ISODateString | null;
  reminderSentAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
  requirements: ClientRequirements | null;
  relatedPersons: RelatedPerson[];
  districtsLock?: LockState;
  addressesLock?: LockState;
  budgetMinLock?: LockState;
  budgetMaxLock?: LockState;
  petLock?: LockState;
};

export type ClientDetail = Client & {
  comments: Comment[];
  internalComments: Comment[];
};

export type ClientsListResponse = {
  total: number;
  page: number;
  limit: number;
  clients: Client[];
};

export type DeleteClientResponse = {
  id: UUID;
  deleted: true;
};

export type DeleteClientCommentResponse = {
  id: UUID;
  deleted: true;
};

export type {
  CreateClientPayload,
  UpdateClientPayload,
  CreateClientRelatedPersonPayload,
} from "@/features/clients/clientApi.types";
