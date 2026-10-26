"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";
import { useNotificationsList } from "@/features/notifications/useNotificationsList";
import { formatTbilisiDateTime } from "@/shared/lib/formatDate";
import { buttonVariants } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import { EmptyState, LoadingState } from "@/shared/ui/PageState";
import { SectionCard } from "@/shared/ui/SectionCard";

const PREVIEW_LIMIT = 4;

export function DashboardNotificationsPreview() {
  const { notifications, isLoading, error } = useNotificationsList({ enabled: true });
  const previewItems = notifications.slice(0, PREVIEW_LIMIT);

  if (isLoading && notifications.length === 0) {
    return <LoadingState title="შეტყობინებები იტვირთება…" />;
  }

  if (error) {
    return null;
  }

  return (
    <SectionCard
      title="ბოლო შეტყობინებები"
      description="გადამოწმების მოთხოვნები და სისტემური განახლებები"
      icon={<Inbox className="h-4 w-4" aria-hidden />}
      action={
        <Link href="/notifications" className={cn(buttonVariants({ variant: "link", size: "sm" }))}>
          ყველას ნახვა
        </Link>
      }
      padding="sm"
    >
      {previewItems.length === 0 ? (
        <EmptyState
          title="ახალი შეტყობინებები არ არის."
          icon={Inbox}
          className="border-0 bg-transparent p-2 shadow-none ring-0"
        />
      ) : (
        <ul className="divide-y divide-border/80">
          {previewItems.map((notification) => {
            const rowContent = (
              <>
                <p className="text-sm font-medium text-foreground">{notification.message}</p>
                {notification.createdAt ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatTbilisiDateTime(notification.createdAt)}
                  </p>
                ) : null}
              </>
            );

            return (
              <li key={notification.id} className="py-3 first:pt-0 last:pb-0">
                {notification.propertyId ? (
                  <Link
                    href={`/properties/${notification.propertyId}`}
                    className="block rounded-lg transition-colors hover:bg-muted/40"
                  >
                    {rowContent}
                  </Link>
                ) : (
                  rowContent
                )}
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
