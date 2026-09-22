"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClientsList } from "@/features/clients/useClientsList";
import { useClientsListFilters } from "@/features/clients/useClientsListFilters";
import { useCurrentUser } from "@/shared/hooks";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import type { Client } from "@/features/clients/types";
import { ReminderPickerModal } from "@/widgets/Reminders/ReminderPickerModal";
import { OptionChips } from "@/shared/ui/OptionChips";
import {
  DEAL_TYPES,
  CLIENT_STATUSES,
  DEAL_TYPE_LABELS,
  CLIENT_STATUS_LABELS,
} from "@/features/clients/clientEnums";
import type { ClientSortBy, ClientSortOrder } from "@/features/clients/getClientsQuery";
import {
  buildBudgetFilterParam,
  buildDistrictFilterParam,
  buildStatusFilterParam,
} from "@/features/clients/getClientsQuery";
import type { DealType, ClientStatus } from "@/features/clients/clientEnums";
import { resolveCreatedDateQuery, resolveLastOpenedDateQuery } from "@/features/databaseList/createdDateRange";
import {
  viewerCanManageRecord,
  viewerOwnsRecord,
} from "@/features/databaseList/viewerOwnership";
import { OnlyMineToggle } from "@/widgets/DatabaseList/OnlyMineToggle";
import { AdminModeToggle } from "@/widgets/AdminMode/AdminModeToggle";
import { ActiveNotesCount } from "@/widgets/DatabaseList/ActiveNotesCount";
import { ClientListCard } from "@/widgets/Clients/ClientListCard";
import { DatabaseListSearchRow } from "@/widgets/DatabaseList/DatabaseListSearchRow";
import { CreatedAtDateRangeFilter } from "@/widgets/DatabaseList/CreatedAtDateRangeFilter";
import { AdvancedSearchButton } from "@/widgets/DatabaseList/AdvancedSearchButton";
import { AdvancedSearchSheet } from "@/widgets/DatabaseList/AdvancedSearchSheet";
import { NeverOpenedFilter } from "@/widgets/DatabaseList/NeverOpenedFilter";
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

const DEAL_TYPE_OPTIONS = [
  { value: "", label: "ყველა გარიგება" },
  ...DEAL_TYPES.map((dealType) => ({
    value: dealType,
    label: DEAL_TYPE_LABELS[dealType],
  })),
];

const STATUS_OPTIONS = [
  { value: "", label: "ყველა სტატუსი" },
  ...CLIENT_STATUSES.map((clientStatus) => ({
    value: clientStatus,
    label: CLIENT_STATUS_LABELS[clientStatus],
  })),
];

type ClientsViewProps = {
  listingScope?: "current" | "archived";
};

