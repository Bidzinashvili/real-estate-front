"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePropertiesCatalog } from "@/features/properties/usePropertiesCatalog";
import { getApiBaseUrl } from "@/shared/lib/auth";
import { useEffectiveAccessViewer } from "@/features/adminMode/useEffectiveAccessViewer";
import { useCurrentUser } from "@/shared/hooks";
import { PropertyCatalogAdvancedSearch } from "@/widgets/Properties/propertyCatalogFilters";
import { PropertyCatalogBasicFilters } from "@/widgets/Properties/propertyCatalogBasicFilters";
import { PropertyCatalogScopeToggle } from "@/widgets/Properties/PropertyCatalogScopeToggle";
import { AdminModeToggle } from "@/widgets/AdminMode/AdminModeToggle";
import { prefetchGelToUsdForAmounts } from "@/features/currency/gelToUsdConvertCache";
import type { Property } from "@/features/properties/types";
import { PropertyListingCard } from "@/widgets/Properties/PropertyListingCard";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import { appendArchiveNavigationSource } from "@/features/lifecycle/archiveNavigation";
import { rememberRecordListReturn } from "@/features/lifecycle/recordListNavigation";
import { canManageProperty } from "@/features/properties/listingVisibility";
import { ActiveNotesCount } from "@/widgets/DatabaseList/ActiveNotesCount";
import { DatabaseListSearchRow } from "@/widgets/DatabaseList/DatabaseListSearchRow";
import { OptionChips } from "@/shared/ui/OptionChips";
import { EmptyState, ErrorState } from "@/shared/ui/PageState";
import { PageHeader } from "@/shared/ui/PageHeader";
import { FilterPanel } from "@/shared/ui/FilterPanel";
import { ListResultsBar } from "@/shared/ui/ListResultsBar";
import { ListingGridSkeleton } from "@/shared/ui/Skeleton";
import { Button } from "@/shared/ui/Button";
import { LayoutGrid, Plus } from "lucide-react";
import { NOTE_LAST_OPENED_COPY } from "@/features/noteLastOpened/noteLastOpenedCopy";
import {
  isPropertyListSortOrder,
  isPropertySortBy,
} from "@/features/properties/getPropertiesQuery";

const SORT_OPTIONS = [
  { value: "createdAt", label: "ატვირთვის თარიღი" },
  { value: "pricePublic", label: "ფასი" },
  { value: "noteLastOpenedAt", label: NOTE_LAST_OPENED_COPY.sortBy },
] as const;

const ORDER_OPTIONS = [
  { value: "desc", label: "კლებადობით" },
  { value: "asc", label: "ზრდადობით" },
] as const;

const LAST_OPENED_ORDER_OPTIONS = [
  { value: "desc", label: NOTE_LAST_OPENED_COPY.sortDesc },
  { value: "asc", label: NOTE_LAST_OPENED_COPY.sortAsc },
] as const;

type PropertiesViewProps = {
  listingScope?: "current" | "archived";
};

