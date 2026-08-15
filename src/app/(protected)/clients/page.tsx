import type { Metadata } from "next";
import { Suspense } from "react";
import { ClientsView } from "@/widgets/Clients/ClientsView";

export const metadata: Metadata = {
  title: "კლიენტები",
};

export default function ClientsPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-muted-foreground">კლიენტები იტვირთება…</p>}>
      <ClientsView />
    </Suspense>
  );
}
