"use client";

import { OptionChips } from "@/shared/ui/OptionChips";
import { buildClientListDealTypeFilterOptions } from "@/features/clients/clientDealTypeDisplay";
import {
  type ClientStatus,
  type DealType,
} from "@/features/clients/clientEnums";
import {
  CLIENT_FILTER_STATUSES,
  formatClientStatusLabel,
} from "@/features/clients/clientStatusDisplay";
import type { ClientSortBy, ClientSortOrder } from "@/features/clients/getClientsQuery";
import { NeighborhoodChecklist } from "@/widgets/Districts/NeighborhoodChecklist";
import { CreatedAtDateRangeFilter } from "@/widgets/DatabaseList/CreatedAtDateRangeFilter";
import { NeverOpenedFilter } from "@/widgets/DatabaseList/NeverOpenedFilter";
import { NOTE_LAST_OPENED_COPY } from "@/features/noteLastOpened/noteLastOpenedCopy";

const STATUS_OPTIONS = [
  { value: "", label: "ყველა სტატუსი" },
  ...CLIENT_FILTER_STATUSES.map((clientStatus) => ({
    value: clientStatus,
    label: formatClientStatusLabel(clientStatus),
  })),
];

const DEAL_TYPE_FILTER_OPTIONS = buildClientListDealTypeFilterOptions();

export type ClientsListFilterFieldsProps = {
  dealType: DealType | "";
  district: string;
  budgetMinInput: string;
  budgetMaxInput: string;
  createdFrom: string;
  createdTo: string;
  status: ClientStatus | "";
  lastOpenedFrom: string;
  lastOpenedTo: string;
  neverOpened: boolean;
  onDealTypeChange: (value: DealType | "") => void;
  onDistrictChange: (value: string) => void;
  onBudgetMinChange: (value: string) => void;
  onBudgetMaxChange: (value: string) => void;
  onCreatedDateRangeChange: (value: { createdFrom: string; createdTo: string }) => void;
  onStatusChange: (value: ClientStatus | "") => void;
  onLastOpenedDateRangeChange: (value: {
    lastOpenedFrom: string;
    lastOpenedTo: string;
  }) => void;
  onNeverOpenedChange: (value: boolean) => void;
};

export function ClientsListFilterFields({
  dealType,
  district,
  budgetMinInput,
  budgetMaxInput,
  createdFrom,
  createdTo,
  status,
  lastOpenedFrom,
  lastOpenedTo,
  neverOpened,
  onDealTypeChange,
  onDistrictChange,
  onBudgetMinChange,
  onBudgetMaxChange,
  onCreatedDateRangeChange,
  onStatusChange,
  onLastOpenedDateRangeChange,
  onNeverOpenedChange,
}: ClientsListFilterFieldsProps) {
  return (
    <div className="space-y-4">
      <OptionChips
        label="გარიგების ტიპი"
        aria-label="გარიგების ტიპით გაფილტვრა"
        value={dealType}
        onChange={(value) => onDealTypeChange(value as DealType | "")}
        options={DEAL_TYPE_FILTER_OPTIONS}
        size="compact"
      />
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">უბანი</p>
        <NeighborhoodChecklist
          selectedNeighborhoods={district.trim() === "" ? [] : [district]}
          onChange={(nextNeighborhoods) => onDistrictChange(nextNeighborhoods[0] ?? "")}
          selectionMode="single"
          compact
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="number"
          value={budgetMinInput}
          onChange={(event) => onBudgetMinChange(event.target.value)}
          placeholder="მინ. ბიუჯეტი"
          className="h-9 w-full min-w-0 flex-1 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary sm:max-w-[9rem]"
        />
        <input
          type="number"
          value={budgetMaxInput}
          onChange={(event) => onBudgetMaxChange(event.target.value)}
          placeholder="მაქს. ბიუჯეტი"
          className="h-9 w-full min-w-0 flex-1 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary sm:max-w-[9rem]"
        />
      </div>
      <CreatedAtDateRangeFilter
        createdFrom={createdFrom}
        createdTo={createdTo}
        onChange={onCreatedDateRangeChange}
        compact
      />
      <div className="border-t border-border pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          დამატებითი
        </p>
        <div className="space-y-3">
          <OptionChips
            label="სტატუსი"
            aria-label="სტატუსით გაფილტვრა"
            value={status}
            onChange={(value) => onStatusChange(value as ClientStatus | "")}
            options={STATUS_OPTIONS}
          />
          <CreatedAtDateRangeFilter
            createdFrom={lastOpenedFrom}
            createdTo={lastOpenedTo}
            disabled={neverOpened}
            label={NOTE_LAST_OPENED_COPY.filterLabel}
            fromAriaLabel={NOTE_LAST_OPENED_COPY.filterFromAria}
            toAriaLabel={NOTE_LAST_OPENED_COPY.filterToAria}
            onChange={({ createdFrom: nextFrom, createdTo: nextTo }) =>
              onLastOpenedDateRangeChange({
                lastOpenedFrom: nextFrom,
                lastOpenedTo: nextTo,
              })
            }
          />
          <NeverOpenedFilter checked={neverOpened} onChange={onNeverOpenedChange} />
        </div>
      </div>
    </div>
  );
}

export type ClientsListSortFieldsProps = {
  sortBy: ClientSortBy;
  order: ClientSortOrder;
  onSortByChange: (value: ClientSortBy) => void;
  onOrderChange: (value: ClientSortOrder) => void;
  sortOptions: { value: ClientSortBy; label: string }[];
  orderOptions: { value: ClientSortOrder; label: string }[];
};

export function ClientsListSortFields({
  sortBy,
  order,
  onSortByChange,
  onOrderChange,
  sortOptions,
  orderOptions,
}: ClientsListSortFieldsProps) {
  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-4">
      <OptionChips
        label="სორტირება"
        aria-label="კლიენტების სორტირება"
        value={sortBy}
        onChange={(value) => onSortByChange(value as ClientSortBy)}
        options={sortOptions}
        size="compact"
      />
      <OptionChips
        label="მიმართულება"
        aria-label="სორტირების მიმართულება"
        value={order}
        onChange={(value) => onOrderChange(value as ClientSortOrder)}
        options={orderOptions}
        size="compact"
      />
    </div>
  );
}
