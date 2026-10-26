"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Bell, Handshake, Inbox } from "lucide-react";
import { useCollaborationInboxCount } from "@/features/collaboration/useCollaborationInboxCount";
import { useNotificationUnreadCount } from "@/features/notifications/useNotificationUnreadCount";
import { StatCard } from "@/shared/ui/StatCard";

type DashboardSummaryStripProps = {
  role: "ADMIN" | "AGENT";
  dueRemindersCount: number;
};

function SummaryLinkCard({
  href,
  label,
  value,
  icon,
}: {
  href: string;
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <Link href={href} className="group block h-full">
      <StatCard
        interactive
        label={label}
        value={value}
        icon={icon}
        className="h-full transition-colors group-hover:bg-muted/20"
      />
    </Link>
  );
}

export function DashboardSummaryStrip({
  role,
  dueRemindersCount,
}: DashboardSummaryStripProps) {
  const { count: inboxCount } = useCollaborationInboxCount({
    enabled: true,
    role,
  });
  const { count: notificationCount } = useNotificationUnreadCount({
    enabled: true,
  });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryLinkCard
        href="/reminders"
        label="აქტიური შეხსენებები"
        value={dueRemindersCount}
        icon={<Bell className="h-4 w-4" aria-hidden />}
      />
      <SummaryLinkCard
        href="/notifications"
        label="წაუკითხავი შეტყობინებები"
        value={notificationCount}
        icon={<Inbox className="h-4 w-4" aria-hidden />}
      />
      <SummaryLinkCard
        href="/collaborations"
        label={role === "ADMIN" ? "თანამშრომლობის ინბოქსი" : "თანამშრომლობა"}
        value={inboxCount}
        icon={<Handshake className="h-4 w-4" aria-hidden />}
      />
    </div>
  );
}
