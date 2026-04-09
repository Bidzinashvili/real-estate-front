import type { Metadata } from "next";
import { EditClientForm } from "@/widgets/EditClient/EditClientForm";

export const metadata: Metadata = {
  title: "Edit client",
};

type EditClientPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params;
  return <EditClientForm clientId={id} />;
}
