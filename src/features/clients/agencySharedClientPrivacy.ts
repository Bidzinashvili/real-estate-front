import type { Client, ClientDetail } from "@/features/clients/types";

export function applyAgencySharedClientPrivacy(client: Client): Client {
  if (client.ownedByViewer !== false) {
    return client;
  }

  return {
    ...client,
    name: "",
    phones: [],
    whatsapp: null,
    labels: [],
    relatedPersons: [],
    clientProfileId: null,
    clientProfile: null,
    description: undefined,
    hideFromOthers: undefined,
    color: undefined,
    noteLastOpenedAt: undefined,
    reminderSummary: client.reminderSummary,
  };
}

export function applyAgencySharedClientDetailPrivacy(client: ClientDetail): ClientDetail {
  const sanitizedBase = applyAgencySharedClientPrivacy(client);
  return {
    ...sanitizedBase,
    comments: [],
    internalComments: [],
  };
}
