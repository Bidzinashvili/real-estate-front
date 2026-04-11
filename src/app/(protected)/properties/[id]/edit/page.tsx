import type { Metadata } from "next";
import { PropertyDetailsEditView } from "@/widgets/PropertyDetails/PropertyDetailsEditView";

type PropertyEditPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit property",
};

export default async function PropertyEditPage({ params }: PropertyEditPageProps) {
  const { id } = await params;

  return <PropertyDetailsEditView propertyId={id} />;
}