export function ClientsView({ listingScope = "current" }: ClientsViewProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const isArchiveScope = listingScope === "archived";
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [reminderClientId, setReminderClientId] = useState<string | null>(null);

  const filters = useClientsListFilters({
    syncUrl: !isArchiveScope,
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
    resetAdvancedFilters,
    resetFilters,
    advancedFilterCount,
    hasClearableFilters,
  } = filters;

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

  const handleDealTypeChange = (value: string) => {
    setDealType(value as DealType | "");
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as ClientStatus | "");
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as ClientSortBy);
  };

  const handleOrderChange = (value: string) => {
    setOrder(value as ClientSortOrder);
  };

  function canManageClient(client: Client): boolean {
    return viewerCanManageRecord(client, user);
  }

  function canOpenClientDetail(client: Client): boolean {
    if (!user) {
      return false;
    }
    if (user.role === "ADMIN") {
      return true;
    }
    return viewerOwnsRecord(client, user);
  }

  return (
    <>
      {isArchiveScope ? null : (
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            კლიენტები და ლიდები
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            მართეთ კლიენტები, თვალი ადევნეთ გარიგებებს და განაგრძეთ კომუნიკაცია.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Link
            href="/clients/invite-links"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            მოწვევის ბმულები
          </Link>
          <button
            type="button"
            onClick={() => router.push("/clients/new")}
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-primary/90"
          >
            კლიენტის დამატება
          </button>
        </div>
      </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <ActiveNotesCount
          label={activeNotesLabel}
          count={activeCount}
          isMine={isMineScope}
        />
        <OnlyMineToggle isActive={isMineScope} onToggle={toggleOnlyMine} />
        <AdminModeToggle />
        <div className="flex w-full flex-col gap-2 sm:ml-auto sm:w-auto">
          <OptionChips
            label="სორტირება"
            aria-label="კლიენტების სორტირება"
            value={state.sortBy}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
            size="compact"
          />
          <OptionChips
            label="მიმართულება"
            aria-label="სორტირების მიმართულება"
            value={state.order}
            onChange={handleOrderChange}
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
        searchPlaceholder="მოძებნე სახელით, ID-ით, ნომრით ან სხვა მონაცემით..."
        searchClearAriaLabel="ძიების გასუფთავება"
        selectedColors={state.selectedColors}
        onSelectedColorsChange={setSelectedColors}
      />

      <div className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        <OptionChips
          label="გარიგების ტიპი"
          aria-label="გარიგების ტიპით გაფილტვრა"
          value={state.dealType}
          onChange={handleDealTypeChange}
          options={DEAL_TYPE_OPTIONS}
          size="compact"
        />
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={state.district}
            onChange={(event) => setDistrict(event.target.value)}
            placeholder="უბანი…"
            className="h-8 w-36 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <input
            type="number"
            value={state.budgetMinInput}
            onChange={(event) => setBudgetMinInput(event.target.value)}
            placeholder="მინ. ბიუჯეტი"
            className="h-8 w-32 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <input
            type="number"
            value={state.budgetMaxInput}
            onChange={(event) => setBudgetMaxInput(event.target.value)}
            placeholder="მაქს. ბიუჯეტი"
            className="h-8 w-32 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <AdvancedSearchButton
            appliedCount={advancedFilterCount}
            onOpen={() => setAdvancedSearchOpen(true)}
          />
          {hasClearableFilters ? (
            <button
              type="button"
              onClick={() => resetFilters()}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              ყველაფრის გასუფთავება
            </button>
          ) : null}
        </div>
        <CreatedAtDateRangeFilter
          createdFrom={state.createdFrom}
          createdTo={state.createdTo}
          onChange={setCreatedDateRange}
          compact
        />
      </div>

      <AdvancedSearchSheet
        open={advancedSearchOpen}
        title="გაფართოებული ძებნა"
        appliedCount={advancedFilterCount}
        onClose={() => setAdvancedSearchOpen(false)}
        onClear={resetAdvancedFilters}
        footer={
          <button
            type="button"
            onClick={() => setAdvancedSearchOpen(false)}
            className="w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
          >
            შედეგების ჩვენება
          </button>
        }
      >
        <div className="space-y-3">
          <OptionChips
            label="სტატუსი"
            aria-label="სტატუსით გაფილტვრა"
            value={state.status}
            onChange={handleStatusChange}
            options={STATUS_OPTIONS}
          />
          <CreatedAtDateRangeFilter
            createdFrom={state.lastOpenedFrom}
            createdTo={state.lastOpenedTo}
            disabled={state.neverOpened}
            label={NOTE_LAST_OPENED_COPY.filterLabel}
            fromAriaLabel={NOTE_LAST_OPENED_COPY.filterFromAria}
            toAriaLabel={NOTE_LAST_OPENED_COPY.filterToAria}
            onChange={({ createdFrom, createdTo }) =>
              setLastOpenedDateRange({
                lastOpenedFrom: createdFrom,
                lastOpenedTo: createdTo,
              })
            }
          />
          <NeverOpenedFilter
            checked={state.neverOpened}
            onChange={setNeverOpened}
          />
        </div>
      </AdvancedSearchSheet>

      <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        {showInitialLoading && (
          <p className="text-sm text-muted-foreground">კლიენტები იტვირთება…</p>
        )}

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {showEmpty && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {isArchiveScope ? ARCHIVE_COPY.emptyClients : "შედეგები ვერ მოიძებნა"}
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
              {clients.map((client) => (
                <ClientListCard
                  key={client.id}
                  client={client}
                  isArchiveScope={isArchiveScope}
                  canManage={canManageClient(client)}
                  canOpenDetail={canOpenClientDetail(client)}
                  currentUser={user}
                  onOpenDetail={(clientId) => router.push(`/clients/${clientId}`)}
                  onOpenReminder={setReminderClientId}
                  onChanged={refetch}
                />
              ))}
            </div>
          </>
        )}
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
