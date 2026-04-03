export type Agent = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  createdAt: string;
};

export type AgentsResponse = {
  items: Agent[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type AgentDetails = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "ADMIN" | "AGENT";
  createdByAdminId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type AgentCreatePayload = {
  fullName: string;
  email: string;
  phone: string;
};

export type AgentUpdatePayload = Partial<AgentCreatePayload>;
