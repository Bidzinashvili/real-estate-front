import type { Metadata } from "next";
import { ClientInviteLinksView } from "@/widgets/ClientInviteLinks/ClientInviteLinksView";

export const metadata: Metadata = {
  title: "Client invite links",
};

export default function ClientInviteLinksPage() {
  return <ClientInviteLinksView />;
}
