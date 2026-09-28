export type PropertyVerificationRequestStatus = "PENDING" | "RESOLVED" | "CANCELLED";

export type PropertyVerificationRequestDto = {
  id: string;
  propertyId: string;
  requesterId: string;
  ownerUserId: string;
  status: PropertyVerificationRequestStatus;
  createdAt: string;
  resolvedAt: string | null;
};
