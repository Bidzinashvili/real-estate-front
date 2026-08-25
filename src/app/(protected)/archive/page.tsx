import type { Metadata } from "next";
import { Suspense } from "react";
import { ArchiveView } from "@/widgets/Archive/ArchiveView";

export const metadata: Metadata = {
  title: "არქივი",
};

export default function ArchivePage() {
  return (
    <Suspense
      fallback={
        <p className="p-6 text-sm text-muted-foreground">არქივი იტვირთება…</p>
      }
    >
      <ArchiveView />
    </Suspense>
  );
}
