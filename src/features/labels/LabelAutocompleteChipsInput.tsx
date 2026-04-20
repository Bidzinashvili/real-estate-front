"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import axios from "axios";
import { fetchLabelsAutocomplete } from "@/features/labels/labelsApi";
import type { LabelDto, LabelSelection, LabelType } from "@/features/labels/labelTypes";
import { ApiError } from "@/shared/lib/apiError";
import { cn } from "@/shared/lib/utils";

const defaultDebounceMs = 300;
const defaultMinQueryLength = 1;
const defaultLimit = 15;

type LabelAutocompleteChipsInputProps = {
  id: string;
  label: string;
  selectedLabels: LabelSelection[];
  onChange: (nextValue: LabelSelection[]) => void;
  allowFreeText?: boolean;
  placeholder?: string;
  debounceMs?: number;
  minQueryLength?: number;
  limit?: number;
};

function normalizeLabelName(rawValue: string): string {
  return rawValue.trim().replace(/\s+/g, " ");
}

function getLabelSelectionKey(label: LabelSelection): string {
  if (label.id) {
    return `id:${label.id}`;
  }

  return `name:${label.name.toLocaleLowerCase()}`;
}

function hasMatchingLabel(labels: LabelSelection[], candidate: LabelSelection): boolean {
  if (candidate.id) {
    return labels.some((label) => label.id === candidate.id);
  }

  const candidateKey = candidate.name.toLocaleLowerCase();
  return labels.some((label) => label.name.toLocaleLowerCase() === candidateKey);
}

function createFreeTextLabel(rawValue: string): LabelSelection | null {
  const normalizedName = normalizeLabelName(rawValue);
  if (normalizedName === "") {
    return null;
  }

  return {
    id: null,
    name: normalizedName,
    type: "CUSTOM",
  };
}

function toLabelSelection(label: LabelDto): LabelSelection {
  return {
    id: label.id,
    name: label.name,
    type: label.type,
  };
}

function labelTypeBadgeClassName(type: LabelType | null): string {
  if (type === "STREET") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (type === "CUSTOM") {
    return "bg-sky-100 text-sky-700";
  }

  return "bg-slate-100 text-slate-500";
}

export function LabelAutocompleteChipsInput({
  id,
  label,
  selectedLabels,
  onChange,
  allowFreeText = false,
  placeholder = "Type to search labels",
  debounceMs = defaultDebounceMs,
  minQueryLength = defaultMinQueryLength,
  limit = defaultLimit,
}: LabelAutocompleteChipsInputProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestAbortRef = useRef<AbortController | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LabelDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      setDebouncedQuery(inputValue.trim());
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [debounceMs, inputValue]);

  useEffect(() => {
    if (debouncedQuery.length < minQueryLength) {
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

    void (async () => {
      try {
        const result = await fetchLabelsAutocomplete(
          { query: debouncedQuery, limit },
          { signal: controller.signal },
        );
        if (controller.signal.aborted) {
          return;
        }

        setSuggestions(result.labels);
      } catch (loadError) {
        if (axios.isAxiosError(loadError) && loadError.code === "ERR_CANCELED") {
          return;
        }

        if (controller.signal.aborted) {
          return;
        }

        if (loadError instanceof ApiError) {
          setFetchError(loadError.message);
        } else {
          setFetchError("Could not load label suggestions right now.");
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
  }, [debouncedQuery, limit, minQueryLength]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const containerElement = containerRef.current;
      if (!containerElement) {
        return;
      }

      if (event.target instanceof Node && !containerElement.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const availableSuggestions = useMemo(
    () =>
      suggestions.filter((suggestion) => !hasMatchingLabel(selectedLabels, toLabelSelection(suggestion))),
    [selectedLabels, suggestions],
  );

  const freeTextCandidate = useMemo(() => createFreeTextLabel(inputValue), [inputValue]);
  const canAddFreeText =
    allowFreeText &&
    freeTextCandidate !== null &&
    !hasMatchingLabel(selectedLabels, freeTextCandidate);

  const showPanel = isOpen && inputValue.trim().length >= minQueryLength;
  const showEmptyState =
    showPanel && !isLoading && !fetchError && availableSuggestions.length === 0 && !canAddFreeText;

  const handleAddLabel = useCallback(
    (labelSelection: LabelSelection) => {
      if (hasMatchingLabel(selectedLabels, labelSelection)) {
        setInputValue("");
        setIsOpen(false);
        return;
      }

      onChange([...selectedLabels, labelSelection]);
      setInputValue("");
      setIsOpen(false);
    },
    [onChange, selectedLabels],
  );

  const handleRemoveLabel = useCallback(
    (labelToRemove: LabelSelection) => {
      const labelKey = getLabelSelectionKey(labelToRemove);
      onChange(selectedLabels.filter((labelSelection) => getLabelSelectionKey(labelSelection) !== labelKey));
    },
    [onChange, selectedLabels],
  );

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      if (canAddFreeText && freeTextCandidate) {
        event.preventDefault();
        handleAddLabel(freeTextCandidate);
      }
      return;
    }

    if (event.key === "Backspace" && inputValue === "" && selectedLabels.length > 0) {
      const previousLabel = selectedLabels[selectedLabels.length - 1];
      if (previousLabel) {
        handleRemoveLabel(previousLabel);
      }
    }
  }

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>

      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {selectedLabels.map((selectedLabel) => (
            <span
              key={getLabelSelectionKey(selectedLabel)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
            >
              <span>{selectedLabel.name}</span>
              {selectedLabel.type ? (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
                    labelTypeBadgeClassName(selectedLabel.type),
                  )}
                >
                  {selectedLabel.type}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => handleRemoveLabel(selectedLabel)}
                aria-label={`Remove ${selectedLabel.name}`}
                className="text-slate-500 transition hover:text-slate-800"
              >
                &times;
              </button>
            </span>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            id={id}
            type="text"
            value={inputValue}
            autoComplete="off"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={listboxId}
            aria-autocomplete="list"
            onChange={(event) => {
              setInputValue(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400"
          />
          {canAddFreeText && freeTextCandidate ? (
            <button
              type="button"
              onClick={() => handleAddLabel(freeTextCandidate)}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Add
            </button>
          ) : null}
        </div>
      </div>

      {showPanel ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg ring-1 ring-black/5"
        >
          {isLoading ? <p className="px-3 py-2 text-slate-500">Loading...</p> : null}

          {fetchError ? (
            <p className="px-3 py-2 text-red-600" role="alert">
              {fetchError}
            </p>
          ) : null}

          {canAddFreeText && freeTextCandidate ? (
            <button
              type="button"
              role="option"
              onMouseDown={(event) => {
                event.preventDefault();
                handleAddLabel(freeTextCandidate);
              }}
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-slate-900 hover:bg-slate-50"
            >
              <span>Add "{freeTextCandidate.name}"</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
                  labelTypeBadgeClassName(freeTextCandidate.type),
                )}
              >
                {freeTextCandidate.type}
              </span>
            </button>
          ) : null}

          {!isLoading &&
            !fetchError &&
            availableSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                role="option"
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-slate-900 hover:bg-slate-50"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleAddLabel(toLabelSelection(suggestion));
                }}
              >
                <span>{suggestion.name}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
                    labelTypeBadgeClassName(suggestion.type),
                  )}
                >
                  {suggestion.type}
                </span>
              </button>
            ))}

          {showEmptyState ? (
            <p className="px-3 py-2 text-slate-500">No matching labels</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
