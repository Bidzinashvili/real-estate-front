export type TrashSortBy = "deletedAt" | "createdAt" | "updatedAt";
export type TrashSortOrder = "asc" | "desc";

export type TrashAgent = {
  id: string;
  fullName: string;
  email: string;
};

export type TrashPropertyRecord = {
  id: string;
  deletedAt: string;
  archivedAt: string | null;
  status: string;
  address: string;
  city: string | null;
  district: string | null;
  agent: TrashAgent | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type TrashClientRecord = {
  id: string;
  deletedAt: string;
  archivedAt: string | null;
  status: string;
  name: string;
  phones: string[];
  agent: TrashAgent | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type TrashSummary = {
  properties: number;
  clients: number;
};

export type TrashListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: TrashSortBy;
  order?: TrashSortOrder;
};

export type TrashListResult<Item> = {
  items: Item[];
  total: number;
  page: number;
  limit: number;
};

export const TRASH_SORT_VALUES: TrashSortBy[] = [
  "deletedAt",
  "createdAt",
  "updatedAt",
];

export const TRASH_ORDER_VALUES: TrashSortOrder[] = ["asc", "desc"];
