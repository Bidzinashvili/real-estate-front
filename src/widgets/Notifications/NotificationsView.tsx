"use client";

import Link from "next/link";
import { Inbox as InboxIcon } from "lucide-react";
import { useNotificationsList } from "@/features/notifications/useNotificationsList";
import { useUserStore } from "@/shared/stores";
import { formatTbilisiDateTime } from "@/shared/lib/formatDate";
import { EmptyState, ErrorState, LoadingState } from "@/shared/ui/PageState";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { PageHeader } from "@/shared/ui/PageHeader";
import { surfaceCardClassName } from "@/shared/ui/surfaceStyles";
export function NotificationsView() {
  const user = useUserStore((state) => state.user);
  const enabled = user !== null;
  const { notifications, isLoading, error } = useNotificationsList({ enabled });

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="შეტყობინებები"
        description="სისტემური შეტყობინებები და გადამოწმების მოთხოვნები"
        icon={InboxIcon}
      />

      {isLoading && notifications.length === 0 ? (
        <LoadingState title="შეტყობინებები იტვირთება…" />
      ) : null}

      {error ? (
        <ErrorState title="ჩატვირთვა ვერ მოხერხდა" description={error} />
      ) : null}

      {!isLoading && !error && notifications.length === 0 ? (
        <EmptyState
          title="ახალი შეტყობინებები არ არის."
          icon={InboxIcon}
        />
      ) : null}

      {!isLoading && !error && notifications.length > 0 ? (
        <section>
          <SectionHeader title="ბოლო შეტყობინებები" />
          <ul className="flex flex-col gap-2">
            {notifications.map((notification) => {
              const hasPropertyLink = Boolean(notification.propertyId);
              const content = (
                <>
                  <p className="text-sm font-medium text-foreground">
                    {notification.message}
                  </p>
                  {notification.createdAt ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatTbilisiDateTime(notification.createdAt)}
                    </p>
                  ) : null}
                </>
              );

              return (
                <li key={notification.id}>
                  {hasPropertyLink ? (
                    <Link
                      href={`/properties/${notification.propertyId}`}
                      className={`block p-4 transition-colors hover:bg-muted/40 ${surfaceCardClassName}`}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className={`p-4 ${surfaceCardClassName}`}>{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
