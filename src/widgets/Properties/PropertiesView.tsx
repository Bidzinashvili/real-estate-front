"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePropertiesCatalog } from "@/features/properties/usePropertiesCatalog";
import { getApiBaseUrl } from "@/shared/lib/auth";
import { useCurrentUser } from "@/shared/hooks";
import { PropertyCatalogAdvancedSearch } from "@/widgets/Properties/propertyCatalogFilters";
import { PropertyCatalogBasicFilters } from "@/widgets/Properties/propertyCatalogBasicFilters";
import { PropertyCatalogScopeToggle } from "@/widgets/Properties/PropertyCatalogScopeToggle";
import { prefetchGelToUsdForAmounts } from "@/features/currency/gelToUsdConvertCache";
import type { Property } from "@/features/properties/types";
import { PropertyListingCard } from "@/widgets/Properties/PropertyListingCard";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import { canManageProperty } from "@/features/properties/listingVisibility";
import { ActiveNotesCount } from "@/widgets/DatabaseList/ActiveNotesCount";
import { DatabaseListSearchInput } from "@/widgets/DatabaseList/DatabaseListSearchInput";
import { InlineSelect } from "@/shared/ui/InlineSelect";
import {
  isPropertyListSortOrder,
  isPropertySortBy,
} from "@/features/properties/getPropertiesQuery";

const SORT_OPTIONS = [
  { value: "createdAt", label: "ატვირთვის თარიღი" },
  { value: "pricePublic", label: "ფასი" },
] as const;

const ORDER_OPTIONS = [
  { value: "desc", label: "კლებადობით" },
  { value: "asc", label: "ზრდადობით" },
] as const;

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
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const isLoggedIn = user !== null;

  const {
    properties,
    total,
    page,
    totalPages,
    activeCount,
    isLoading,
    error,
    state,
    setSearchInput,
    setPage,
    refetch,
    hasClearableFilters,
    resetFilters,
  } = catalog;

  const isMineScope = state.listScope === "MINE";
  const activeNotesLabel = isMineScope
    ? "ჩემი აქტიური განცხადებები"
    : "აქტიური განცხადებები";
  const showInitialLoading = isLoading && properties.length === 0 && !error;
  const showResults = !error && properties.length > 0;
  const showEmpty = !isLoading && !error && total === 0;

  const handleViewProperty = useCallback(
    (propertyId: string) => {
      router.push(`/properties/${propertyId}`);
    },
    [router],
  );

  const canChangeListingStatus = useCallback(
    (listing: Property) => canManageProperty(user, listing),
    [user],
  );

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
    <div className="relative flex flex-col gap-4">
      <div className="space-y-3">
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
          <ActiveNotesCount
            label={activeNotesLabel}
            count={activeCount}
            isMine={isMineScope}
          />
          <PropertyCatalogScopeToggle
            catalog={catalog}
            isLoggedIn={isLoggedIn}
            isAuthLoading={isAuthLoading}
          />
          <div className="ml-auto flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground shadow-sm">
            <span className="hidden font-medium sm:inline">სორტირება</span>
            <InlineSelect
              aria-label="სორტირება"
              value={state.sortBy}
              onChange={(selectedValue) => {
                if (isPropertySortBy(selectedValue)) catalog.setSortBy(selectedValue);
              }}
              options={SORT_OPTIONS}
            />
            <span className="h-4 w-px bg-border" />
            <InlineSelect
              aria-label="მიმართულება"
              value={state.order}
              onChange={(selectedValue) => {
                if (isPropertyListSortOrder(selectedValue)) catalog.setOrder(selectedValue);
              }}
              options={ORDER_OPTIONS}
            />
          </div>
        </div>

        <DatabaseListSearchInput
          value={state.searchInput}
          onChange={setSearchInput}
          placeholder="მოძებნე მისამართით, ID-ით, ნომრით ან სხვა მონაცემით..."
          clearAriaLabel="ძიების გასუფთავება"
        />

        <PropertyCatalogBasicFilters
          catalog={catalog}
          onOpenAdvanced={() => setAdvancedSearchOpen(true)}
        />
      </div>

      <PropertyCatalogAdvancedSearch
        catalog={catalog}
        open={advancedSearchOpen}
        onClose={() => setAdvancedSearchOpen(false)}
      />

      <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        {showInitialLoading && (
          <p className="text-sm text-muted-foreground">განცხადებები იტვირთება…</p>
        )}

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {showEmpty && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {isArchiveScope
                ? ARCHIVE_COPY.emptyProperties
                : "შედეგები ვერ მოიძებნა"}
            </p>
            {hasClearableFilters ? (
              <button
                type="button"
                onClick={() => resetFilters()}
                className="text-sm font-medium text-primary hover:underline"
              >
                ფილტრების გასუფთავება
              </button>
            ) : null}
          </div>
        )}

        {showResults && (
          <>
            <p className="mb-3 text-xs text-muted-foreground">
              {isArchiveScope ? "არქივში ნაპოვნია: " : "ნაპოვნია: "}
              <span className="font-medium text-foreground">{total}</span>
              {isLoading ? (
                <span className="ml-2 text-muted-foreground">ახლდება…</span>
              ) : null}
            </p>
            <div className="mt-2 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-5 xl:grid-cols-3 xl:gap-6">
              {properties.map((property) => (
                <PropertyListingCard
                  key={property.id}
                  property={property}
                  apiBaseUrl={apiBaseUrl}
                  onView={handleViewProperty}
                  canChangeStatus={canChangeListingStatus(property)}
                  canSetReminders={canChangeListingStatus(property)}
                  onListingChanged={() => void refetch()}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {!error && total > 0 && (
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
  );
}
