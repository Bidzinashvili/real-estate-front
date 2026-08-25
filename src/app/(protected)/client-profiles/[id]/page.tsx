import type { Metadata } from "next";
import { ClientProfileDetailsView } from "@/widgets/ClientProfileDetails/ClientProfileDetailsView";

export const metadata: Metadata = {
  title: "კლიენტის პროფილი",
};

type ClientProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClientProfilePage({
  params,
}: ClientProfilePageProps) {
  const { id } = await params;
  return <ClientProfileDetailsView profileId={id} />;
}
