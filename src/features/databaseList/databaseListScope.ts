export const DATABASE_LIST_SCOPES = ["ALL", "MINE"] as const;

export type DatabaseListScope = (typeof DATABASE_LIST_SCOPES)[number];

export const DEFAULT_DATABASE_LIST_SCOPE: DatabaseListScope = "ALL";

export function isDatabaseListScope(value: string): value is DatabaseListScope {
  return value === "ALL" || value === "MINE";
}

export function parseDatabaseListScope(
  value: string | null | undefined,
): DatabaseListScope {
  if (typeof value === "string" && isDatabaseListScope(value.trim())) {
    return value.trim() as DatabaseListScope;
  }
  return DEFAULT_DATABASE_LIST_SCOPE;
}

export function toggleDatabaseListScope(
  currentScope: DatabaseListScope,
): DatabaseListScope {
  return currentScope === "MINE" ? "ALL" : "MINE";
}
