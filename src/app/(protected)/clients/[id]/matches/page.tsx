import type { Metadata } from "next";
import { ClientPropertyMatchesView } from "@/widgets/Matching/ClientPropertyMatchesView";

export const metadata: Metadata = {
  title: "შესაბამისი განცხადებები",
};

type ClientMatchesPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClientMatchesPage({ params }: ClientMatchesPageProps) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-muted px-4 py-8 text-foreground sm:px-6">
      <ClientPropertyMatchesView clientId={id} />
    </main>
  );
}
