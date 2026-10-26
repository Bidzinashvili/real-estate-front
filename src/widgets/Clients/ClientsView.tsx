"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClientsList } from "@/features/clients/useClientsList";
import { useClientsListFilters } from "@/features/clients/useClientsListFilters";
import { useEffectiveAccessViewer } from "@/features/adminMode/useEffectiveAccessViewer";
import { useCurrentUser } from "@/shared/hooks";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import { appendArchiveNavigationSource } from "@/features/lifecycle/archiveNavigation";
import { rememberRecordListReturn } from "@/features/lifecycle/recordListNavigation";
import type { Client } from "@/features/clients/types";
import { ReminderPickerModal } from "@/widgets/Reminders/ReminderPickerModal";
import { EmptyState, ErrorState } from "@/shared/ui/PageState";
import { PageHeader } from "@/shared/ui/PageHeader";
import { FilterPanel } from "@/shared/ui/FilterPanel";
import { ListResultsBar } from "@/shared/ui/ListResultsBar";
import { ListingGridSkeleton } from "@/shared/ui/Skeleton";
import { Button, buttonVariants } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import { ChevronDown, ListFilter, Plus, Users } from "lucide-react";
import type { ClientSortBy, ClientSortOrder } from "@/features/clients/getClientsQuery";
import {
  buildBudgetFilterParam,
  buildDistrictFilterParam,
  buildStatusFilterParam,
} from "@/features/clients/getClientsQuery";
import { resolveCreatedDateQuery, resolveLastOpenedDateQuery } from "@/features/databaseList/createdDateRange";
import {
  viewerCanManageRecord,
  viewerCanViewClientDetail,
} from "@/features/databaseList/viewerOwnership";
import { OnlyMineToggle } from "@/widgets/DatabaseList/OnlyMineToggle";
import { AdminModeToggle } from "@/widgets/AdminMode/AdminModeToggle";
import { ActiveNotesCount } from "@/widgets/DatabaseList/ActiveNotesCount";
import { ClientListCard } from "@/widgets/Clients/ClientListCard";
import { DatabaseListSearchRow } from "@/widgets/DatabaseList/DatabaseListSearchRow";
import { AdvancedSearchSheet } from "@/widgets/DatabaseList/AdvancedSearchSheet";
import { ClientsListActiveFilterChips } from "@/widgets/Clients/ClientsListActiveFilterChips";
import {
  ClientsListFilterFields,
  ClientsListSortFields,
} from "@/widgets/Clients/ClientsListFilterFields";
import { CLIENT_LIST_DEFAULT_LIMIT } from "@/features/clients/clientListUrlParams";
import { NOTE_LAST_OPENED_COPY } from "@/features/noteLastOpened/noteLastOpenedCopy";

const SORT_OPTIONS: { value: ClientSortBy; label: string }[] = [
  { value: "createdAt", label: "ატვირთვის თარიღი" },
  { value: "updatedAt", label: "განახლების თარიღი" },
  { value: "name", label: "სახელი" },
  { value: "noteLastOpenedAt", label: NOTE_LAST_OPENED_COPY.sortBy },
];

const ORDER_OPTIONS: { value: ClientSortOrder; label: string }[] = [
  { value: "desc", label: "კლებადი" },
  { value: "asc", label: "ზრდადი" },
];

const LAST_OPENED_ORDER_OPTIONS: { value: ClientSortOrder; label: string }[] = [
  { value: "desc", label: NOTE_LAST_OPENED_COPY.sortDesc },
  { value: "asc", label: NOTE_LAST_OPENED_COPY.sortAsc },
];

type ClientsViewProps = {
  listingScope?: "current" | "archived";
};

