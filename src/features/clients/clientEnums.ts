export const DEAL_TYPES = ["SALE", "RENT", "DAILY_RENT"] as const;
export type DealType = (typeof DEAL_TYPES)[number];

export const DEAL_TYPE_LABELS: Record<DealType, string> = {
  SALE: "Sale",
  RENT: "Rent",
  DAILY_RENT: "Daily rent",
};

export const CLIENT_STATUSES = ["ACTIVE", "IN_PROGRESS", "ARCHIVED"] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  ACTIVE: "Active",
  IN_PROGRESS: "In progress",
  ARCHIVED: "Archived",
};

export const RENOVATION_VALUES = [
  "NEW_RENOVATED",
  "RENOVATED",
  "OLD_RENOVATED",
  "NEEDS_RENOVATION",
  "GREEN_FRAME",
  "WHITE_FRAME",
  "BLACK_FRAME",
] as const;
export type Renovation = (typeof RENOVATION_VALUES)[number];

export const RENOVATION_LABELS: Record<Renovation, string> = {
  NEW_RENOVATED: "New renovated",
  RENOVATED: "Renovated",
  OLD_RENOVATED: "Old renovated",
  NEEDS_RENOVATION: "Needs renovation",
  GREEN_FRAME: "Green frame",
  WHITE_FRAME: "White frame",
  BLACK_FRAME: "Black frame",
};

export const BUILDING_CONDITIONS = [
  "OLD",
  "NEW",
  "UNDER_CONSTRUCTION",
] as const;
export type BuildingCondition = (typeof BUILDING_CONDITIONS)[number];

export const BUILDING_CONDITION_LABELS: Record<BuildingCondition, string> = {
  OLD: "Old",
  NEW: "New",
  UNDER_CONSTRUCTION: "Under construction",
};

export const KITCHEN_TYPES = ["SEPARATE", "STUDIO"] as const;
export type KitchenType = (typeof KITCHEN_TYPES)[number];

export const KITCHEN_TYPE_LABELS: Record<KitchenType, string> = {
  SEPARATE: "Separate",
  STUDIO: "Studio",
};

export function isDealType(value: string): value is DealType {
  return (DEAL_TYPES as readonly string[]).includes(value);
}

export function isClientStatus(value: string): value is ClientStatus {
  return (CLIENT_STATUSES as readonly string[]).includes(value);
}

export function isRentDealType(dealType: DealType): boolean {
  return dealType === "RENT" || dealType === "DAILY_RENT";
}
