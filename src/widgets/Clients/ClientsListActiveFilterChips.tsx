"use client";

import { X } from "lucide-react";
import { formatClientDealIntentLabel } from "@/features/clients/clientDealTypeDisplay";
import {
  type ClientStatus,
  type DealType,
} from "@/features/clients/clientEnums";
import { formatClientStatusLabel } from "@/features/clients/clientStatusDisplay";
import type { ClientListUrlState } from "@/features/clients/clientListUrlParams";
import { statChipClassName } from "@/shared/ui/chipStyles";
import { NOTE_LAST_OPENED_COPY } from "@/features/noteLastOpened/noteLastOpenedCopy";

type ActiveFilterChip = {
  key: string;
  label: string;
  onRemove: () => void;
};

function buildActiveFilterChips(args: {
  state: ClientListUrlState;
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
}): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  const { state } = args;

  if (state.dealType) {
    chips.push({
      key: "dealType",
      label: formatClientDealIntentLabel(state.dealType),
      onRemove: () => args.onDealTypeChange(""),
    });
  }
  if (state.district.trim()) {
    chips.push({
      key: "district",
      label: state.district.trim(),
      onRemove: () => args.onDistrictChange(""),
    });
  }
  if (state.budgetMinInput.trim() || state.budgetMaxInput.trim()) {
    const minimum = state.budgetMinInput.trim();
    const maximum = state.budgetMaxInput.trim();
    const budgetLabel =
      minimum && maximum
        ? `${minimum}–${maximum} ₾`
        : minimum
          ? `${minimum}+ ₾`
          : `მდე ${maximum} ₾`;
    chips.push({
      key: "budget",
      label: budgetLabel,
      onRemove: () => {
        args.onBudgetMinChange("");
        args.onBudgetMaxChange("");
      },
    });
  }
  if (state.createdFrom.trim() || state.createdTo.trim()) {
    chips.push({
      key: "created",
      label: `ატვირთვა: ${state.createdFrom || "…"} – ${state.createdTo || "…"}`,
      onRemove: () =>
        args.onCreatedDateRangeChange({ createdFrom: "", createdTo: "" }),
    });
  }
  if (state.status) {
    chips.push({
      key: "status",
      label: formatClientStatusLabel(state.status),
      onRemove: () => args.onStatusChange(""),
    });
  }
  if (state.neverOpened) {
    chips.push({
      key: "neverOpened",
      label: NOTE_LAST_OPENED_COPY.neverOpenedFilter,
      onRemove: () => args.onNeverOpenedChange(false),
    });
  } else if (state.lastOpenedFrom.trim() || state.lastOpenedTo.trim()) {
    chips.push({
      key: "lastOpened",
      label: `${NOTE_LAST_OPENED_COPY.filterLabel}: ${state.lastOpenedFrom || "…"} – ${state.lastOpenedTo || "…"}`,
      onRemove: () =>
        args.onLastOpenedDateRangeChange({
          lastOpenedFrom: "",
          lastOpenedTo: "",
        }),
    });
  }

  return chips;
}

export type ClientsListActiveFilterChipsProps = {
  state: ClientListUrlState;
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
  onClearAll: () => void;
  hasClearablePanelFilters: boolean;
};

export function ClientsListActiveFilterChips({
  state,
  onDealTypeChange,
  onDistrictChange,
  onBudgetMinChange,
  onBudgetMaxChange,
  onCreatedDateRangeChange,
  onStatusChange,
  onLastOpenedDateRangeChange,
  onNeverOpenedChange,
  onClearAll,
  hasClearablePanelFilters,
}: ClientsListActiveFilterChipsProps) {
  const chips = buildActiveFilterChips({
    state,
    onDealTypeChange,
    onDistrictChange,
    onBudgetMinChange,
    onBudgetMaxChange,
    onCreatedDateRangeChange,
    onStatusChange,
    onLastOpenedDateRangeChange,
    onNeverOpenedChange,
  });

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className={statChipClassName}
        >
          <span>{chip.label}</span>
          <X className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
          <span className="sr-only">ფილტრის მოხსნა</span>
        </button>
      ))}
      {hasClearablePanelFilters ? (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          ფილტრების გასუფთავება
        </button>
      ) : null}
    </div>
  );
}
