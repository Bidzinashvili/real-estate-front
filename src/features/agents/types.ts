export type Agent = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  createdAt: string;
};

export type AgentsResponse = {
  agents?: Agent[];
  items?: Agent[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
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
