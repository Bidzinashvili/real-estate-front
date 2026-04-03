"use client";

import {
  DEAL_TYPE_OPTIONS,
  isDealType,
  type DealType,
} from "@/features/properties/dealType";
import { PROPERTY_TYPE_OPTIONS } from "@/features/properties/addPropertyFormOptions";
import {
  isPropertyListSortOrder,
  isPropertySortBy,
} from "@/features/properties/getPropertiesQuery";
import { CATALOG_LIMIT_OPTIONS } from "@/features/properties/propertyCatalogUrlParams";
import { isPropertyType, type PropertyType } from "@/features/properties/types";
import type { UsePropertiesCatalogResult } from "@/features/properties/usePropertiesCatalog";
import { InlineSelect } from "@/shared/ui/InlineSelect";
import {
  PROPERTY_CATALOG_INPUT_CLASS as INPUT_CLASS,
  PROPERTY_CATALOG_LABEL_CLASS as LABEL_CLASS,
} from "@/widgets/Properties/propertyCatalogFilterSharedStyles";
import { PropertyCatalogMoreFiltersDetails } from "@/widgets/Properties/propertyCatalogMoreFiltersDetails";

const SORT_OPTIONS = [
  { value: "createdAt", label: "Newest" },
  { value: "pricePublic", label: "Price" },
] as const;

const ORDER_OPTIONS = [
  { value: "desc", label: "High → low" },
  { value: "asc", label: "Low → high" },
] as const;

function parseDealTypeSelectValue(raw: string): DealType | "" {
  if (raw === "") return "";
  return isDealType(raw) ? raw : "";
}

function parsePropertyTypeSelectValue(raw: string): PropertyType | "" {
  if (raw === "") return "";
  return isPropertyType(raw) ? raw : "";
}

type PropertyCatalogFilterFieldsProps = {
  catalog: UsePropertiesCatalogResult;
  showMobileFooter: boolean;
  onApplyMobile?: () => void;
};

export function PropertyCatalogFilterFields({
  catalog,
  showMobileFooter,
  onApplyMobile,
}: PropertyCatalogFilterFieldsProps) {
  const { state } = catalog;

  return (
    <div className="space-y-5">
      <div>
        <span className={LABEL_CLASS}>Deal type</span>
        <select
          aria-label="Filter by deal type"
          value={state.dealType}
          onChange={(e) => catalog.setDealType(parseDealTypeSelectValue(e.target.value))}
          className={INPUT_CLASS}
        >
          <option value="">All deals</option>
          {DEAL_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className={LABEL_CLASS}>Property type</span>
        <select
          aria-label="Filter by property type"
          value={state.propertyType}
          onChange={(e) =>
            catalog.setPropertyType(parsePropertyTypeSelectValue(e.target.value))
          }
          className={INPUT_CLASS}
        >
          <option value="">All types</option>
          {PROPERTY_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className={LABEL_CLASS}>City</span>
        <input
          type="text"
          value={state.city}
          onChange={(e) => catalog.setCity(e.target.value)}
          className={INPUT_CLASS}
          placeholder="City contains…"
          autoComplete="address-level2"
        />
      </div>

      <div>
        <span className={LABEL_CLASS}>District</span>
        <input
          type="text"
          value={state.district}
          onChange={(e) => catalog.setDistrict(e.target.value)}
          className={INPUT_CLASS}
          placeholder="District contains…"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className={LABEL_CLASS}>Min price (₾)</span>
          <input
            type="text"
            inputMode="decimal"
            value={state.minPrice}
            onChange={(e) => catalog.setMinPrice(e.target.value)}
            className={INPUT_CLASS}
            placeholder="Min"
          />
        </div>
        <div>
          <span className={LABEL_CLASS}>Max price (₾)</span>
          <input
            type="text"
            inputMode="decimal"
            value={state.maxPrice}
            onChange={(e) => catalog.setMaxPrice(e.target.value)}
            className={INPUT_CLASS}
            placeholder="Max"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className={LABEL_CLASS}>Min area (m²)</span>
          <input
            type="text"
            inputMode="decimal"
            value={state.minArea}
            onChange={(e) => catalog.setMinArea(e.target.value)}
            className={INPUT_CLASS}
            placeholder="Min"
          />
        </div>
        <div>
          <span className={LABEL_CLASS}>Max area (m²)</span>
          <input
            type="text"
            inputMode="decimal"
            value={state.maxArea}
            onChange={(e) => catalog.setMaxArea(e.target.value)}
            className={INPUT_CLASS}
            placeholder="Max"
          />
        </div>
      </div>

      <PropertyCatalogMoreFiltersDetails catalog={catalog} />

      <div>
        <span className={LABEL_CLASS}>Sort</span>
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2">
          <InlineSelect
            aria-label="Sort listings by"
            value={state.sortBy}
            onChange={(v) => {
              if (isPropertySortBy(v)) catalog.setSortBy(v);
            }}
            options={SORT_OPTIONS}
            className="min-w-0 flex-1 text-sm"
          />
          <span className="h-4 w-px shrink-0 bg-slate-200" />
          <InlineSelect
            aria-label="Sort direction"
            value={state.order}
            onChange={(v) => {
              if (isPropertyListSortOrder(v)) catalog.setOrder(v);
            }}
            options={ORDER_OPTIONS}
            className="min-w-0 flex-1 text-sm"
          />
        </div>
      </div>

      <div>
        <span className={LABEL_CLASS}>Per page</span>
        <select
          aria-label="Results per page"
          value={String(state.limit)}
          onChange={(e) => catalog.setLimit(Number(e.target.value))}
          className={INPUT_CLASS}
        >
          {CATALOG_LIMIT_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} listings
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={() => catalog.resetFilters()}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
        >
          Clear all
        </button>
        {showMobileFooter && (
          <button
            type="button"
            onClick={onApplyMobile}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Show results
          </button>
        )}
      </div>
    </div>
  );
}
