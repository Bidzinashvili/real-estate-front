import { isPropertyArchived } from "@/features/lifecycle/isPropertyArchived";
import type { PropertyStatus } from "@/features/properties/propertyStatus";

export const PROPERTY_VERIFICATION_COPY = {
  compactLabel: "გადამოწმებულია",
  detailLabel: "ბოლო გადამოწმება",
  verifyToday: "დღეს გადავამოწმე",
  verifyStillActive: "გადავამოწმე — ისევ აქტიურია",
  verifyTodayCombined: "დღეს გადავამოწმე — ისევ აქტიურია",
  verifying: "მოწმდება…",
  verifySuccess: "განცხადება გადამოწმებულია",
  verifyError: "განცხადების გადამოწმება ვერ მოხერხდა.",
} as const;

type PropertyVerificationRecord = {
  status: PropertyStatus;
  archivedAt?: string | null;
};

export function isCurrentlyActiveListing(
  property: PropertyVerificationRecord,
): boolean {
  if (isPropertyArchived(property)) {
    return false;
  }
  return property.status === "FOR_SALE" || property.status === "FOR_RENT";
}

export function canVerifyPropertyListing(
  property: PropertyVerificationRecord,
): boolean {
  if (isPropertyArchived(property) || property.status === "ARCHIVED") {
    return false;
  }
  return (
    property.status === "FOR_SALE" ||
    property.status === "FOR_RENT" ||
    property.status === "NEEDS_VERIFICATION"
  );
}

export function propertyVerifyActionLabel(status: PropertyStatus): string {
  if (status === "NEEDS_VERIFICATION") {
    return PROPERTY_VERIFICATION_COPY.verifyStillActive;
  }
  return PROPERTY_VERIFICATION_COPY.verifyToday;
}
