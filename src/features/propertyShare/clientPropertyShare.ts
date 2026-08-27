import { isPrivacySafeSharedClient, viewerCanManageRecord } from "@/features/databaseList/viewerOwnership";
import { extractWhatsAppDigits } from "@/features/propertyShare/propertyWhatsAppShare";

type ShareViewer = {
  id: string;
  role: "ADMIN" | "AGENT";
};

type ShareClient = {
  ownedByViewer: boolean | null;
  userId: string;
  name: string;
  phones: string[];
  whatsapp: string | null;
};

export function canSharePropertyToClient(
  viewer: ShareViewer | null | undefined,
  client: ShareClient,
): boolean {
  if (!viewer) {
    return false;
  }
  if (isPrivacySafeSharedClient(client)) {
    return false;
  }
  return viewerCanManageRecord(client, viewer);
}

export function collectClientSharePhones(client: {
  phones: string[];
  whatsapp: string | null;
}): string[] {
  const uniquePhones: string[] = [];
  const seenDigits = new Set<string>();

  const candidates = [...client.phones, client.whatsapp ?? ""];
  for (const candidate of candidates) {
    const trimmedPhone = candidate.trim();
    const digitsKey = extractWhatsAppDigits(trimmedPhone);
    if (!digitsKey || seenDigits.has(digitsKey)) {
      continue;
    }
    seenDigits.add(digitsKey);
    uniquePhones.push(trimmedPhone);
  }

  return uniquePhones;
}

export function isAgentListingInactive(listing: {
  status: string;
  archivedAt?: string | null;
}): boolean {
  const archivedAt = listing.archivedAt?.trim() ?? "";
  if (archivedAt !== "") {
    return true;
  }
  return (
    listing.status === "SOLD" ||
    listing.status === "RENTED" ||
    listing.status === "ARCHIVED"
  );
}

export const CLIENT_PHONE_MISSING_MESSAGE =
  "კლიენტის ტელეფონის ნომერი არ არის მითითებული";

export const INACTIVE_SHARE_WARNING =
  "ეს განცხადება აღარ არის აქტიური. მაინც გსურთ ბმულის გაზიარება?";

export const INVALID_PHONE_MESSAGE = "შეიყვანეთ სწორი ტელეფონის ნომერი";
