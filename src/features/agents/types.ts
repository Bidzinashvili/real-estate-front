export type Agent = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
};

export type AgentsResponse = {
  total: number;
  agents: Agent[];
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

export type AgentUpdatePayload = AgentCreatePayload;
