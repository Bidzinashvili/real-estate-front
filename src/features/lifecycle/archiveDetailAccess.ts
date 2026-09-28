import { ApiError } from "@/shared/lib/apiError";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import { isOpenedFromArchiveLocation } from "@/features/lifecycle/archiveNavigation";
import { isRecordArchived } from "@/features/lifecycle/isRecordArchived";

export function remembersArchiveDetailAccess(
  record: { archivedAt?: string | null } | null | undefined,
): boolean {
  if (isOpenedFromArchiveLocation()) {
    return true;
  }
  return record != null && isRecordArchived(record);
}

export function archivedDetailAccessMessage(
  statusCode: number,
  archiveContext: boolean,
  fallbackMessage: string,
): string {
  if (archiveContext && statusCode === 404) {
    return ARCHIVE_COPY.recordInaccessible;
  }
  return fallbackMessage;
}

export function readClientDetailFailure(
  error: unknown,
  archiveContext: boolean,
): { message: string; hideRecord: boolean } {
  const statusCode = error instanceof ApiError ? error.statusCode : 0;
  const fallbackMessage =
    error instanceof Error ? error.message : "კლიენტის ჩატვირთვა ვერ მოხერხდა.";
  return {
    message: archivedDetailAccessMessage(statusCode, archiveContext, fallbackMessage),
    hideRecord: statusCode === 404 && archiveContext,
  };
}
