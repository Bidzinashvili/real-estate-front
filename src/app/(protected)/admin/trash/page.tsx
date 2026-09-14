import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminTrashView } from "@/widgets/AdminTrash/AdminTrashView";

export const metadata: Metadata = {
  title: "ნაგვის ყუთი",
};

export default function AdminTrashPage() {
  return (
    <Suspense
      fallback={
        <p className="p-6 text-sm text-muted-foreground">ნაგვის ყუთი იტვირთება…</p>
      }
    >
      <AdminTrashView />
    </Suspense>
  );
}
