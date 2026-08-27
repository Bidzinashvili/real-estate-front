import type { Metadata } from "next";
import { TrashClientDetailView } from "@/widgets/AdminTrash/TrashDetailViews";

export const metadata: Metadata = {
  title: "წაშლილი კლიენტი",
};

type TrashClientPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TrashClientPage({ params }: TrashClientPageProps) {
  const { id } = await params;
  return <TrashClientDetailView recordId={id} />;
}
