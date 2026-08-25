import type { Metadata } from "next";
import { CollaborationDetailsView } from "@/widgets/Collaboration/CollaborationDetailsView";

export const metadata: Metadata = {
  title: "თანამშრომლობის მოთხოვნა",
};

type CollaborationDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CollaborationDetailsPage({
  params,
}: CollaborationDetailsPageProps) {
  const { id } = await params;
  return <CollaborationDetailsView collaborationId={id} />;
}
