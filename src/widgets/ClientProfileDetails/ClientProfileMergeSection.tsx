"use client";

import { useEffect, useState } from "react";
import { getClientProfiles, mergeClientProfiles } from "@/features/clientProfiles/api";
import {
  CLIENT_PROFILES_SEARCH_DEBOUNCE_MS,
} from "@/features/clientProfiles/getClientProfilesQuery";
import type { ClientProfile, ClientProfileListItem } from "@/features/clientProfiles/types";
import { ConfirmDialog } from "@/widgets/ConfirmDialog/ConfirmDialog";

type ClientProfileMergeSectionProps = {
  profile: ClientProfile;
  onUpdated: () => void;
};

export function ClientProfileMergeSection({
  profile,
  onUpdated,
}: ClientProfileMergeSectionProps) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [results, setResults] = useState<ClientProfileListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [sourceProfile, setSourceProfile] = useState<ClientProfileListItem | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, CLIENT_PROFILES_SEARCH_DEBOUNCE_MS);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  useEffect(() => {
    if (!debouncedSearch) {
      setResults([]);
      setSearchError(null);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const runSearch = async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const response = await getClientProfiles(
          { search: debouncedSearch, page: 1, limit: 10 },
          { signal: controller.signal },
        );
        if (!cancelled) {
          setResults(
            response.profiles.filter(
              (item) => item.id !== profile.id,
            ),
          );
        }
      } catch (loadError) {
        if (!cancelled) {
          setSearchError(
            loadError instanceof Error
              ? loadError.message
              : "პროფილების ძებნა ვერ მოხერხდა.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    };

    void runSearch();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [debouncedSearch, profile.id]);

  async function handleMerge() {
    if (!sourceProfile) {
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await mergeClientProfiles(profile.id, {
        sourceProfileId: sourceProfile.id,
      });
      setSourceProfile(null);
      setSearchInput("");
      onUpdated();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "პროფილების გაერთიანება ვერ მოხერხდა.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h2 className="text-base font-semibold text-foreground">
        პროფილების გაერთიანება
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        მხოლოდ ადმინისტრატორი. არჩეული პროფილი გაერთიანდება ამ პროფილში.
      </p>

      <div className="mt-4 space-y-2">
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="მოსაძებნი პროფილი…"
          className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        {isSearching ? (
          <p className="text-xs text-muted-foreground">იძებნება…</p>
        ) : null}
        {searchError ? (
          <p className="text-xs text-destructive" role="alert">
            {searchError}
          </p>
        ) : null}
        {results.length > 0 ? (
          <ul className="space-y-1">
            {results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSourceProfile(item)}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <span className="font-medium text-foreground">
                    {item.name?.trim() || "უსახელო პროფილი"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.primaryPhone ?? `${item.occurrenceCount}-ჯერ`}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <ConfirmDialog
        open={sourceProfile !== null}
        title="პროფილების გაერთიანება"
        description={
          sourceProfile
            ? `გსურთ „${sourceProfile.name?.trim() || "უსახელო პროფილი"}“ გაერთიანდეს ამ პროფილში? ეს მოქმედება უკან ვერ დაბრუნდება.`
            : ""
        }
        confirmLabel="გაერთიანება"
        cancelLabel="გაუქმება"
        tone="danger"
        isProcessing={isSaving}
        error={error}
        onConfirm={() => void handleMerge()}
        onCancel={() => setSourceProfile(null)}
      />
    </section>
  );
}