export function ClientsView({ listingScope = "current" }: ClientsViewProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const accessViewer = useEffectiveAccessViewer();
  const isArchiveScope = listingScope === "archived";
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false);
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);
  const [reminderClientId, setReminderClientId] = useState<string | null>(null);
  const filtersDropdownRef = useRef<HTMLDivElement>(null);

  const filters = useClientsListFilters({
    syncUrl: true,
  });
  const {
    state,
    debouncedState,
    setSearchInput,
    setSelectedColors,
    setDistrict,
    setBudgetMinInput,
    setBudgetMaxInput,
    setDealType,
    setStatus,
    setCreatedDateRange,
    setLastOpenedDateRange,
    setNeverOpened,
    setSortBy,
    setOrder,
    setPage,
    toggleOnlyMine,
    resetPanelFilters,
    resetFilters,
    panelFilterCount,
    hasClearableFilters,
    hasClearablePanelFilters,
  } = filters;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const syncLayout = () => setIsDesktopLayout(mediaQuery.matches);
    syncLayout();
    mediaQuery.addEventListener("change", syncLayout);
    return () => mediaQuery.removeEventListener("change", syncLayout);
  }, []);

  useEffect(() => {
    if (!filtersPanelOpen || !isDesktopLayout) {
      return;
    }
    function handlePointerDown(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (filtersDropdownRef.current?.contains(target)) {
        return;
      }
      setFiltersPanelOpen(false);
    }
    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [filtersPanelOpen, isDesktopLayout]);

  const createdDates = resolveCreatedDateQuery(state.createdFrom, state.createdTo);
  const lastOpenedDates = resolveLastOpenedDateQuery(
    state.lastOpenedFrom,
    state.lastOpenedTo,
  );

  const { clients, total, activeCount, isLoading, error, refetch } =
    useClientsList({
      search: debouncedState.searchInput.trim() || undefined,
      color: state.selectedColors.length > 0 ? state.selectedColors : undefined,
      district: buildDistrictFilterParam(debouncedState.district),
      budgetMin: buildBudgetFilterParam(debouncedState.budgetMinInput),
      budgetMax: buildBudgetFilterParam(debouncedState.budgetMaxInput),
      dealType: state.dealType || undefined,
      status: buildStatusFilterParam(state.status),
      createdFrom: createdDates.createdFrom,
      createdTo: createdDates.createdTo,
      lastOpenedFrom: state.neverOpened ? undefined : lastOpenedDates.lastOpenedFrom,
      lastOpenedTo: state.neverOpened ? undefined : lastOpenedDates.lastOpenedTo,
      neverOpened: state.neverOpened ? true : undefined,
      sortBy: state.sortBy,
      order: state.order,
      page: state.page,
      limit: CLIENT_LIST_DEFAULT_LIMIT,
      archived: isArchiveScope ? true : undefined,
      scope: state.listScope,
    });

  const isMineScope = state.listScope === "MINE";
  const activeNotesLabel = isMineScope
    ? "ჩემი აქტიური კლიენტები"
    : "აქტიური კლიენტები";
  const totalPages = Math.max(1, Math.ceil(total / CLIENT_LIST_DEFAULT_LIMIT));
  const showInitialLoading = isLoading && clients.length === 0 && !error;
  const showResults = !error && clients.length > 0;
  const showEmpty = !isLoading && !error && clients.length === 0;

  const handleSortChange = (value: string) => {
    setSortBy(value as ClientSortBy);
  };

  const handleOrderChange = (value: string) => {
    setOrder(value as ClientSortOrder);
  };

  const filterFieldsProps = {
    dealType: state.dealType,
    district: state.district,
    budgetMinInput: state.budgetMinInput,
    budgetMaxInput: state.budgetMaxInput,
    createdFrom: state.createdFrom,
    createdTo: state.createdTo,
    status: state.status,
    lastOpenedFrom: state.lastOpenedFrom,
    lastOpenedTo: state.lastOpenedTo,
    neverOpened: state.neverOpened,
    onDealTypeChange: setDealType,
    onDistrictChange: setDistrict,
    onBudgetMinChange: setBudgetMinInput,
    onBudgetMaxChange: setBudgetMaxInput,
    onCreatedDateRangeChange: setCreatedDateRange,
    onStatusChange: setStatus,
    onLastOpenedDateRangeChange: setLastOpenedDateRange,
    onNeverOpenedChange: setNeverOpened,
  };

  const activeFilterChipsProps = {
    state,
    onDealTypeChange: setDealType,
    onDistrictChange: setDistrict,
    onBudgetMinChange: setBudgetMinInput,
    onBudgetMaxChange: setBudgetMaxInput,
    onCreatedDateRangeChange: setCreatedDateRange,
    onStatusChange: setStatus,
    onLastOpenedDateRangeChange: setLastOpenedDateRange,
    onNeverOpenedChange: setNeverOpened,
    onClearAll: resetPanelFilters,
    hasClearablePanelFilters,
  };

  const filtersToggleLabel =
    panelFilterCount > 0 ? `ფილტრები (${panelFilterCount})` : "ფილტრები";

  function canManageClient(client: Client): boolean {
    return viewerCanManageRecord(client, accessViewer);
  }

  function canOpenClientDetail(client: Client): boolean {
    return viewerCanViewClientDetail(client, accessViewer);
  }

  return (
    <>
      {isArchiveScope ? (
        <PageHeader
          title="არქივი — კლიენტები"
          description="დაარქივებული კლიენტები და ლიდები."
          icon={Users}
          meta={
            <ActiveNotesCount
              label={activeNotesLabel}
              count={activeCount}
              isMine={isMineScope}
            />
          }
        />
      ) : (
        <PageHeader
          title="კლიენტები და ლიდები"
          description="მართეთ კლიენტები, თვალი ადევნეთ გარიგებებს და განაგრძეთ კომუნიკაცია."
          icon={Users}
          meta={
            <ActiveNotesCount
              label={activeNotesLabel}
              count={activeCount}
              isMine={isMineScope}
            />
          }
          actions={
            <>
              <Link
                href="/clients/invite-links"
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
              >
                მოწვევის ბმულები
              </Link>
              <Button type="button" size="sm" onClick={() => router.push("/clients/new")}>
                <Plus className="h-4 w-4" aria-hidden />
                ახალი კლიენტი
              </Button>
            </>
          }
        />
      )}

      <FilterPanel className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          {!isArchiveScope ? (
            <ActiveNotesCount
              label={activeNotesLabel}
              count={activeCount}
              isMine={isMineScope}
            />
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <OnlyMineToggle isActive={isMineScope} onToggle={toggleOnlyMine} />
            <AdminModeToggle />
          </div>
          <ClientsListSortFields
            sortBy={state.sortBy}
            order={state.order}
            onSortByChange={handleSortChange}
            onOrderChange={handleOrderChange}
            sortOptions={SORT_OPTIONS}
            orderOptions={
              state.sortBy === "noteLastOpenedAt"
                ? LAST_OPENED_ORDER_OPTIONS
                : ORDER_OPTIONS
            }
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1">
            <DatabaseListSearchRow
              searchValue={state.searchInput}
              onSearchChange={setSearchInput}
              searchPlaceholder="მოძებნე კლიენტები..."
              searchClearAriaLabel="ძიების გასუფთავება"
              selectedColors={state.selectedColors}
              onSelectedColorsChange={setSelectedColors}
            />
          </div>
          <div ref={filtersDropdownRef} className="relative shrink-0">
            <button
              type="button"
              aria-expanded={filtersPanelOpen}
              aria-haspopup="dialog"
              onClick={() => setFiltersPanelOpen((previous) => !previous)}
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted sm:w-auto",
                filtersPanelOpen && isDesktopLayout ? "border-primary/40 bg-muted/60" : "",
              )}
            >
              <ListFilter className="h-4 w-4 text-muted-foreground" aria-hidden />
              {filtersToggleLabel}
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition",
                  filtersPanelOpen ? "rotate-180" : "",
                )}
                aria-hidden
              />
            </button>
            {filtersPanelOpen && isDesktopLayout ? (
              <div
                className="absolute right-0 z-20 mt-2 w-[min(100vw-2rem,28rem)] rounded-xl border border-border bg-card p-4 shadow-lg ring-1 ring-border"
                role="dialog"
                aria-label="კლიენტების ფილტრები"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">ფილტრები</p>
                  {hasClearablePanelFilters ? (
                    <button
                      type="button"
                      onClick={() => resetPanelFilters()}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      გასუფთავება
                    </button>
                  ) : null}
                </div>
                <ClientsListFilterFields {...filterFieldsProps} />
              </div>
            ) : null}
          </div>
        </div>

        <ClientsListActiveFilterChips {...activeFilterChipsProps} />
      </FilterPanel>

      <AdvancedSearchSheet
        open={filtersPanelOpen && !isDesktopLayout}
        title="ფილტრები"
        appliedCount={panelFilterCount}
        onClose={() => setFiltersPanelOpen(false)}
        onClear={resetPanelFilters}
        footer={
          <button
            type="button"
            onClick={() => setFiltersPanelOpen(false)}
            className="w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
          >
            შედეგების ჩვენება
          </button>
        }
      >
        <ClientsListFilterFields {...filterFieldsProps} />
      </AdvancedSearchSheet>

      <div className="space-y-3">
        {(showResults || showInitialLoading) && !error ? (
          <ListResultsBar
            prefix={isArchiveScope ? "არქივში ნაპოვნია:" : "ნაპოვნია:"}
            total={total}
            isLoading={isLoading && clients.length > 0}
          />
        ) : null}

        {error ? (
          <ErrorState title="ჩატვირთვა ვერ მოხერხდა" description={error} />
        ) : null}

        {showInitialLoading ? <ListingGridSkeleton count={6} /> : null}

        {showEmpty ? (
          <EmptyState
            title={
              isArchiveScope ? ARCHIVE_COPY.emptyClients : "შედეგები ვერ მოიძებნა"
            }
            description={
              hasClearableFilters
                ? "სცადეთ ფილტრების შეცვლა ან გასუფთავება."
                : undefined
            }
            icon={Users}
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
                onClick={() => router.push("/clients/new")}
              >
                <Plus className="h-4 w-4" aria-hidden />
                ახალი კლიენტი
              </Button>
            ) : null}
          </EmptyState>
        ) : null}

        {showResults ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-5 xl:grid-cols-3 xl:gap-6">
            {clients.map((client) => (
              <ClientListCard
                key={client.id}
                client={client}
                isArchiveScope={isArchiveScope}
                canManage={canManageClient(client)}
                canOpenDetail={canOpenClientDetail(client)}
                currentUser={accessViewer}
                onOpenDetail={(clientId) => {
                  rememberRecordListReturn();
                  const detailHref = `/clients/${clientId}`;
                  router.push(
                    isArchiveScope
                      ? appendArchiveNavigationSource(detailHref)
                      : detailHref,
                  );
                }}
                onOpenReminder={setReminderClientId}
                onChanged={refetch}
              />
            ))}
          </div>
        ) : null}
      </div>

      {!error && total > 0 && (
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            გვერდი {state.page} / {totalPages} • სულ {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={state.page === 1}
              onClick={() => setPage(Math.max(1, state.page - 1))}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              წინა
            </button>
            <button
              type="button"
              disabled={state.page === totalPages}
              onClick={() => setPage(Math.min(totalPages, state.page + 1))}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              შემდეგი
            </button>
          </div>
        </div>
      )}
      {reminderClientId ? (
        <ReminderPickerModal
          mode="create"
          open
          target={{ targetType: "CLIENT", clientId: reminderClientId }}
          onClose={() => setReminderClientId(null)}
          onSaved={refetch}
        />
      ) : null}
    </>
  );
}
