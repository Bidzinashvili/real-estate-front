import type { Metadata } from "next";
import { ClientProfilesView } from "@/widgets/ClientProfiles/ClientProfilesView";

export const metadata: Metadata = {
  title: "კლიენტის პროფილები",
};

export default function ClientProfilesPage() {
  return <ClientProfilesView />;
}
