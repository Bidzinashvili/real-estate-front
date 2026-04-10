export type RemindersTimingFilter = "ALL" | "FUTURE_PENDING" | "PAST_OR_SENT";

export type RemindersTargetTypeFilter = "PROPERTY" | "CLIENT";

export type ReminderListVariant =
  | "SCHEDULED_PROPERTY"
  | "LISTING_VERIFICATION"
  | "CLIENT_REMINDER";

export type ReminderScheduledKind = "CUSTOM" | "RENTAL_PERIOD_ENDING";

export type GetRemindersQuery = {
  timing?: RemindersTimingFilter;
  targetType?: RemindersTargetTypeFilter;
  propertyId?: string;
  clientId?: string;
  page?: number;
  limit?: number;
};

export type PatchScheduledCustomReminderBody = {
  notifyAt?: string;
  note?: string | null;
};

export type PatchScheduledRentalEndingReminderBody = {
  notifyAt?: string;
  rentalDurationMonths?: number;
  rentalPeriodStartedAt?: string;
  rentalPeriodEndsAt?: string;
};

export type PatchListingOrClientReminderBody = {
  notifyAt?: string;
};

export type PatchReminderBody =
  | PatchScheduledCustomReminderBody
  | PatchScheduledRentalEndingReminderBody
  | PatchListingOrClientReminderBody;
