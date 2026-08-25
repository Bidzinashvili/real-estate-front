import type { Metadata } from "next";
import { CollaborationMonitorDetailsView } from "@/widgets/Collaboration/CollaborationMonitorDetailsView";

export const metadata: Metadata = {
  title: "თანამშრომლობის მონიტორინგი",
};

type CollaborationMonitorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CollaborationMonitorPage({
  params,
}: CollaborationMonitorPageProps) {
  const { id } = await params;
  return <CollaborationMonitorDetailsView monitorId={id} />;
}
