import type { Metadata } from "next";
import { ClientPropertyMatchesView } from "@/widgets/Matching/ClientPropertyMatchesView";

export const metadata: Metadata = {
  title: "Matching properties",
};

type ClientMatchesPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClientMatchesPage({ params }: ClientMatchesPageProps) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <ClientPropertyMatchesView clientId={id} />
    </main>
  );
}
