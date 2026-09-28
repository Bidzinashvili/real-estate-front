export type AppNotification = {
  id: string;
  message: string;
  createdAt: string;
  readAt: string | null;
  propertyId: string | null;
  propertyVerificationRequestId: string | null;
};

export type NotificationsListResult = {
  notifications: AppNotification[];
};
