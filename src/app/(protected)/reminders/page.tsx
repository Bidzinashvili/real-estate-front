import type { Metadata } from "next";
import { RemindersView } from "@/widgets/Reminders/RemindersView";

export const metadata: Metadata = {
  title: "შეხსენებები",
};

export default function RemindersPage() {
  return <RemindersView />;
}
