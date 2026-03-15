import type { Metadata } from "next";
import { AgentDetailsView } from "@/widgets/AgentDetails/AgentDetailsView";

type AgentDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Agent details",
};

export default async function AgentDetailsPage({
  params,
}: AgentDetailsPageProps) {
  const { id } = await params;

  return <AgentDetailsView agentId={id} />;
}

