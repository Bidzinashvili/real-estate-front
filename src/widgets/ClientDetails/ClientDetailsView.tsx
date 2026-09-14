"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useClientDetails } from "@/features/clients/useClientDetails";
import { markClientOpened } from "@/features/clients/api";
import { canMarkNoteOpened } from "@/features/noteLastOpened/canMarkNoteOpened";
import { useMarkNoteOpened } from "@/features/noteLastOpened/useMarkNoteOpened";
import { useCurrentUser } from "@/shared/hooks";
import { ClientDetailsContent } from "./ClientDetailsContent";

type ClientDetailsViewProps = {
  clientId: string;
};

export function ClientDetailsView({ clientId }: ClientDetailsViewProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { client, isLoading, error, refetch, applyNoteLastOpenedAt } =
    useClientDetails(clientId);

  useMarkNoteOpened({
    kind: "client",
    recordId: client?.id ?? null,
    canMark: canMarkNoteOpened(client, user),
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
          onClick={() => router.push("/clients")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          ყველა კლიენტი
        </button>
        <p className="text-sm text-destructive" role="alert">
          {error ?? "კლიენტი ვერ მოიძებნა."}
        </p>
      </div>
    );
  }

  return <ClientDetailsContent client={client} onClientChanged={() => void refetch()} />;
}
