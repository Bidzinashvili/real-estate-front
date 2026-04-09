import type {
  DealType,
  ClientStatus,
  Renovation,
  BuildingCondition,
  KitchenType,
} from "@/features/clients/clientEnums";

export type RelatedPerson = {
  id: string;
  clientId: string;
  name: string;
  phone: string | null;
  whatsapp: string | null;
  relationship: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RelatedPersonInput = {
  name?: string;
  phone?: string;
  whatsapp?: string;
  relationship?: string;
  note?: string;
};

export type ClientRequirements = {
  id: string;
  clientId: string;
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
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  clientId: string;
  text: string;
  createdAt: string;
};

export type Client = {
  id: string;
  userId: string;
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
  reminderDate: string | null;
  reminderSentAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  requirements: ClientRequirements | null;
  relatedPersons: RelatedPerson[];
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
  id: string;
  deleted: true;
};

export type DeleteClientCommentResponse = {
  id: string;
  deleted: true;
};

export type CreateClientDto = {
  name: string;
  phones: string[];
  whatsapp?: string;
  budgetMin?: number;
  budgetMax?: number;
  dealType: DealType;
  description: string;
  pet?: string;
  districts: string[];
  addresses: string[];
  status?: ClientStatus;
  reminderDate?: string;
  relatedPersons?: RelatedPersonInput[];
  minRooms?: number;
  minBedrooms?: number;
  minFloor?: number;
  maxFloor?: number;
  excludeLastFloor?: boolean;
  renovation?: Renovation;
  buildingCondition?: BuildingCondition;
  projectExclude?: string[];
  minArea?: number;
  hasBalcony?: boolean;
  balconyAreaMin?: number;
  balconyAreaMax?: number;
  goodView?: boolean;
  elevator?: boolean;
  centralHeating?: boolean;
  airConditioner?: boolean;
  kitchenType?: KitchenType;
  furnished?: boolean;
  minBathrooms?: number;
  parking?: boolean;
  minRentalPeriod?: number;
};

export type UpdateClientDto = Partial<Omit<CreateClientDto, "reminderDate">> & {
  reminderDate?: string | null;
};
