import type { Metadata } from "next";
import { PropertyClientMatchesView } from "@/widgets/Matching/PropertyClientMatchesView";

export const metadata: Metadata = {
  title: "Matching clients",
};

type PropertyMatchesPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PropertyMatchesPage({ params }: PropertyMatchesPageProps) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <PropertyClientMatchesView propertyId={id} />
    </main>
  );
}
