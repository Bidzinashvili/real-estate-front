export function isPropertyArchived(property: {
  archivedAt?: string | null;
}): boolean {
  return property.archivedAt != null && property.archivedAt.trim() !== "";
}
