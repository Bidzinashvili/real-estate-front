"use client";

import { LabelAutocompleteChipsInput } from "@/features/labels/LabelAutocompleteChipsInput";
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
import {
  isPropertyStatus,
  PROPERTY_STATUS_FILTER_OPTIONS,
} from "@/features/properties/types";
import { CATALOG_LIMIT_OPTIONS } from "@/features/properties/propertyCatalogUrlParams";
import {
  isPropertyType,
  type PropertyStatus,
  type PropertyType,
} from "@/features/properties/types";
import type { UsePropertiesCatalogResult } from "@/features/properties/usePropertiesCatalog";
import { InlineSelect } from "@/shared/ui/InlineSelect";
import { NativeSelectSurface } from "@/shared/ui/NativeSelectSurface";
import {
  PROPERTY_CATALOG_INPUT_CLASS as INPUT_CLASS,
  PROPERTY_CATALOG_LABEL_CLASS as LABEL_CLASS,
  PROPERTY_CATALOG_SELECT_CLASS as SELECT_CLASS,
} from "@/widgets/Properties/propertyCatalogFilterSharedStyles";
import { PropertyCatalogMoreFiltersDetails } from "@/widgets/Properties/propertyCatalogMoreFiltersDetails";

const SORT_OPTIONS = [
  { value: "createdAt", label: "უახლესი" },
  { value: "pricePublic", label: "ფასი" },
] as const;

const ORDER_OPTIONS = [
  { value: "desc", label: "კლებადობით" },
  { value: "asc", label: "ზრდადობით" },
] as const;

function parseDealTypeSelectValue(raw: string): DealType | "" {
  if (raw === "") return "";
  return isDealType(raw) ? raw : "";
}

function parsePropertyTypeSelectValue(raw: string): PropertyType | "" {
  if (raw === "") return "";
  return isPropertyType(raw) ? raw : "";
}

function parseLifecycleStatusFilterValue(raw: string): PropertyStatus | "" {
  if (raw === "") return "";
  return isPropertyStatus(raw) ? raw : "";
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
        <span className={LABEL_CLASS}>გარიგების ტიპი</span>
        <NativeSelectSurface>
          <select
            aria-label="გარიგების ტიპით გაფილტვრა"
            value={state.dealType}
            onChange={(event) =>
              catalog.setDealType(parseDealTypeSelectValue(event.target.value))
            }
            className={SELECT_CLASS}
          >
            <option value="">ყველა გარიგება</option>
            {DEAL_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </NativeSelectSurface>
      </div>

      <div>
        <span className={LABEL_CLASS}>განცხადების სტატუსი</span>
        <NativeSelectSurface>
          <select
            aria-label="სტატუსით გაფილტვრა"
            value={state.lifecycleStatus}
            onChange={(event) =>
              catalog.setLifecycleStatus(
                parseLifecycleStatusFilterValue(event.target.value),
              )
            }
            className={SELECT_CLASS}
          >
            {PROPERTY_STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </NativeSelectSurface>
      </div>

      <div>
        <span className={LABEL_CLASS}>უძრავი ქონების ტიპი</span>
        <NativeSelectSurface>
          <select
            aria-label="ტიპით გაფილტვრა"
            value={state.propertyType}
            onChange={(event) =>
              catalog.setPropertyType(parsePropertyTypeSelectValue(event.target.value))
            }
            className={SELECT_CLASS}
          >
            <option value="">ყველა ტიპი</option>
            {PROPERTY_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </NativeSelectSurface>
      </div>

      <LabelAutocompleteChipsInput
        id="catalogLabels"
        label="ლეიბლები"
        selectedLabels={catalog.selectedLabels}
        onChange={catalog.setSelectedLabels}
        placeholder="აკრიფეთ ლეიბლის მოსაძებნად"
      />

      <div>
        <span className={LABEL_CLASS}>ქალაქი</span>
        <input
          type="text"
          value={state.city}
          onChange={(event) => catalog.setCity(event.target.value)}
          className={INPUT_CLASS}
          placeholder="ქალაქი შეიცავს…"
          autoComplete="address-level2"
        />
      </div>

      <div>
        <span className={LABEL_CLASS}>უბანი</span>
        <input
          type="text"
          value={state.district}
          onChange={(event) => catalog.setDistrict(event.target.value)}
          className={INPUT_CLASS}
          placeholder="უბანი შეიცავს…"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className={LABEL_CLASS}>მინ. ფასი (₾)</span>
          <input
            type="text"
            inputMode="decimal"
            value={state.minPrice}
            onChange={(event) => catalog.setMinPrice(event.target.value)}
            className={INPUT_CLASS}
            placeholder="მინ."
          />
        </div>
        <div>
          <span className={LABEL_CLASS}>მაქს. ფასი (₾)</span>
          <input
            type="text"
            inputMode="decimal"
            value={state.maxPrice}
            onChange={(event) => catalog.setMaxPrice(event.target.value)}
            className={INPUT_CLASS}
            placeholder="მაქს."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className={LABEL_CLASS}>მინ. ფართობი (მ²)</span>
          <input
            type="text"
            inputMode="decimal"
            value={state.minArea}
            onChange={(event) => catalog.setMinArea(event.target.value)}
            className={INPUT_CLASS}
            placeholder="მინ."
          />
        </div>
        <div>
          <span className={LABEL_CLASS}>მაქს. ფართობი (მ²)</span>
          <input
            type="text"
            inputMode="decimal"
            value={state.maxArea}
            onChange={(event) => catalog.setMaxArea(event.target.value)}
            className={INPUT_CLASS}
            placeholder="მაქს."
          />
        </div>
      </div>

      <PropertyCatalogMoreFiltersDetails catalog={catalog} />

      <div>
        <span className={LABEL_CLASS}>სორტირება</span>
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-2 py-2">
          <InlineSelect
            aria-label="სორტირება"
            value={state.sortBy}
            onChange={(selectedValue) => {
              if (isPropertySortBy(selectedValue)) catalog.setSortBy(selectedValue);
            }}
            options={SORT_OPTIONS}
            className="min-w-0 flex-1 text-sm"
          />
          <span className="h-4 w-px shrink-0 bg-border" />
          <InlineSelect
            aria-label="მიმართულება"
            value={state.order}
            onChange={(selectedValue) => {
              if (isPropertyListSortOrder(selectedValue)) catalog.setOrder(selectedValue);
            }}
            options={ORDER_OPTIONS}
            className="min-w-0 flex-1 text-sm"
          />
        </div>
      </div>

      <div>
        <span className={LABEL_CLASS}>გვერდზე</span>
        <NativeSelectSurface>
          <select
            aria-label="შედეგები გვერდზე"
            value={String(state.limit)}
            onChange={(event) => catalog.setLimit(Number(event.target.value))}
            className={SELECT_CLASS}
          >
            {CATALOG_LIMIT_OPTIONS.map((limitOption) => (
              <option key={limitOption} value={limitOption}>
                {limitOption} განცხადება
              </option>
            ))}
          </select>
        </NativeSelectSurface>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={() => catalog.resetFilters()}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
        >
          ყველას გასუფთავება
        </button>
        {showMobileFooter && (
          <button
            type="button"
            onClick={onApplyMobile}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
          >
            შედეგების ჩვენება
          </button>
        )}
      </div>
    </div>
  );
}
