"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import type { DealType } from "@/features/clients/clientEnums";
import {
  clientDealTypeToPropertyCatalogDealType,
  formatClientOutcomePropertyFieldLabel,
} from "@/features/clients/clientOutcomePropertyLabel";
import { getProperties } from "@/features/properties/api";
import { formatPropertyCardTitle } from "@/features/properties/formatPropertyCardTitle";
import type { Property } from "@/features/properties/types";
import { usePropertyDetails } from "@/features/properties/usePropertyDetails";

const SEARCH_DEBOUNCE_MS = 300;
const SEARCH_RESULTS_LIMIT = 8;

type ClientOutcomePropertyPickerProps = {
  dealType: DealType;
  value: string;
  onChange: (nextPropertyId: string) => void;
  disabled?: boolean;
};

export function ClientOutcomePropertyPicker({
  dealType,
  value,
  onChange,
  disabled = false,
}: ClientOutcomePropertyPickerProps) {
  const fieldId = useId();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { property: selectedProperty } = usePropertyDetails(value || null);

  useEffect(() => {
    const trimmedSearch = searchInput.trim();
    if (trimmedSearch.length < 2) {
      setSearchResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    setIsSearching(true);
    setSearchError(null);

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const catalogDealType = clientDealTypeToPropertyCatalogDealType(dealType);
          const result = await getProperties(
            {
              search: trimmedSearch,
              dealType: catalogDealType,
              limit: SEARCH_RESULTS_LIMIT,
              page: 1,
              archived: false,
            },
            { signal: controller.signal },
          );
          setSearchResults(result.properties);
        } catch (error) {
          if (controller.signal.aborted) {
            return;
          }
          setSearchResults([]);
          setSearchError(
            error instanceof Error ? error.message : "ძებნა ვერ მოხერხდა.",
          );
        } finally {
          if (!controller.signal.aborted) {
            setIsSearching(false);
          }
        }
      })();
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [dealType, searchInput]);

  const selectedLabel =
    selectedProperty !== null && selectedProperty !== undefined
      ? formatPropertyCardTitle(selectedProperty)
      : null;

  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="block text-sm font-medium text-foreground">
        {formatClientOutcomePropertyFieldLabel(dealType)}
      </label>
      <p className="text-xs text-muted-foreground">არასავალდებულო — შეგიძლიათ დატოვოთ ცარიელი.</p>
      {value && selectedLabel ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
          <Link
            href={`/properties/${value}`}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            {selectedLabel}
          </Link>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("")}
            className="text-xs font-medium text-muted-foreground transition hover:text-destructive disabled:opacity-60"
          >
            წაშლა
          </button>
        </div>
      ) : null}
      <input
        id={fieldId}
        type="search"
        disabled={disabled}
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="მისამართი ან სათაური…"
        className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
        autoComplete="off"
      />
      {isSearching ? (
        <p className="text-xs text-muted-foreground">იძებნება…</p>
      ) : null}
      {searchError ? (
        <p className="text-xs text-destructive" role="alert">
          {searchError}
        </p>
      ) : null}
      {searchResults.length > 0 ? (
        <ul
          className="max-h-48 overflow-y-auto rounded-lg border border-border bg-card shadow-sm"
          role="listbox"
        >
          {searchResults.map((property) => {
            const title = formatPropertyCardTitle(property);
            const isSelected = property.id === value;
            return (
              <li key={property.id}>
                <button
                  type="button"
                  disabled={disabled}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(property.id);
                    setSearchInput("");
                    setSearchResults([]);
                  }}
                  className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-muted disabled:opacity-60 ${
                    isSelected ? "bg-primary/10 font-medium text-primary" : "text-foreground"
                  }`}
                >
                  {title}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
