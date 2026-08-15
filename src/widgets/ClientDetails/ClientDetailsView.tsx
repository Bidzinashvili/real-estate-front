"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useClientDetails } from "@/features/clients/useClientDetails";
import { ClientDetailsContent } from "./ClientDetailsContent";

type ClientDetailsViewProps = {
  clientId: string;
};

export function ClientDetailsView({ clientId }: ClientDetailsViewProps) {
  const router = useRouter();
  const { client, isLoading, error } = useClientDetails(clientId);

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

  return <ClientDetailsContent client={client} />;
}
