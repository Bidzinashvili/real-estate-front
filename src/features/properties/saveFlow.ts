import type { Property } from "@/features/properties/types";

export async function refetchUpdatedProperty(
  propertyId: string,
  refetch: () => Promise<Property[]>,
): Promise<Property | null> {
  const list = await refetch();
  return list.find((item) => item.id === propertyId) ?? null;
}

