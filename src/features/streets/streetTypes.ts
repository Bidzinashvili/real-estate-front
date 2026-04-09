export type Street = {
  id: string;
  name: string;
  normalizedName: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
};

export type GetStreetsQuery = {
  query: string;
  limit?: number;
  fuzzy?: boolean;
};

export type GetStreetsResponse = {
  streets: Street[];
};
