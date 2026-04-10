import type { PropertyUpdatePayload } from "@/features/properties/types";
import type { PropertyStatus } from "@/features/properties/propertyStatus";
import { datetimeLocalValueToIso } from "@/shared/lib/datetimeLocalIso";

export type LifecycleFormSnapshot = {
  status: PropertyStatus;
  reminderLocal: string;
};

export function buildLifecycleUpdatePatch(
  initial: LifecycleFormSnapshot,
  current: LifecycleFormSnapshot,
): Pick<PropertyUpdatePayload, "status" | "reminderDate"> {
  const patch: Pick<PropertyUpdatePayload, "status" | "reminderDate"> = {};
  if (initial.status !== current.status) {
    patch.status = current.status;
  }
  if (current.status === "TO_BE_VERIFIED") {
    if (current.reminderLocal.trim() === "") {
      if (initial.reminderLocal.trim() !== "") {
        patch.reminderDate = null;
      }
    } else if (current.reminderLocal !== initial.reminderLocal) {
      const iso = datetimeLocalValueToIso(current.reminderLocal);
      if (iso) {
        patch.reminderDate = iso;
      }
    }
  }
  return patch;
}
