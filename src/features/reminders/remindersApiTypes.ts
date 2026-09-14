export type ISODateString = string;
export type UUID = string;

export type RemindersTimingFilter = "ALL" | "FUTURE_PENDING" | "PAST_OR_SENT";
export type ReminderTiming = RemindersTimingFilter;

export type ReminderListVariant =
  | "SCHEDULED_PROPERTY"
  | "SCHEDULED_CLIENT"
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

export type ReminderFeedActions = {
  canUpdate: boolean;
  canDelete: boolean;
  canDismiss: boolean;
  canSnooze: boolean;
};

export type ReminderCoverImage = {
  id: string;
  url: string;
  originalName: string;
};

export type ReminderPropertyPreview = {
  id: UUID;
  address: string;
  city: string;
  district: string;
  status: string;
  title: string | null;
  propertyType: string | null;
  dealType: string | null;
  archivedAt: ISODateString | null;
  coverImage: ReminderCoverImage | null;
};

export type ReminderClientPreview = {
  id: UUID;
  name: string;
  status: string | null;
  dealType: string | null;
  archivedAt: ISODateString | null;
  districts: string[];
};

export type ReminderItem = {
  id: string;
  notifyAt: ISODateString;
  createdAt?: ISODateString | null;
  sentAt?: ISODateString | null;
  triggeredAt?: ISODateString | null;
  dismissedAt?: ISODateString | null;
  isDue?: boolean;
  variant: ReminderVariant;
  targetType: ReminderTargetType;
  note?: string | null;
  scheduledKind?: ReminderKind | null;
  property?: ReminderPropertyPreview | null;
  client?: ReminderClientPreview | null;
  propertyId?: UUID;
  clientId?: UUID;
  subjectTitle?: string;
  rentalDurationMonths?: number | null;
  rentalPeriodStartedAt?: ISODateString | null;
  rentalPeriodEndsAt?: ISODateString | null;
  actions?: ReminderFeedActions;
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
  dismissedAt?: ISODateString | null;
};

export type PatchReminderBody =
  | PatchScheduledCustomReminderBody
  | PatchScheduledRentalEndingReminderBody
  | PatchListingOrClientReminderBody;

export type SnoozeReminderBody = {
  minutes: number;
};

export type ReminderSummary = {
  activeCount: number;
  nextReminderAt: ISODateString | null;
  hasDueReminder: boolean;
  latestTriggeredAt: ISODateString | null;
};
