"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePropertiesCatalog } from "@/features/properties/usePropertiesCatalog";
import { getApiBaseUrl } from "@/shared/lib/auth";
import { useCurrentUser } from "@/shared/hooks";
import {
  PropertyCatalogDesktopAside,
  PropertyCatalogMobileDrawer,
  PropertyCatalogMobileFiltersButton,
} from "@/widgets/Properties/propertyCatalogFilters";
import { PropertyCatalogScopeToggle } from "@/widgets/Properties/PropertyCatalogScopeToggle";
import { prefetchGelToUsdForAmounts } from "@/features/currency/gelToUsdConvertCache";
import type { Property } from "@/features/properties/types";
import { PropertyListingCard } from "@/widgets/Properties/PropertyListingCard";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";

type PropertiesViewProps = {
  listingScope?: "current" | "archived";
};

export function PropertiesView({ listingScope = "current" }: PropertiesViewProps) {
  const router = useRouter();
  const apiBaseUrl = getApiBaseUrl();
  const { user, isLoading: isAuthLoading } = useCurrentUser();
  const isArchiveScope = listingScope === "archived";
  const catalog = usePropertiesCatalog({
    syncUrl: !isArchiveScope,
    archivedFilter: isArchiveScope,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const isLoggedIn = user !== null;

  const {
    properties,
    total,
    page,
    totalPages,
    isLoading,
    error,
    state,
    setSearchInput,
    setPage,
    refetch,
  } = catalog;

  const handleViewProperty = useCallback(
    (propertyId: string) => {
      router.push(`/properties/${propertyId}`);
    },
    [router],
  );

  const canChangeListingStatus = useCallback(
    (listing: Property) => {
      if (!user) return false;
      if (user.role === "ADMIN") return true;
      return user.role === "AGENT" && listing.userId === user.id;
    },
    [user],
  );
  const canSetListingReminders = user !== null;

  const catalogPrefetchKey = useMemo(
    () =>
      properties.map((property) => `${property.id}:${property.pricePublic}`).join("|"),
    [properties],
  );

  useEffect(() => {
    if (isLoading || error || properties.length === 0) return;
    const publicPrices = properties.map((property) => property.pricePublic);
    void prefetchGelToUsdForAmounts(publicPrices);
  }, [catalogPrefetchKey, error, isLoading, properties]);

  return (
    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="hidden w-72 shrink-0 lg:block">
        <PropertyCatalogDesktopAside catalog={catalog} />
      </div>

      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          {isArchiveScope ? null : (
            <button
              type="button"
              onClick={() => router.push("/properties/new")}
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
            >
              განცხადების დამატება
            </button>
          )}
          <PropertyCatalogScopeToggle
            catalog={catalog}
            isLoggedIn={isLoggedIn}
            isAuthLoading={isAuthLoading}
          />
          <div className="flex w-full items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 shadow-sm sm:w-72">
            <input
              type="search"
              value={state.searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="განცხადებების ძიება…"
              className="h-7 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {state.searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition hover:text-foreground"
                aria-label="ძიების გასუფთავება"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
            <span
              className="inline-flex h-7 w-7 items-center justify-center text-muted-foreground"
              aria-hidden
            >
              <Search className="h-4 w-4" />
            </span>
          </div>
          <div className="lg:hidden">
            <PropertyCatalogMobileFiltersButton
              catalog={catalog}
              onOpen={() => setMobileFiltersOpen(true)}
            />
          </div>
        </div>

        <PropertyCatalogMobileDrawer
          catalog={catalog}
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
        />

        <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
          {isLoading && (
            <p className="text-sm text-muted-foreground">განცხადებები იტვირთება…</p>
          )}

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          {!isLoading && !error && total === 0 && (
            <p className="text-sm text-muted-foreground">
              {isArchiveScope
                ? ARCHIVE_COPY.emptyProperties
                : "განცხადებები ვერ მოიძებნა."}
            </p>
          )}

          {!isLoading && !error && total > 0 && (
            <>
              <p className="mb-3 text-xs text-muted-foreground">
                ნაჩვენებია{" "}
                <span className="font-medium text-foreground">{properties.length}</span>
                {" / "}
                <span className="font-medium text-foreground">{total}</span>
              </p>
              <div className="mt-2 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-5 lg:gap-6">
                {properties.map((property) => (
                  <PropertyListingCard
                    key={property.id}
                    property={property}
                    apiBaseUrl={apiBaseUrl}
                    onView={handleViewProperty}
                    canChangeStatus={canChangeListingStatus(property)}
                    canSetReminders={canSetListingReminders}
                    onListingChanged={() => void refetch()}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {!isLoading && !error && total > 0 && (
          <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              გვერდი {page} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                წინა
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                შემდეგი
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
