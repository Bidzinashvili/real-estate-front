import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertiesView } from "@/widgets/Properties/PropertiesView";

export const metadata: Metadata = {
  title: "განცხადებები",
};

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <p className="p-6 text-sm text-muted-foreground">განცხადებები იტვირთება…</p>
      }
    >
      <PropertiesView />
    </Suspense>
  );
}

