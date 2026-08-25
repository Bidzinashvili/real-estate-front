"use client";

import { useState } from "react";
import { useCurrentUser } from "@/shared/hooks";
import { CreateCollaborationModal } from "@/widgets/Collaboration/CreateCollaborationModal";

type RequestCollaborationButtonProps = {
  propertyId: string;
  clientId?: string;
};

export function RequestCollaborationButton({
  propertyId,
  clientId,
}: RequestCollaborationButtonProps) {
  const { user } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);

  if (!user || user.role !== "AGENT") {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
      >
        მინდა თანამშრომლობა
      </button>
      <CreateCollaborationModal
        open={isOpen}
        propertyId={propertyId}
        clientId={clientId}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
