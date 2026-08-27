"use client";

import type { Property } from "@/features/properties/types";
import { ReminderPickerModal } from "@/widgets/Reminders/ReminderPickerModal";

type PropertyListingRemindersModalProps = {
  open: boolean;
  property: Property;
  onClose: () => void;
  onScheduled: () => void;
};

export function PropertyListingRemindersModal({
  open,
  property,
  onClose,
  onScheduled,
}: PropertyListingRemindersModalProps) {
  return (
    <ReminderPickerModal
      mode="create"
      open={open}
      target={{ targetType: "PROPERTY", propertyId: property.id }}
      onClose={onClose}
      onSaved={onScheduled}
    />
  );
}
