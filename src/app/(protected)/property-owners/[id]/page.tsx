import type { Metadata } from "next";
import { PropertyOwnerDetailsView } from "@/widgets/PropertyOwnerDetails/PropertyOwnerDetailsView";

export const metadata: Metadata = {
  title: "მეპატრონის პროფილი",
};

type PropertyOwnerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PropertyOwnerPage({ params }: PropertyOwnerPageProps) {
  const { id } = await params;
  return <PropertyOwnerDetailsView ownerId={id} />;
}
