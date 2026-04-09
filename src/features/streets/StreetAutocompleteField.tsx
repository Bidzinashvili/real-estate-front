"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { searchStreets } from "@/features/streets/streetsApi";
import type { Street } from "@/features/streets/streetTypes";
import { ApiError } from "@/shared/lib/apiError";

const DEFAULT_DEBOUNCE_MS = 250;
const DEFAULT_LIMIT = 15;

type AddressChangeMeta = {
  selectedStreetId: string | null;
};

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (next: string, addressChangeMeta?: AddressChangeMeta) => void;
  error?: string;
  required?: boolean;
  inputClassName: string;
  debounceMs?: number;
  limit?: number;
  fuzzy?: boolean;
};

export function StreetAutocompleteField({
  id,
  label,
  value,
  onChange,
  error,
  required,
  inputClassName,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  limit = DEFAULT_LIMIT,
  fuzzy,
}: Props) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestAbortRef = useRef<AbortController | null>(null);

  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Street[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      setDebouncedQuery(value.trim());
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value, debounceMs]);

  useEffect(() => {
    if (debouncedQuery.length === 0) {
      requestAbortRef.current?.abort();
      setSuggestions([]);
      setIsLoading(false);
      setFetchError(null);
      return;
    }

    const controller = new AbortController();
    requestAbortRef.current?.abort();
    requestAbortRef.current = controller;

    setIsLoading(true);
    setFetchError(null);

    (async () => {
      try {
        const result = await searchStreets(
          { query: debouncedQuery, limit, fuzzy },
          { signal: controller.signal },
        );
        if (controller.signal.aborted) return;
        setSuggestions(result.streets);
      } catch (loadError) {
        if (axios.isAxiosError(loadError) && loadError.code === "ERR_CANCELED") {
          return;
        }
        if (controller.signal.aborted) return;
        if (loadError instanceof ApiError) {
          setFetchError(loadError.message);
        } else {
          setFetchError("Could not load street suggestions right now.");
        }
        setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, limit, fuzzy]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const node = containerRef.current;
      if (!node) return;
      if (event.target instanceof Node && !node.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const handleInputChange = useCallback(
    (next: string) => {
      onChange(next, { selectedStreetId: null });
      setIsOpen(true);
    },
    [onChange],
  );

  const handleSelectStreet = useCallback(
    (street: Street) => {
      onChange(street.name, { selectedStreetId: street.id });
      setIsOpen(false);
    },
    [onChange],
  );

  const showPanel = isOpen && debouncedQuery.length > 0;
  const showEmptyState =
    showPanel &&
    !isLoading &&
    !fetchError &&
    suggestions.length === 0;

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        required={required}
        autoComplete="off"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={listboxId}
        aria-autocomplete="list"
        onChange={(event) => handleInputChange(event.target.value)}
        onFocus={() => setIsOpen(true)}
        className={`${inputClassName} ${error ? "border-red-500 focus:border-red-600" : ""}`}
      />
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {showPanel ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg ring-1 ring-black/5"
        >
          {isLoading ? (
            <p className="px-3 py-2 text-slate-500">Loading…</p>
          ) : null}

          {fetchError ? (
            <p className="px-3 py-2 text-red-600" role="alert">
              {fetchError}
            </p>
          ) : null}

          {showEmptyState ? (
            <p className="px-3 py-2 text-slate-500">No matching streets</p>
          ) : null}

          {!isLoading &&
            !fetchError &&
            suggestions.map((street) => (
              <button
                key={street.id}
                type="button"
                role="option"
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-slate-900 hover:bg-slate-50"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSelectStreet(street);
                }}
              >
                <span>{street.name}</span>
              </button>
            ))}
        </div>
      ) : null}
    </div>
  );
}
