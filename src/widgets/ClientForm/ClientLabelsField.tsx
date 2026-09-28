"use client";

import { useId, useState, type KeyboardEvent } from "react";
import {
  CLIENT_LABELS_FIELD_TITLE,
  CLIENT_LABELS_HELPER_TEXT,
  CLIENT_LABEL_SUGGESTIONS,
  type ClientLabelSuggestion,
} from "@/features/clients/clientLabelSuggestions";
import {
  clientLabelsIncludeName,
  mergeClientLabels,
  normalizeClientLabelName,
  partitionClientLabelsBySuggestion,
  removeClientLabelName,
  resolveClientLabelName,
  sanitizeClientLabelList,
} from "@/features/clients/clientLabelValueUtils";
import { MultiOptionChips } from "@/shared/ui/OptionChips";

type ClientLabelsFieldProps = {
  value: string[];
  onChange: (nextValue: string[]) => void;
  fieldDescription?: string;
};

export function ClientLabelsField({
  value,
  onChange,
  fieldDescription,
}: ClientLabelsFieldProps) {
  const customInputId = useId();
  const [customInput, setCustomInput] = useState("");
  const selectedLabels = sanitizeClientLabelList(value);
  const { customLabels, selectedSuggestions } = partitionClientLabelsBySuggestion(selectedLabels);

  const suggestionOptions = CLIENT_LABEL_SUGGESTIONS.map((suggestion) => ({
    value: suggestion,
    label: suggestion,
  }));

  const helperText = fieldDescription?.trim() ? fieldDescription : CLIENT_LABELS_HELPER_TEXT;

  function commitCustomLabel(rawValue: string) {
    const resolvedName = resolveClientLabelName(rawValue);
    if (resolvedName === "") {
      setCustomInput("");
      return;
    }

    if (clientLabelsIncludeName(selectedLabels, resolvedName)) {
      setCustomInput("");
      return;
    }

    onChange(sanitizeClientLabelList([...selectedLabels, resolvedName]));
    setCustomInput("");
  }

  function handleCustomInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      event.stopPropagation();
      commitCustomLabel(customInput);
    }
  }

  function handleSuggestionChange(nextSuggestions: string[]) {
    const selectedSuggestionValues = nextSuggestions.filter((suggestionName): suggestionName is ClientLabelSuggestion =>
      (CLIENT_LABEL_SUGGESTIONS as readonly string[]).includes(suggestionName),
    );
    onChange(
      mergeClientLabels({
        customLabels,
        selectedSuggestions: selectedSuggestionValues,
      }),
    );
  }

  function handleRemoveLabel(labelName: string) {
    onChange(removeClientLabelName(selectedLabels, labelName));
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{CLIENT_LABELS_FIELD_TITLE}</p>
        <p className="text-xs text-muted-foreground">{helperText}</p>
      </div>

      {selectedLabels.length > 0 ? (
        <div
          className="flex flex-wrap gap-2"
          role="list"
          aria-label="არჩეული დამატებითი მოთხოვნები"
        >
          {selectedLabels.map((labelName) => (
            <span
              key={labelName.toLocaleLowerCase()}
              role="listitem"
              className="inline-flex max-w-full items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm text-foreground"
            >
              <span className="truncate">{labelName}</span>
              <button
                type="button"
                onClick={() => handleRemoveLabel(labelName)}
                aria-label={`${labelName}-ის წაშლა`}
                className="shrink-0 text-muted-foreground transition hover:text-foreground"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <MultiOptionChips
        aria-label="შემოთავაზებული დამატებითი მოთხოვნები"
        options={suggestionOptions}
        value={selectedSuggestions}
        onChange={handleSuggestionChange}
        size="compact"
      />

      <div className="space-y-1.5">
        <label htmlFor={customInputId} className="block text-xs font-medium text-muted-foreground">
          საკუთარი მოთხოვნა
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            id={customInputId}
            type="text"
            value={customInput}
            onChange={(event) => setCustomInput(event.target.value)}
            onKeyDown={handleCustomInputKeyDown}
            onBlur={() => {
              const trimmedInput = normalizeClientLabelName(customInput);
              if (trimmedInput !== "") {
                commitCustomLabel(customInput);
              }
            }}
            placeholder="მაგ. ლიფტის გარეშე სართული"
            className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <button
            type="button"
            onClick={() => commitCustomLabel(customInput)}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            დამატება
          </button>
        </div>
      </div>
    </div>
  );
}
