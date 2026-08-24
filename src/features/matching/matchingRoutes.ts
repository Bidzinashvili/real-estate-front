import { type MatchScope } from "@/features/matching/matchingEnums";

export function parseMatchScope(value: string | null | undefined): MatchScope {
  if (value === "MINE") {
    return "MINE";
  }
  return "GLOBAL";
}

export function clientMatchesHref(clientId: string, scope: MatchScope): string {
  return `/clients/${clientId}/matches?scope=${scope}`;
}

export function propertyMatchesHref(propertyId: string, scope: MatchScope): string {
  return `/properties/${propertyId}/matches?scope=${scope}`;
}
