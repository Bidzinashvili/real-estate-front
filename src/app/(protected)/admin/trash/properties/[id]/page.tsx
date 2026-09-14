import type { Metadata } from "next";
import { TrashPropertyDetailView } from "@/widgets/AdminTrash/TrashDetailViews";

export const metadata: Metadata = {
  title: "წაშლილი განცხადება",
};

type TrashPropertyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TrashPropertyPage({ params }: TrashPropertyPageProps) {
  const { id } = await params;
  return <TrashPropertyDetailView recordId={id} />;
}
