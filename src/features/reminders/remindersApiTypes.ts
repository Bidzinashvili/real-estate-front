export type ISODateString = string;
export type UUID = string;

export type RemindersTimingFilter = "ALL" | "FUTURE_PENDING" | "PAST_OR_SENT";
export type ReminderTiming = RemindersTimingFilter;

export type ReminderListVariant =
  | "SCHEDULED_PROPERTY"
  | "LISTING_VERIFICATION"
  | "CLIENT_REMINDER";
export type ReminderVariant = ReminderListVariant;

export type ReminderScheduledKind = "CUSTOM" | "RENTAL_PERIOD_ENDING";
export type ReminderKind = ReminderScheduledKind;
export type RemindersTargetTypeFilter = "PROPERTY" | "CLIENT";
export type ReminderTargetType = RemindersTargetTypeFilter;

export type GetRemindersQuery = {
  timing?: RemindersTimingFilter;
  targetType?: RemindersTargetTypeFilter;
  propertyId?: UUID;
  clientId?: UUID;
  page?: number;
  limit?: number;
};

export type ReminderItem = {
  id: string;
  notifyAt: ISODateString;
  sentAt?: ISODateString | null;
  variant: ReminderVariant;
  targetType: ReminderTargetType;
  property?: {
    id: UUID;
    address: string;
    city: string;
    district: string;
    status: string;
  } | null;
  client?: {
    id: UUID;
    name: string;
  } | null;
  propertyId?: UUID;
  clientId?: UUID;
  subjectTitle?: string;
  scheduledKind?: ReminderKind | null;
  note?: string | null;
  rentalDurationMonths?: number | null;
  rentalPeriodStartedAt?: ISODateString | null;
  rentalPeriodEndsAt?: ISODateString | null;
  createdAt?: ISODateString;
};

export type GetRemindersResponse = {
  total: number;
  page: number;
  limit: number;
  reminders: ReminderItem[];
};

export type PatchScheduledCustomReminderBody = {
  notifyAt?: ISODateString;
  note?: string | null;
};

export type PatchScheduledRentalEndingReminderBody = {
  notifyAt?: ISODateString;
  rentalDurationMonths?: number;
  rentalPeriodStartedAt?: ISODateString;
  rentalPeriodEndsAt?: ISODateString;
};

export type PatchListingOrClientReminderBody = {
  notifyAt?: ISODateString;
};

export type PatchReminderBody =
  | PatchScheduledCustomReminderBody
  | PatchScheduledRentalEndingReminderBody
  | PatchListingOrClientReminderBody;
