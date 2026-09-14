"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import { ClientsView } from "@/widgets/Clients/ClientsView";
import { PropertiesView } from "@/widgets/Properties/PropertiesView";

type ArchiveTab = "properties" | "clients";

function parseArchiveTab(value: string | null): ArchiveTab {
  return value === "clients" ? "clients" : "properties";
}

export function ArchiveView() {
  const searchParams = useSearchParams();
  const activeTab = parseArchiveTab(searchParams.get("tab"));
  const scopeQuery =
    searchParams.get("scope") === "MINE" ? "scope=MINE" : "";

  function archiveHref(tab: ArchiveTab): string {
    const params = new URLSearchParams();
    if (tab === "clients") {
      params.set("tab", "clients");
    }
    if (scopeQuery) {
      params.set("scope", "MINE");
    }
    const queryString = params.toString();
    return queryString ? `/archive?${queryString}` : "/archive";
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {ARCHIVE_COPY.pageTitle}
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          დაარქივებული განცხადებები და კლიენტები. ჩანაწერები რჩება რედაქტირებადი.
        </p>
      </div>

      <div
        className="inline-flex rounded-full border border-border bg-muted/90 p-0.5 shadow-sm"
        role="tablist"
        aria-label={ARCHIVE_COPY.pageTitle}
      >
        <Link
          href={archiveHref("properties")}
          role="tab"
          aria-selected={activeTab === "properties"}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
            activeTab === "properties"
              ? "bg-card text-foreground shadow-sm ring-1 ring-border/80"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {ARCHIVE_COPY.propertiesTab}
        </Link>
        <Link
          href={archiveHref("clients")}
          role="tab"
          aria-selected={activeTab === "clients"}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
            activeTab === "clients"
              ? "bg-card text-foreground shadow-sm ring-1 ring-border/80"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {ARCHIVE_COPY.clientsTab}
        </Link>
      </div>

      {activeTab === "properties" ? (
        <PropertiesView listingScope="archived" />
      ) : (
        <ClientsView listingScope="archived" />
      )}
    </div>
  );
}
