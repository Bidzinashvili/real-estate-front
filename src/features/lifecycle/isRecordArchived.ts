export function isRecordArchived(record: {
  archivedAt?: string | null;
}): boolean {
  return record.archivedAt != null && record.archivedAt.trim() !== "";
}
