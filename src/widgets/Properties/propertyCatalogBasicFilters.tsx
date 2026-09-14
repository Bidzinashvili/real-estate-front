"use client";

import {
  DEAL_TYPE_OPTIONS,
  isDealType,
  type DealType,
} from "@/features/properties/dealType";
import { PROPERTY_TYPE_OPTIONS } from "@/features/properties/addPropertyFormOptions";
import { isPropertyType, type PropertyType } from "@/features/properties/types";
import type { UsePropertiesCatalogResult } from "@/features/properties/usePropertiesCatalog";
import { InlineSelect } from "@/shared/ui/InlineSelect";
import { CreatedAtDateRangeFilter } from "@/widgets/DatabaseList/CreatedAtDateRangeFilter";
import { AdvancedSearchButton } from "@/widgets/DatabaseList/AdvancedSearchButton";
import { READY_TO_UPLOAD_COPY } from "@/features/readyToUpload/readyToUploadCopy";

function parseDealTypeSelectValue(raw: string): DealType | "" {
  if (raw === "") return "";
  return isDealType(raw) ? raw : "";
}

function parsePropertyTypeSelectValue(raw: string): PropertyType | "" {
  if (raw === "") return "";
  return isPropertyType(raw) ? raw : "";
}

const DEAL_TYPE_FILTER_OPTIONS = [
  { value: "", label: "ყველა გარიგება" },
  ...DEAL_TYPE_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  })),
];

const PROPERTY_TYPE_FILTER_OPTIONS = [
  { value: "", label: "ყველა ტიპი" },
  ...PROPERTY_TYPE_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  })),
];

type PropertyCatalogBasicFiltersProps = {
  catalog: UsePropertiesCatalogResult;
  onOpenAdvanced: () => void;
};

export function PropertyCatalogBasicFilters({
  catalog,
  onOpenAdvanced,
}: PropertyCatalogBasicFiltersProps) {
  const { state } = catalog;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground shadow-sm">
          <InlineSelect
            aria-label="გარიგების ტიპით გაფილტვრა"
            value={state.dealType}
            onChange={(selectedValue) =>
              catalog.setDealType(parseDealTypeSelectValue(selectedValue))
            }
            options={DEAL_TYPE_FILTER_OPTIONS}
          />
        </div>
        <div className="flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground shadow-sm">
          <InlineSelect
            aria-label="ტიპით გაფილტვრა"
            value={state.propertyType}
            onChange={(selectedValue) =>
              catalog.setPropertyType(parsePropertyTypeSelectValue(selectedValue))
            }
            options={PROPERTY_TYPE_FILTER_OPTIONS}
          />
        </div>
        <input
          type="text"
          value={state.district}
          onChange={(event) => catalog.setDistrict(event.target.value)}
          placeholder="უბანი…"
          className="h-8 w-36 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <input
          type="text"
          inputMode="decimal"
          value={state.minPrice}
          onChange={(event) => catalog.setMinPrice(event.target.value)}
          placeholder="მინ. ფასი"
          className="h-8 w-28 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <input
          type="text"
          inputMode="decimal"
          value={state.maxPrice}
          onChange={(event) => catalog.setMaxPrice(event.target.value)}
          placeholder="მაქს. ფასი"
          className="h-8 w-28 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <AdvancedSearchButton
          appliedCount={catalog.advancedFilterCount}
          onOpen={onOpenAdvanced}
        />
        <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground shadow-sm">
          <input
            type="checkbox"
            checked={state.readyToUpload}
            onChange={(event) => catalog.setReadyToUpload(event.target.checked)}
            className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
          />
          {READY_TO_UPLOAD_COPY.filterLabel}
        </label>
        {catalog.hasClearableFilters ? (
          <button
            type="button"
            onClick={() => catalog.resetFilters()}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            ყველაფრის გასუფთავება
          </button>
        ) : null}
      </div>
      <CreatedAtDateRangeFilter
        createdFrom={state.createdFrom}
        createdTo={state.createdTo}
        onChange={catalog.setCreatedDateRange}
        compact
      />
    </div>
  );
}
