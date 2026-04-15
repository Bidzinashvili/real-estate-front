import type {
  BuildingCondition,
  ClientStatus,
  DealType,
  KitchenType,
  Renovation,
} from "@/features/clients/clientEnums";

export type LockState = "none" | "locked" | "frozen";

export function cycleLockState(lock: LockState): LockState {
  if (lock === "none") {
    return "locked";
  }
  if (lock === "locked") {
    return "frozen";
  }
  return "none";
}

export type Locked<T> = { value: T; lock: LockState };

export type LockedPartial<T> = { value?: T; lock: LockState };

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
  reminderDate?: string | null;
  relatedPersons?: CreateClientRelatedPersonPayload[];
  budgetMin?: LockedPartial<number>;
  budgetMax?: LockedPartial<number>;
  districts: Locked<string[]>;
  addresses: Locked<string[]>;
  pet?: LockedPartial<string>;
  minRooms?: Locked<number>;
  minBedrooms?: Locked<number>;
  minFloor?: Locked<number>;
  maxFloor?: Locked<number>;
  excludeLastFloor?: Locked<boolean>;
  renovation?: LockedPartial<Renovation>;
  buildingCondition?: LockedPartial<BuildingCondition>;
  projectExclude?: LockedPartial<string[]>;
  minArea?: Locked<number>;
  hasBalcony?: Locked<boolean>;
  balconyAreaMin?: Locked<number>;
  balconyAreaMax?: Locked<number>;
  goodView?: Locked<boolean>;
  elevator?: Locked<boolean>;
  centralHeating?: Locked<boolean>;
  airConditioner?: Locked<boolean>;
  kitchenType?: LockedPartial<KitchenType>;
  furnished?: Locked<boolean>;
  minBathrooms?: Locked<number>;
  parking?: Locked<boolean>;
  minRentalPeriod?: LockedPartial<number>;
}

export type UpdateClientPayload = Partial<CreateClientPayload>;

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
  minBedrooms: Locked<number | null>;
  minFloor: Locked<number | null>;
  maxFloor: Locked<number | null>;
  excludeLastFloor: Locked<boolean | null>;
  renovation: Locked<Renovation | null>;
  buildingCondition: Locked<BuildingCondition | null>;
  projectExclude: Locked<string[] | null>;
  minArea: Locked<number | null>;
  hasBalcony: Locked<boolean | null>;
  balconyAreaMin: Locked<number | null>;
  balconyAreaMax: Locked<number | null>;
  goodView: Locked<boolean | null>;
  elevator: Locked<boolean | null>;
  centralHeating: Locked<boolean | null>;
  airConditioner: Locked<boolean | null>;
  kitchenType: Locked<KitchenType | null>;
  furnished: Locked<boolean | null>;
  minBathrooms: Locked<number | null>;
  parking: Locked<boolean | null>;
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

export type ClientApi = {
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
  status: ClientStatus;
  reminderDate: ISODateString | null;
  reminderSentAt: ISODateString | null;
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
