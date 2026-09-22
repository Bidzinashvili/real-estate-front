"use client";

import { LabelAutocompleteChipsInput } from "@/features/labels/LabelAutocompleteChipsInput";
import {
  isPropertyStatus,
  PROPERTY_STATUS_FILTER_OPTIONS,
  type PropertyStatus,
} from "@/features/properties/types";
import { CATALOG_LIMIT_OPTIONS } from "@/features/properties/propertyCatalogUrlParams";
import type { UsePropertiesCatalogResult } from "@/features/properties/usePropertiesCatalog";
import { OptionChips } from "@/shared/ui/OptionChips";
import {
  PROPERTY_CATALOG_INPUT_CLASS as INPUT_CLASS,
  PROPERTY_CATALOG_LABEL_CLASS as LABEL_CLASS,
} from "@/widgets/Properties/propertyCatalogFilterSharedStyles";
import { PropertyCatalogMoreFiltersDetails } from "@/widgets/Properties/propertyCatalogMoreFiltersDetails";
import { CreatedAtDateRangeFilter } from "@/widgets/DatabaseList/CreatedAtDateRangeFilter";
import { NeverOpenedFilter } from "@/widgets/DatabaseList/NeverOpenedFilter";
import { NOTE_LAST_OPENED_COPY } from "@/features/noteLastOpened/noteLastOpenedCopy";

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
      <OptionChips
        label="განცხადების სტატუსი"
        labelClassName={LABEL_CLASS}
        aria-label="სტატუსით გაფილტვრა"
        value={state.lifecycleStatus}
        onChange={(selectedValue) =>
          catalog.setLifecycleStatus(parseLifecycleStatusFilterValue(selectedValue))
        }
        options={PROPERTY_STATUS_FILTER_OPTIONS}
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

      <LabelAutocompleteChipsInput
        id="catalogLabels"
        label="ლეიბლები"
        selectedLabels={catalog.selectedLabels}
        onChange={catalog.setSelectedLabels}
        placeholder="აკრიფეთ ლეიბლის მოსაძებნად"
      />

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

      <CreatedAtDateRangeFilter
        createdFrom={state.lastOpenedFrom}
        createdTo={state.lastOpenedTo}
        disabled={state.neverOpened}
        label={NOTE_LAST_OPENED_COPY.filterLabel}
        fromAriaLabel={NOTE_LAST_OPENED_COPY.filterFromAria}
        toAriaLabel={NOTE_LAST_OPENED_COPY.filterToAria}
        onChange={({ createdFrom, createdTo }) =>
          catalog.setLastOpenedDateRange({
            lastOpenedFrom: createdFrom,
            lastOpenedTo: createdTo,
          })
        }
      />
      <NeverOpenedFilter
        checked={state.neverOpened}
        onChange={catalog.setNeverOpened}
      />

      <OptionChips
        label="გვერდზე"
        labelClassName={LABEL_CLASS}
        aria-label="შედეგები გვერდზე"
        value={String(state.limit)}
        onChange={(selectedValue) => catalog.setLimit(Number(selectedValue))}
        options={CATALOG_LIMIT_OPTIONS.map((limitOption) => ({
          value: String(limitOption),
          label: `${limitOption} განცხადება`,
        }))}
      />

      {showMobileFooter ? (
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={onApplyMobile}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
          >
            შედეგების ჩვენება
          </button>
        </div>
      ) : null}
    </div>
  );
}
