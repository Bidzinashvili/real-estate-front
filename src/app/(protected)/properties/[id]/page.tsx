import type { Metadata } from "next";
import { PropertyDetailsReadOnlyPage } from "@/widgets/PropertyDetails/PropertyDetailsReadOnlyPage";

type PropertyDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "განცხადების დეტალები",
};

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { id } = await params;

  return <PropertyDetailsReadOnlyPage propertyId={id} />;
}
