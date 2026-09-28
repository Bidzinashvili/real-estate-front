import { isAgencySharedClientView } from "@/features/databaseList/viewerOwnership";
import { isRentalDealType } from "@/features/properties/propertyStatus";
import type { DealType } from "@/features/clients/clientEnums";

type CollaborationPropertyRecord = {
  ownedByViewer: boolean | null;
  hideFromOthers?: boolean;
  dealType: DealType;
};

type CollaborationClientRecord = {
  ownedByViewer: boolean | null;
  hideFromOthers?: boolean;
};

export function canRequestCollaborationOnProperty(
  record: CollaborationPropertyRecord,
): boolean {
  if (record.ownedByViewer === true) {
    return false;
  }
  if (record.hideFromOthers === true) {
    return false;
  }
  return true;
}

export function canRequestCollaborationOnClient(
  record: CollaborationClientRecord,
): boolean {
  if (record.ownedByViewer === true) {
    return false;
  }
  if (record.hideFromOthers === true) {
    return false;
  }
  return isAgencySharedClientView(record);
}

export function propertyCollaborationRequiresClientPicker(dealType: DealType): boolean {
  return isRentalDealType(dealType);
}
