import type { Metadata } from "next";
import { Suspense } from "react";
import { ClientsView } from "@/widgets/Clients/ClientsView";

export const metadata: Metadata = {
  title: "Clients",
};

export default function ClientsPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-slate-600">Loading clients…</p>}>
      <ClientsView />
    </Suspense>
  );
}
