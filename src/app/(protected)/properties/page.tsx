import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertiesView } from "@/widgets/Properties/PropertiesView";

export const metadata: Metadata = {
  title: "Properties",
};

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <p className="p-6 text-sm text-slate-600">Loading properties…</p>
      }
    >
      <PropertiesView />
    </Suspense>
  );
}

