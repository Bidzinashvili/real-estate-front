type Viewer = {
  id: string;
  role: "ADMIN" | "AGENT";
};

type OwnershipRecord = {
  ownedByViewer: boolean | null;
  userId: string;
};

export function viewerOwnsRecord(
  record: OwnershipRecord,
  viewer: Viewer | null | undefined,
): boolean {
  if (!viewer) {
    return false;
  }
  if (record.ownedByViewer === true) {
    return true;
  }
  if (record.ownedByViewer === false) {
    return false;
  }
  return record.userId !== "" && record.userId === viewer.id;
}

export function viewerCanManageRecord(
  record: OwnershipRecord,
  viewer: Viewer | null | undefined,
): boolean {
  if (!viewer) {
    return false;
  }
  if (viewer.role === "ADMIN") {
    return true;
  }
  return viewerOwnsRecord(record, viewer);
}

export function isPrivacySafeSharedClient(record: {
  ownedByViewer: boolean | null;
  name: string;
}): boolean {
  return record.ownedByViewer === false && record.name.trim() === "";
}
