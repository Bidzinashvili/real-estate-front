import type { AccessViewer } from "@/features/adminMode/effectiveAccessViewer";
import { viewerOwnsRecord } from "@/features/databaseList/viewerOwnership";
import type { Property } from "@/features/properties/types";

export function canRequestPeerPropertyVerification(
  viewer: AccessViewer | null | undefined,
  property: Property,
): boolean {
  if (!viewer) {
    return false;
  }
  if (viewer.role !== "AGENT" && viewer.role !== "ADMIN") {
    return false;
  }
  if (viewerOwnsRecord(property, viewer)) {
    return false;
  }
  if (property.hideFromOthers === true) {
    return false;
  }
  return true;
}
