import { isRecordArchived } from "@/features/lifecycle/isRecordArchived";

export function isPropertyArchived(property: {
  archivedAt?: string | null;
}): boolean {
  return isRecordArchived(property);
}
