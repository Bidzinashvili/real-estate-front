import { viewerCanManageRecord } from "@/features/databaseList/viewerOwnership";

type Viewer = {
  id: string;
  role: "ADMIN" | "AGENT";
};

type NoteOpenedRecord = {
  userId?: string;
  ownedByViewer?: boolean | null;
  noteLastOpenedAt?: string | null;
};

export function hasAuthorizedNoteLastOpenedAt(
  record: NoteOpenedRecord | null | undefined,
): boolean {
  return record != null && record.noteLastOpenedAt !== undefined;
}

export function canMarkNoteOpened(
  record: NoteOpenedRecord | null | undefined,
  viewer: Viewer | null | undefined,
): boolean {
  if (!record || !viewer) {
    return false;
  }
  if (!hasAuthorizedNoteLastOpenedAt(record)) {
    return false;
  }
  return viewerCanManageRecord(
    {
      ownedByViewer: record.ownedByViewer ?? null,
      userId: record.userId,
    },
    viewer,
  );
}
