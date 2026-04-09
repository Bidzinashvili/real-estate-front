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
    return <p className="text-sm text-slate-600">Loading client…</p>;
  }

  if (error || !client) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => router.push("/clients")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All clients
        </button>
        <p className="text-sm text-red-600" role="alert">
          {error ?? "Client not found."}
        </p>
      </div>
    );
  }

  return <ClientDetailsContent client={client} />;
}
