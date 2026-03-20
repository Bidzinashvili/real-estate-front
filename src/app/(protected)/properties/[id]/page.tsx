import type { Metadata } from "next";
import { PropertyDetailsView } from "@/widgets/PropertyDetails/PropertyDetailsView";

type PropertyDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Property details",
};

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { id } = await params;

  return <PropertyDetailsView propertyId={id} />;
}

