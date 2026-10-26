import type { CollaborationClient } from "@/features/collaboration/collaborationApi.types";

export function collaborationClientHasRevealedContact(
  clientRecord: CollaborationClient,
): boolean {
  const trimmedName = clientRecord.name?.trim() ?? "";
  if (trimmedName !== "") {
    return true;
  }
  const phones = clientRecord.phones ?? [];
  if (phones.some((phone) => phone.trim() !== "")) {
    return true;
  }
  const trimmedWhatsapp = clientRecord.whatsapp?.trim() ?? "";
  return trimmedWhatsapp !== "";
}
