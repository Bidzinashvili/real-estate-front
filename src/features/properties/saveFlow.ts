import type { Property } from "@/features/properties/types";

export async function refetchUpdatedProperty(
  propertyId: string,
  refetch: () => Promise<Property | null>,
): Promise<Property | null> {
  const next = await refetch();
  return next?.id === propertyId ? next : null;
}
