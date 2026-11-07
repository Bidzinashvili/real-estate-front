export type Agent = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  createdAt: string;
  passwordSet?: boolean;
  /** Admin restricted access. A blocked agent's name is masked unless Admin Mode is ON. */
  blocked?: boolean;
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

export type AgentEmailDelivery = {
  setupEmailSent: boolean;
  adminNotificationSent: boolean;
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
  passwordSet?: boolean;
  blocked?: boolean;
};

export type AgentCreatePayload = {
  fullName: string;
  email: string;
  /** Optional. Omitted when the admin leaves it empty. */
  phone?: string;
};

export type AgentCreateResult = AgentDetails & {
  passwordSet: boolean;
  emailDelivery?: AgentEmailDelivery;
};

export type AgentUpdatePayload = Partial<AgentCreatePayload>;
