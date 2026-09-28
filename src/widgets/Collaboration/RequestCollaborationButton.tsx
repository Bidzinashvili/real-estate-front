"use client";

import { useState } from "react";
import type { DealType } from "@/features/clients/clientEnums";
import { propertyCollaborationRequiresClientPicker } from "@/features/collaboration/canRequestCollaboration";
import { useCurrentUser } from "@/shared/hooks";
import { CreateCollaborationModal } from "@/widgets/Collaboration/CreateCollaborationModal";
import { CollaborationRentClientPickerModal } from "@/widgets/Collaboration/CollaborationRentClientPickerModal";

type RequestCollaborationButtonProps = {
  propertyId?: string;
  dealType?: DealType;
  attachedClientId?: string;
  collaborationClientId?: string;
  canRequest?: boolean;
  recordOwnedByViewer?: boolean | null;
};

export function RequestCollaborationButton({
  propertyId,
  dealType,
  attachedClientId,
  collaborationClientId,
  canRequest = true,
  recordOwnedByViewer = false,
}: RequestCollaborationButtonProps) {
  const { user } = useCurrentUser();
  const [isClientPickerOpen, setIsClientPickerOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [selectedRentalClientId, setSelectedRentalClientId] = useState<string | undefined>(
    attachedClientId,
  );
  const isOwnRecord = recordOwnedByViewer === true;
  const canShowRequest = canRequest && !isOwnRecord && user?.role === "AGENT";
  const isClientOnly = Boolean(collaborationClientId) && !propertyId;
  const requiresClientPicker =
    Boolean(propertyId) &&
    dealType !== undefined &&
    propertyCollaborationRequiresClientPicker(dealType) &&
    !attachedClientId;

  if (!canShowRequest) {
    return null;
  }

  function openCollaborationFlow() {
    if (isClientOnly) {
      setIsSplitModalOpen(true);
      return;
    }
    if (requiresClientPicker) {
      setSelectedRentalClientId(undefined);
      setIsClientPickerOpen(true);
      return;
    }
    setSelectedRentalClientId(attachedClientId);
    setIsSplitModalOpen(true);
  }

  function handleClientPicked(clientId: string) {
    setSelectedRentalClientId(clientId);
    setIsClientPickerOpen(false);
    setIsSplitModalOpen(true);
  }

  function closeSplitModal() {
    setIsSplitModalOpen(false);
    setSelectedRentalClientId(attachedClientId);
  }

  const splitModalClientId = isClientOnly
    ? collaborationClientId
    : requiresClientPicker || attachedClientId
      ? selectedRentalClientId ?? attachedClientId
      : undefined;

  return (
    <>
      <button
        type="button"
        onClick={openCollaborationFlow}
        className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
      >
        მინდა თანამშრომლობა
      </button>
      <CollaborationRentClientPickerModal
        open={isClientPickerOpen}
        onClose={() => setIsClientPickerOpen(false)}
        onClientSelected={handleClientPicked}
      />
      <CreateCollaborationModal
        open={isSplitModalOpen}
        propertyId={isClientOnly ? undefined : propertyId}
        clientId={splitModalClientId}
        onClose={closeSplitModal}
      />
    </>
  );
}
