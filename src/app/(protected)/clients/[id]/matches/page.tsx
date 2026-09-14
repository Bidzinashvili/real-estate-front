import type { Metadata } from "next";
import { parseMatchScope } from "@/features/matching/matchingRoutes";
import { ClientPropertyMatchesView } from "@/widgets/Matching/ClientPropertyMatchesView";

export const metadata: Metadata = {
  title: "შესაბამისი განცხადებები",
};

type ClientMatchesPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ scope?: string }>;
};

export default async function ClientMatchesPage({
  params,
  searchParams,
}: ClientMatchesPageProps) {
  const { id } = await params;
  const query = await searchParams;
  return (
    <main className="min-h-screen bg-muted px-4 py-8 text-foreground sm:px-6">
      <ClientPropertyMatchesView clientId={id} scope={parseMatchScope(query.scope)} />
    </main>
  );
}
