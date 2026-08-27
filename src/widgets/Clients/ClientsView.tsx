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
import { InlineSelect } from "@/shared/ui/InlineSelect";
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
import { resolveCreatedDateQuery } from "@/features/databaseList/createdDateRange";
import {
  viewerCanManageRecord,
  viewerOwnsRecord,
} from "@/features/databaseList/viewerOwnership";
import { OnlyMineToggle } from "@/widgets/DatabaseList/OnlyMineToggle";
import { ActiveNotesCount } from "@/widgets/DatabaseList/ActiveNotesCount";
import { ClientListCard } from "@/widgets/Clients/ClientListCard";
import { DatabaseListSearchInput } from "@/widgets/DatabaseList/DatabaseListSearchInput";
import { CreatedAtDateRangeFilter } from "@/widgets/DatabaseList/CreatedAtDateRangeFilter";
import { AdvancedSearchButton } from "@/widgets/DatabaseList/AdvancedSearchButton";
import { AdvancedSearchSheet } from "@/widgets/DatabaseList/AdvancedSearchSheet";
import { CLIENT_LIST_DEFAULT_LIMIT } from "@/features/clients/clientListUrlParams";
import { NativeSelectSurface } from "@/shared/ui/NativeSelectSurface";

const SORT_OPTIONS: { value: ClientSortBy; label: string }[] = [
  { value: "createdAt", label: "ატვირთვის თარიღი" },
  { value: "updatedAt", label: "განახლების თარიღი" },
  { value: "name", label: "სახელი" },
];

const ORDER_OPTIONS: { value: ClientSortOrder; label: string }[] = [
  { value: "desc", label: "კლებადი" },
  { value: "asc", label: "ზრდადი" },
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
    setDistrict,
    setBudgetMinInput,
    setBudgetMaxInput,
    setDealType,
    setStatus,
    setCreatedDateRange,
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

  const { clients, total, activeCount, isLoading, error, refetch } =
    useClientsList({
      search: debouncedState.searchInput.trim() || undefined,
      district: buildDistrictFilterParam(debouncedState.district),
      budgetMin: buildBudgetFilterParam(debouncedState.budgetMinInput),
      budgetMax: buildBudgetFilterParam(debouncedState.budgetMaxInput),
      dealType: state.dealType || undefined,
      status: buildStatusFilterParam(state.status),
      createdFrom: createdDates.createdFrom,
      createdTo: createdDates.createdTo,
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
        <div className="ml-auto flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground shadow-sm">
          <span className="hidden font-medium sm:inline">სორტირება</span>
          <InlineSelect
            aria-label="კლიენტების სორტირება"
            value={state.sortBy}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
          />
          <span className="h-4 w-px bg-border" />
          <InlineSelect
            aria-label="სორტირების მიმართულება"
            value={state.order}
            onChange={handleOrderChange}
            options={ORDER_OPTIONS}
          />
        </div>
      </div>

      <DatabaseListSearchInput
        value={state.searchInput}
        onChange={setSearchInput}
        placeholder="მოძებნე სახელით, ID-ით, ნომრით ან სხვა მონაცემით..."
        clearAriaLabel="ძიების გასუფთავება"
      />

      <div className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground shadow-sm">
            <InlineSelect
              aria-label="გარიგების ტიპით გაფილტვრა"
              value={state.dealType}
              onChange={handleDealTypeChange}
              options={DEAL_TYPE_OPTIONS}
            />
          </div>
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
          <span className="block text-xs font-medium text-muted-foreground">
            სტატუსი
          </span>
          <NativeSelectSurface>
            <select
              aria-label="სტატუსით გაფილტვრა"
              value={state.status}
              onChange={(event) => handleStatusChange(event.target.value)}
              className="w-full appearance-none rounded-lg border border-border bg-card py-2 pl-3 pr-10 text-sm text-foreground shadow-sm outline-none focus:border-primary"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </NativeSelectSurface>
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
