import type {
  BuildingCondition,
  KitchenType,
  Renovation,
} from "@/features/clients/clientEnums";
import type { DealType as ClientDealType } from "@/features/clients/clientEnums";
import type { DealType as PropertyDealType } from "@/features/properties/dealType";
import type { PropertyType } from "@/features/properties/propertyModelTypes";
import type {
  ApartmentVerifiableField,
  ClientPreferenceValue,
  CriterionResult,
  LockState,
  MatchCriterionKey,
  MatchScope,
  PropertyFieldLockKey,
  TemporaryLockKey,
} from "@/features/matching/matchingEnums";

export interface Locked<Value> {
  value: Value;
  lock: LockState;
}

export interface LockedOptional<Value> {
  value?: Value;
  lock: LockState;
}

export interface ClientMatchingWrite {
  dealType?: ClientDealType;
  districts: Locked<string[]>;
  addresses: Locked<string[]>;
  budgetMin?: LockedOptional<number>;
  budgetMax?: LockedOptional<number>;
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
  parking?: Locked<ClientPreferenceValue>;
  pet?: LockedOptional<string>;
  minRentalPeriod?: LockedOptional<number>;
  minBathrooms?: Locked<number>;
  maxBathrooms?: Locked<number>;
}

export interface ClientMatchingRead {
  dealType: ClientDealType;
  status: string;
  districts: Locked<string[]>;
  addresses: Locked<string[]>;
  budgetMin: Locked<number | null>;
  budgetMax: Locked<number | null>;
  pet: Locked<string | null>;
  requirements: {
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
  } | null;
}

export interface ApartmentMatchingFields {
  totalArea: number;
  rooms: number;
  bedrooms: number;
  floor: number;
  totalFloors?: number | null;
  renovation?: Renovation | null;
  buildingCondition: BuildingCondition;
  project?: string | null;
  balconyArea?: number | null;
  parkingSpaces?: number | null;
  goodView?: boolean | null;
  bathrooms?: number | null;
  elevator?: boolean | null;
  centralHeating?: boolean | null;
  airConditioner?: boolean | null;
  furnished?: boolean | null;
  petsAllowed?: boolean | null;
  kitchenType: KitchenType;
  minRentalPeriod?: number | null;
  needsVerification?: ApartmentVerifiableField[];
}

export interface MatchRequest {
  scope: MatchScope;
  temporaryLockedFields?: TemporaryLockKey[];
  page?: number;
  limit?: number;
}

export interface MatchCriterionDto {
  key: MatchCriterionKey | string;
  result: CriterionResult;
  hardLocked: boolean;
}

export interface PropertyMatchSummary {
  id: string;
  propertyType: PropertyType;
  dealType: PropertyDealType;
  status: string;
  city?: string;
  district: string;
  address: string;
  pricePublic: number;
  publicComment?: string | null;
  images: unknown[];
  apartment: {
    totalArea: number | null;
    rooms: number | null;
    bedrooms: number | null;
    floor: number | null;
    totalFloors: number | null;
    renovation: Renovation | null;
    buildingCondition: string | null;
    project: string | null;
    balconyArea: number | null;
    goodView: boolean | null;
    elevator: boolean | null;
    centralHeating: boolean | null;
    airConditioner: boolean | null;
    kitchenType: string | null;
    furnished: boolean | null;
    parkingSpaces: number | null;
    petsAllowed: boolean | null;
    minRentalPeriod: number | null;
    bathrooms: number | null;
    needsVerification: string[];
  } | null;
}

export interface ClientMatchSummary {
  id: string;
  dealType: ClientDealType;
  status: string;
  districts: string[];
  addresses: string[];
  budgetMin: number | null;
  budgetMax: number | null;
  pet: boolean;
  requirements: {
    minRooms: number | null;
    maxRooms: number | null;
    minBedrooms: number | null;
    maxBedrooms: number | null;
    minFloor: number | null;
    maxFloor: number | null;
    excludeLastFloor: boolean;
    renovations: Renovation[];
    buildingCondition: string | null;
    projectExclude: string[];
    minArea: number | null;
    maxArea: number | null;
    hasBalcony: ClientPreferenceValue | string;
    balconyAreaMin: number | null;
    balconyAreaMax: number | null;
    goodView: ClientPreferenceValue | string;
    elevator: ClientPreferenceValue | string;
    centralHeating: ClientPreferenceValue | string;
    airConditioner: ClientPreferenceValue | string;
    kitchenType: string | null;
    furnished: ClientPreferenceValue | string;
    minBathrooms: number | null;
    maxBathrooms: number | null;
    parking: ClientPreferenceValue | string;
    minRentalPeriod: number | null;
  };
}

export interface ScoredPropertyMatch {
  id: string;
  matchPercentage: number;
  matchedCriteriaCount: number;
  scoredCriteriaCount: number;
  mismatchedCriteria: string[];
  criteria: MatchCriterionDto[];
  property: PropertyMatchSummary;
}

export interface ScoredClientMatch {
  id: string;
  matchPercentage: number;
  matchedCriteriaCount: number;
  scoredCriteriaCount: number;
  mismatchedCriteria: string[];
  criteria: MatchCriterionDto[];
  client: ClientMatchSummary;
}

export interface ClientToPropertyMatchResponse {
  total: number;
  page: number;
  limit: number;
  properties: ScoredPropertyMatch[];
}

export interface PropertyToClientMatchResponse {
  total: number;
  page: number;
  limit: number;
  clients: ScoredClientMatch[];
}

export type { PropertyFieldLockKey, TemporaryLockKey };
