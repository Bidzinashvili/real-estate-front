import type {
  BuildingCondition,
  ClientStatus,
  DealType,
  KitchenType,
  Renovation,
} from "@/features/clients/clientEnums";
import type { ClientPreferenceValue, LockState } from "@/features/matching/matchingEnums";
import type {
  EntityVerificationFields,
  OutcomeSource,
  ReminderConfigPayload,
} from "@/features/lifecycle/lifecycleEnums";

export type { LockState } from "@/features/matching/matchingEnums";

export function cycleLockState(lock: LockState): LockState {
  if (lock === "none") {
    return "locked";
  }
  if (lock === "locked") {
    return "frozen";
  }
  return "none";
}

export type Locked<Value> = { value: Value; lock: LockState };

export type LockedPartial<Value> = { value?: Value; lock: LockState };

export type LockedOptional<Value> = LockedPartial<Value>;

export type ISODateString = string;
export type UUID = string;

export type CreateClientRelatedPersonPayload = {
  name?: string;
  phone?: string;
  whatsapp?: string;
  relationship?: string;
  note?: string;
};

export interface CreateClientPayload {
  name: string;
  phones: string[];
  whatsapp?: string;
  dealType: DealType;
  description: string;
  status?: ClientStatus;
  reminder?: ReminderConfigPayload;
  relatedPersons?: CreateClientRelatedPersonPayload[];
  budgetMin?: LockedOptional<number>;
  budgetMax?: LockedOptional<number>;
  districts: Locked<string[]>;
  addresses: Locked<string[]>;
  labels?: Locked<string[]>;
  pet?: LockedOptional<string>;
  minRooms?: Locked<number>;
  maxRooms?: Locked<number>;
  minBedrooms?: Locked<number>;
  maxBedrooms?: Locked<number>;
  minFloor?: Locked<number>;
  maxFloor?: Locked<number>;
  excludeLastFloor?: Locked<boolean>;
  renovations?: Locked<Renovation[]>;
  buildingCondition?: LockedOptional<BuildingCondition>;
  projectExclude?: LockedOptional<string[]>;
  minArea?: Locked<number>;
  maxArea?: Locked<number>;
  hasBalcony?: Locked<ClientPreferenceValue>;
  balconyAreaMin?: Locked<number>;
  balconyAreaMax?: Locked<number>;
  goodView?: Locked<ClientPreferenceValue>;
  elevator?: Locked<ClientPreferenceValue>;
  centralHeating?: Locked<ClientPreferenceValue>;
  airConditioner?: Locked<ClientPreferenceValue>;
  kitchenType?: LockedOptional<KitchenType>;
  furnished?: Locked<ClientPreferenceValue>;
  minBathrooms?: Locked<number>;
  maxBathrooms?: Locked<number>;
  parking?: Locked<ClientPreferenceValue>;
  minRentalPeriod?: LockedOptional<number>;
}

export type UpdateClientPayload = {
  name?: string;
  phones?: string[];
  whatsapp?: string;
  dealType?: DealType;
  description?: string;
  status?: ClientStatus;
  outcomeSource?: OutcomeSource;
  reminder?: ReminderConfigPayload;
  relatedPersons?: CreateClientRelatedPersonPayload[];
  budgetMin?: LockedOptional<number>;
  budgetMax?: LockedOptional<number>;
  districts?: Locked<string[]>;
  addresses?: Locked<string[]>;
  labels?: Locked<string[]>;
  pet?: LockedOptional<string>;
  minRooms?: Locked<number>;
  maxRooms?: Locked<number>;
  minBedrooms?: Locked<number>;
  maxBedrooms?: Locked<number>;
  minFloor?: Locked<number>;
  maxFloor?: Locked<number>;
  excludeLastFloor?: Locked<boolean>;
  renovations?: Locked<Renovation[]>;
  buildingCondition?: LockedOptional<BuildingCondition>;
  projectExclude?: LockedOptional<string[]>;
  minArea?: Locked<number>;
  maxArea?: Locked<number>;
  hasBalcony?: Locked<ClientPreferenceValue>;
  balconyAreaMin?: Locked<number>;
  balconyAreaMax?: Locked<number>;
  goodView?: Locked<ClientPreferenceValue>;
  elevator?: Locked<ClientPreferenceValue>;
  centralHeating?: Locked<ClientPreferenceValue>;
  airConditioner?: Locked<ClientPreferenceValue>;
  kitchenType?: LockedOptional<KitchenType>;
  furnished?: Locked<ClientPreferenceValue>;
  minBathrooms?: Locked<number>;
  maxBathrooms?: Locked<number>;
  parking?: Locked<ClientPreferenceValue>;
  minRentalPeriod?: LockedOptional<number>;
};

export type ClientSortBy = "createdAt" | "updatedAt" | "name";

export type SortOrder = "asc" | "desc";

export type GetClientsQuery = {
  district?: Locked<string>;
  budgetMin?: LockedPartial<number>;
  budgetMax?: LockedPartial<number>;
  dealType?: DealType;
  status?: LockedPartial<ClientStatus>;
  sortBy?: ClientSortBy;
  order?: SortOrder;
  page?: number;
  limit?: number;
};

export const DEFAULT_CLIENT_LIST_FILTER_LOCK: LockState = "locked";

export type ClientRequirementsApi = {
  id: UUID;
  clientId: UUID;
  minRooms: Locked<number | null>;
  maxRooms: Locked<number | null>;
  minBedrooms: Locked<number | null>;
  maxBedrooms: Locked<number | null>;
  minFloor: Locked<number | null>;
  maxFloor: Locked<number | null>;
  excludeLastFloor: Locked<boolean>;
  renovations: Locked<Renovation[]>;
  buildingCondition: Locked<BuildingCondition | null>;
  projectExclude: Locked<string[]>;
  minArea: Locked<number | null>;
  maxArea: Locked<number | null>;
  hasBalcony: Locked<ClientPreferenceValue>;
  balconyAreaMin: Locked<number | null>;
  balconyAreaMax: Locked<number | null>;
  goodView: Locked<ClientPreferenceValue>;
  elevator: Locked<ClientPreferenceValue>;
  centralHeating: Locked<ClientPreferenceValue>;
  airConditioner: Locked<ClientPreferenceValue>;
  kitchenType: Locked<KitchenType | null>;
  furnished: Locked<ClientPreferenceValue>;
  minBathrooms: Locked<number | null>;
  maxBathrooms: Locked<number | null>;
  parking: Locked<ClientPreferenceValue>;
  minRentalPeriod: Locked<number | null>;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type ClientRelatedPersonApi = {
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

export type ClientCommentApi = {
  id: UUID;
  clientId: UUID;
  text: string;
  createdAt: ISODateString;
};

export type ClientApi = EntityVerificationFields & {
  id: UUID;
  userId: UUID;
  name: string;
  phones: string[];
  whatsapp: string | null;
  budgetMin: Locked<number | null>;
  budgetMax: Locked<number | null>;
  dealType: DealType;
  description: string;
  pet: Locked<string | null>;
  districts: Locked<string[]>;
  addresses: Locked<string[]>;
  labels?: Locked<string[]>;
  status: ClientStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
  requirements: ClientRequirementsApi | null;
  relatedPersons?: ClientRelatedPersonApi[];
};

export type ClientDetailApi = ClientApi & {
  comments: ClientCommentApi[];
  internalComments: ClientCommentApi[];
};

export type GetClientsResponse = {
  total: number;
  page: number;
  limit: number;
  clients: ClientApi[];
};
