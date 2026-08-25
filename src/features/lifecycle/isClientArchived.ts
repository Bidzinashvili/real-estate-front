import { isRecordArchived } from "@/features/lifecycle/isRecordArchived";

export function isClientArchived(client: {
  archivedAt?: string | null;
}): boolean {
  return isRecordArchived(client);
}
