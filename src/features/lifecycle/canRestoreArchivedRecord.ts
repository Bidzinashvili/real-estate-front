import type { ClientStatus } from "@/features/clients/clientEnums";
import { isClientArchived } from "@/features/lifecycle/isClientArchived";
import { isPropertyArchived } from "@/features/lifecycle/isPropertyArchived";
import type { PropertyStatus } from "@/features/properties/propertyStatus";

const RESTORABLE_PROPERTY_STATUSES: ReadonlyArray<PropertyStatus> = [
  "FOR_SALE",
  "FOR_RENT",
  "AVAILABLE_SOON",
];

const RESTORABLE_CLIENT_STATUSES: ReadonlyArray<ClientStatus> = [
  "ACTIVE",
  "IN_PROGRESS",
  "NEEDS_VERIFICATION",
];

export function canRestoreArchivedProperty(property: {
  archivedAt?: string | null;
  status: PropertyStatus;
}): boolean {
  return (
    isPropertyArchived(property) &&
    RESTORABLE_PROPERTY_STATUSES.includes(property.status)
  );
}

export function canRestoreArchivedClient(client: {
  archivedAt?: string | null;
  status: ClientStatus;
}): boolean {
  return (
    isClientArchived(client) &&
    RESTORABLE_CLIENT_STATUSES.includes(client.status)
  );
}
