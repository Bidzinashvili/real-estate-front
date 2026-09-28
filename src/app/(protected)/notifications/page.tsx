import type { Metadata } from "next";
import { NotificationsView } from "@/widgets/Notifications/NotificationsView";

export const metadata: Metadata = {
  title: "შეტყობინებები",
};

export default function NotificationsPage() {
  return <NotificationsView />;
}
