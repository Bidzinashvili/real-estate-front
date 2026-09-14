export const CLIENT_PROFILES_LIST_HREF = "/client-profiles";

export function clientProfileHref(profileId: string): string {
  return `/client-profiles/${profileId}`;
}

export function clientNoteHref(clientNoteId: string): string {
  return `/clients/${clientNoteId}`;
}
