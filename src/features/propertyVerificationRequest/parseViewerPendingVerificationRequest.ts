import type { JsonObject, JsonValue } from "@/shared/lib/jsonValue";

function nestedRequestIsPending(value: JsonValue | undefined): boolean {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as JsonObject;
  const statusValue = record.status;
  return typeof statusValue === "string" && statusValue.trim() === "PENDING";
}

export function parseViewerPendingVerificationRequest(record: JsonObject): boolean {
  if (record.viewerPendingVerificationRequest === true) {
    return true;
  }
  if (record.viewerHasPendingVerificationRequest === true) {
    return true;
  }
  if (nestedRequestIsPending(record.viewerPropertyVerificationRequest)) {
    return true;
  }
  if (nestedRequestIsPending(record.pendingVerificationRequestFromViewer)) {
    return true;
  }
  return false;
}
