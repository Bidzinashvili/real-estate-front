"use client";

import Link from "next/link";
import { useNotificationsList } from "@/features/notifications/useNotificationsList";
import { useUserStore } from "@/shared/stores";
import { formatTbilisiDateTime } from "@/shared/lib/formatDate";

export function NotificationsView() {
  const user = useUserStore((state) => state.user);
  const enabled = user !== null;
  const { notifications, isLoading, error } = useNotificationsList({ enabled });

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          შეტყობინებები
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          სისტემური შეტყობინებები და გადამოწმების მოთხოვნები
        </p>
      </div>

      {isLoading && notifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">იტვირთება…</p>
      ) : null}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {!isLoading && !error && notifications.length === 0 ? (
        <p className="rounded-2xl bg-card px-4 py-8 text-center text-sm text-muted-foreground ring-1 ring-border">
          ახალი შეტყობინებები არ არის.
        </p>
      ) : null}

      <ul className="flex flex-col gap-2">
        {notifications.map((notification) => {
          const hasPropertyLink = Boolean(notification.propertyId);
          const content = (
            <>
              <p className="text-sm font-medium text-foreground">{notification.message}</p>
              {notification.createdAt ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatTbilisiDateTime(notification.createdAt)}
                </p>
              ) : null}
            </>
          );

          if (hasPropertyLink && notification.propertyId) {
            return (
              <li key={notification.id}>
                <Link
                  href={`/properties/${notification.propertyId}`}
                  className="block rounded-2xl bg-card px-4 py-3 shadow-sm ring-1 ring-border transition hover:bg-muted/40"
                >
                  {content}
                </Link>
              </li>
            );
          }

          return (
            <li
              key={notification.id}
              className="rounded-2xl bg-card px-4 py-3 shadow-sm ring-1 ring-border"
            >
              {content}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