export function PropertiesView({ listingScope = "current" }: PropertiesViewProps) {
  const router = useRouter();
  const apiBaseUrl = getApiBaseUrl();
  const { user, isLoading: isAuthLoading } = useCurrentUser();
  const accessViewer = useEffectiveAccessViewer();
  const isArchiveScope = listingScope === "archived";
  const catalog = usePropertiesCatalog({
    syncUrl: true,
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
    setSelectedColors,
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
      rememberRecordListReturn();
      const detailHref = `/properties/${propertyId}`;
      router.push(
        isArchiveScope ? appendArchiveNavigationSource(detailHref) : detailHref,
      );
    },
    [isArchiveScope, router],
  );

  const canChangeListingStatus = useCallback(
    (listing: Property) => canManageProperty(accessViewer, listing),
    [accessViewer],
  );

  const catalogPrefetchKey = useMemo(
    () =>
      properties.map((property) => `${property.id}:${property.pricePublic}`).join("|"),
    [properties],
  );

  useEffect(() => {
    if (isLoading || error || properties.length === 0) return;
    const gelListingPrices = properties
      .filter((property) => property.currency === "GEL")
      .map((property) => property.pricePublic);
    void prefetchGelToUsdForAmounts(gelListingPrices);
  }, [catalogPrefetchKey, error, isLoading, properties]);

  return (
    <div className="relative flex flex-col gap-5">
      <PageHeader
        title={isArchiveScope ? "არქივი — განცხადებები" : "განცხადებები"}
        description={
          isArchiveScope
            ? "დაარქივებული განცხადებები. სტატუსი და დეტალები უცვლელი რჩება."
            : "განცხადებების კატალოგი, ფილტრები და სტატუსების მართვა."
        }
        icon={LayoutGrid}
        meta={
          <ActiveNotesCount
            label={activeNotesLabel}
            count={activeCount}
            isMine={isMineScope}
          />
        }
        actions={
          isArchiveScope ? null : (
            <Button type="button" onClick={() => router.push("/properties/new")}>
              <Plus className="h-4 w-4" aria-hidden />
              ახალი განცხადება
            </Button>
          )
        }
      />

      <FilterPanel>
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <PropertyCatalogScopeToggle
              catalog={catalog}
              isLoggedIn={isLoggedIn}
              isAuthLoading={isAuthLoading}
            />
            <AdminModeToggle />
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-4 lg:w-auto">
            <OptionChips
              label="სორტირება"
              aria-label="სორტირება"
              value={state.sortBy}
              onChange={(selectedValue) => {
                if (isPropertySortBy(selectedValue)) catalog.setSortBy(selectedValue);
              }}
              options={SORT_OPTIONS}
              size="compact"
            />
            <OptionChips
              label="მიმართულება"
              aria-label="მიმართულება"
              value={state.order}
              onChange={(selectedValue) => {
                if (isPropertyListSortOrder(selectedValue)) catalog.setOrder(selectedValue);
              }}
              options={
                state.sortBy === "noteLastOpenedAt"
                  ? LAST_OPENED_ORDER_OPTIONS
                  : ORDER_OPTIONS
              }
              size="compact"
            />
          </div>
        </div>

        <DatabaseListSearchRow
          searchValue={state.searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="მოძებნე მისამართით, ID-ით, ნომრით ან სხვა მონაცემით..."
          searchClearAriaLabel="ძიების გასუფთავება"
          selectedColors={state.selectedColors}
          onSelectedColorsChange={setSelectedColors}
        />

        <PropertyCatalogBasicFilters
          catalog={catalog}
          onOpenAdvanced={() => setAdvancedSearchOpen(true)}
        />
      </FilterPanel>

      <PropertyCatalogAdvancedSearch
        catalog={catalog}
        open={advancedSearchOpen}
        onClose={() => setAdvancedSearchOpen(false)}
      />

      <div className="space-y-3">
        {(showResults || showInitialLoading) && !error ? (
          <ListResultsBar
            prefix={isArchiveScope ? "არქივში ნაპოვნია:" : "ნაპოვნია:"}
            total={total}
            isLoading={isLoading && properties.length > 0}
          />
        ) : null}

        {error ? (
          <ErrorState title="ჩატვირთვა ვერ მოხერხდა" description={error} />
        ) : null}

        {showInitialLoading ? <ListingGridSkeleton count={6} /> : null}

        {showEmpty ? (
          <EmptyState
            title={
              isArchiveScope
                ? ARCHIVE_COPY.emptyProperties
                : "შედეგები ვერ მოიძებნა"
            }
            description={
              hasClearableFilters
                ? "სცადეთ ფილტრების შეცვლა ან გასუფთავება."
                : undefined
            }
            icon={LayoutGrid}
          >
            {hasClearableFilters ? (
              <Button
                type="button"
                variant="link"
                size="sm"
                className="mt-2"
                onClick={() => resetFilters()}
              >
                ფილტრების გასუფთავება
              </Button>
            ) : !isArchiveScope ? (
              <Button
                type="button"
                size="sm"
                className="mt-3"
                onClick={() => router.push("/properties/new")}
              >
                <Plus className="h-4 w-4" aria-hidden />
                ახალი განცხადება
              </Button>
            ) : null}
          </EmptyState>
        ) : null}

        {showResults ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-5 xl:grid-cols-3 xl:gap-6">
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
        ) : null}
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
