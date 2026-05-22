"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { getApiBaseUrl, getStoredAuthToken } from "@/shared/lib/auth";
import { addPropertyInputClassName } from "@/widgets/AddProperty/addPropertyFormFields";

type ProjectSuggestion = {
  name: string;
};

type ProjectsResponse = {
  projects: ProjectSuggestion[];
};

type HashtagPickerProps = {
  id: string;
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
};

function displayHashtag(value: string): string {
  const trimmedValue = value.trim().replace(/^#+/, "");
  return trimmedValue === "" ? "" : `#${trimmedValue}`;
}

export function HashtagPicker({ id, label, value, onChange }: HashtagPickerProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<ProjectSuggestion[]>([]);

  const selectedHashtag = useMemo(() => displayHashtag(value), [value]);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const apiBaseUrl = getApiBaseUrl();
    const token = getStoredAuthToken();

    if (!apiBaseUrl || !token) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      void axios
        .get<ProjectsResponse>(`${apiBaseUrl}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { query: query.replace(/^#+/, ""), limit: 8 },
          signal: controller.signal,
        })
        .then((response) => setSuggestions(response.data.projects ?? []))
        .catch((error) => {
          if (!axios.isAxiosError(error) || error.code !== "ERR_CANCELED") {
            setSuggestions([]);
          }
        });
    }, 180);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  function handleValueChange(nextValue: string) {
    const normalizedValue = nextValue.replace(/^#+/, "");
    setQuery(normalizedValue);
    onChange(normalizedValue);
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <input
        id={id}
        value={displayHashtag(query)}
        onChange={(event) => handleValueChange(event.target.value)}
        className={addPropertyInputClassName()}
      />
      {selectedHashtag ? (
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
            {selectedHashtag}
          </span>
        </div>
      ) : null}
      {suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.name}
              type="button"
              onClick={() => handleValueChange(suggestion.name)}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              {displayHashtag(suggestion.name)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
