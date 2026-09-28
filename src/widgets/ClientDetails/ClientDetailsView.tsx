"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useClientDetails } from "@/features/clients/useClientDetails";
import { markClientOpened } from "@/features/clients/api";
import { canMarkNoteOpened } from "@/features/noteLastOpened/canMarkNoteOpened";
import { useMarkNoteOpened } from "@/features/noteLastOpened/useMarkNoteOpened";
import { useEffectiveAccessViewer } from "@/features/adminMode/useEffectiveAccessViewer";
import { viewerCanViewClientDetail } from "@/features/databaseList/viewerOwnership";
import {
  archiveRecordBackLabel,
  isOpenedFromArchiveLocation,
  recordListHref,
} from "@/features/lifecycle/archiveNavigation";
import { useOpenedFromArchive } from "@/features/lifecycle/useOpenedFromArchive";
import { ClientDetailsContent } from "./ClientDetailsContent";

type ClientDetailsViewProps = {
  clientId: string;
};

export function ClientDetailsView({ clientId }: ClientDetailsViewProps) {
  const router = useRouter();
  const openedFromArchive = useOpenedFromArchive();
  const accessViewer = useEffectiveAccessViewer();
  const { client, isLoading, error, refetch, applyNoteLastOpenedAt } =
    useClientDetails(clientId);

  const canViewClientDetail =
    client && accessViewer
      ? viewerCanViewClientDetail(client, accessViewer)
      : false;

  useMarkNoteOpened({
    kind: "client",
    recordId: client?.id ?? null,
    canMark: canMarkNoteOpened(client, accessViewer),
    markOpened: markClientOpened,
    onOpened: applyNoteLastOpenedAt,
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">კლიენტი იტვირთება…</p>;
  }

  if (error || !client) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={() =>
            router.push(recordListHref("client", isOpenedFromArchiveLocation()))
          }
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {archiveRecordBackLabel("client", openedFromArchive)}
        </button>
        <p className="text-sm text-destructive" role="alert">
          {error ?? "კლიენტი ვერ მოიძებნა."}
        </p>
      </div>
    );
  }

  if (!canViewClientDetail) {
    return null;
  }

  return <ClientDetailsContent client={client} onClientChanged={() => void refetch()} />;
}
