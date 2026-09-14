"use client";

import { useEffect, useState } from "react";
import {
  getClientProfiles,
  linkClientNoteToProfile,
} from "@/features/clientProfiles/api";
import { CLIENT_PROFILES_SEARCH_DEBOUNCE_MS } from "@/features/clientProfiles/getClientProfilesQuery";
import type { ClientProfileListItem } from "@/features/clientProfiles/types";
import type { ClientDetail } from "@/features/clients/types";

type ClientProfileLinkSectionProps = {
  client: ClientDetail;
  onLinked: () => void;
};

export function ClientProfileLinkSection({
  client,
  onLinked,
}: ClientProfileLinkSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [results, setResults] = useState<ClientProfileListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addPhones, setAddPhones] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentProfileId = client.clientProfileId ?? client.clientProfile?.id ?? null;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, CLIENT_PROFILES_SEARCH_DEBOUNCE_MS);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (!debouncedSearch) {
      setResults([]);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const runSearch = async () => {
      setIsSearching(true);
      setError(null);
      try {
        const response = await getClientProfiles(
          { search: debouncedSearch, page: 1, limit: 10 },
          { signal: controller.signal },
        );
        if (!cancelled) {
          setResults(response.profiles);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
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
  }, [debouncedSearch, isOpen]);

  async function handleLink(profileId: string) {
    setIsSaving(true);
    setError(null);
    try {
      await linkClientNoteToProfile(profileId, {
        clientId: client.id,
        addPhones,
      });
      setIsOpen(false);
      setSearchInput("");
      onLinked();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "კლიენტის პროფილთან მიბმა ვერ მოხერხდა.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            კლიენტის პროფილი
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            ეს მოთხოვნა პიროვნების პროფილს უკავშირდება.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsOpen((previous) => !previous);
            setError(null);
          }}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
        >
          {currentProfileId ? "პროფილის შეცვლა" : "კლიენტის პროფილთან მიბმა"}
        </button>
      </div>

      <div className="mt-4">
        {currentProfileId ? (
          <p className="text-sm text-muted-foreground">
            ეს მოთხოვნა პროფილთან არის მიბმული. პროფილის ბმული ზემოთაა.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            ამ მოთხოვნას პროფილი არ აქვს მიბმული.
          </p>
        )}
      </div>

      {isOpen ? (
        <div className="mt-4 space-y-3 rounded-lg border border-dashed border-border p-3">
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="ძებნა სახელით ან ნომრით…"
            className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <label className="inline-flex items-center gap-1.5 text-xs font-medium">
            <input
              type="checkbox"
              checked={addPhones}
              onChange={(event) => setAddPhones(event.target.checked)}
            />
            ამ მოთხოვნის ნომრების დამატება პროფილზე
          </label>
          {isSearching ? (
            <p className="text-xs text-muted-foreground">იძებნება…</p>
          ) : null}
          {results.length > 0 ? (
            <ul className="space-y-1">
              {results.map((item) => {
                const isCurrent = item.id === currentProfileId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={isSaving || isCurrent}
                      onClick={() => void handleLink(item.id)}
                      className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-60"
                    >
                      <span className="font-medium text-foreground">
                        {item.name?.trim() || "უსახელო პროფილი"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isCurrent
                          ? "მიმდინარე"
                          : (item.primaryPhone ?? `${item.occurrenceCount}-ჯერ`)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : debouncedSearch && !isSearching ? (
            <p className="text-xs text-muted-foreground">პროფილი ვერ მოიძებნა.</p>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
