import type { Metadata } from "next";
import { parseMatchScope } from "@/features/matching/matchingRoutes";
import { PropertyClientMatchesView } from "@/widgets/Matching/PropertyClientMatchesView";

export const metadata: Metadata = {
  title: "შესაბამისი კლიენტები",
};

type PropertyMatchesPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ scope?: string }>;
};

export default async function PropertyMatchesPage({
  params,
  searchParams,
}: PropertyMatchesPageProps) {
  const { id } = await params;
  const query = await searchParams;
  return (
    <main className="min-h-screen bg-muted px-4 py-8 text-foreground sm:px-6">
      <PropertyClientMatchesView
        propertyId={id}
        scope={parseMatchScope(query.scope)}
      />
    </main>
  );
}
