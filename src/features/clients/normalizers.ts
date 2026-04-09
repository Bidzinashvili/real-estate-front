import type {
  Client,
  ClientDetail,
  ClientRequirements,
  ClientsListResponse,
} from "@/features/clients/types";

function normalizeRequirements(
  requirements: ClientRequirements | null,
): ClientRequirements | null {
  if (!requirements) {
    return null;
  }
  return {
    ...requirements,
    projectExclude: requirements.projectExclude ?? [],
  };
}

export function normalizeClient(client: Client): Client {
  return {
    ...client,
    phones: client.phones ?? [],
    districts: client.districts ?? [],
    addresses: client.addresses ?? [],
    relatedPersons: client.relatedPersons ?? [],
  };
}

export function normalizeClientDetail(detail: ClientDetail): ClientDetail {
  const base = normalizeClient(detail);
  return {
    ...base,
    requirements: normalizeRequirements(detail.requirements),
    comments: detail.comments ?? [],
    internalComments: detail.internalComments ?? [],
  };
}

export function normalizeClientsListResponse(
  response: ClientsListResponse,
): ClientsListResponse {
  return {
    ...response,
    clients: response.clients.map((client) => normalizeClient(client)),
  };
}
