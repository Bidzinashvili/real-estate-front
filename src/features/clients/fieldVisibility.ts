/**
 * Field visibility for clients: which fields are visible to other agents vs. owner/admin.
 * "private" = owner + admin only (with admin mode on)
 * "public" = visible to all agents
 */
export const CLIENT_FIELD_VISIBILITY: Record<string, "public" | "private"> = {
  // Identity
  name: "private",
  phones: "private",
  whatsapp: "private",

  // Comments
  publicComment: "public",
  description: "private", // "Comment for me"

  // Budget
  budgetMin: "public",
  budgetMax: "public",
  budgetCurrency: "public",

  // Requirements (all public when filled)
  // color and hideFromOthers are private organization fields
  color: "private",
  hideFromOthers: "private",
};

export function getClientFieldVisibility(field: string): "public" | "private" | undefined {
  return CLIENT_FIELD_VISIBILITY[field];
}

export function isClientFieldPublic(field: string): boolean {
  return getClientFieldVisibility(field) === "public";
}
