import type { Metadata } from "next";
import { ClientDetailsView } from "@/widgets/ClientDetails/ClientDetailsView";

export const metadata: Metadata = {
  title: "Client details",
};

type ClientPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = await params;
  return <ClientDetailsView clientId={id} />;
}
