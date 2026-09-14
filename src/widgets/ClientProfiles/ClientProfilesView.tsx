"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useClientProfilesList } from "@/features/clientProfiles/useClientProfilesList";
import {
  CLIENT_PROFILES_PAGE_LIMIT,
  CLIENT_PROFILES_SEARCH_DEBOUNCE_MS,
} from "@/features/clientProfiles/getClientProfilesQuery";
import { clientProfileHref } from "@/features/clientProfiles/clientProfileRoutes";
import { formatClientProfileDealTypes } from "@/features/clientProfiles/display";
import { formatLifecycleDate } from "@/features/lifecycle/formatLifecycleDate";
import { InlineSelect } from "@/shared/ui/InlineSelect";
import { ClientProfileOccurrenceLines } from "@/widgets/ClientProfiles/ClientProfileOccurrenceLines";

const BLACKLIST_FILTER_OPTIONS = [
  { value: "all", label: "ყველა" },
  { value: "yes", label: "შავ სიაში" },
  { value: "no", label: "არაა შავ სიაში" },
] as const;

type BlacklistFilterValue = (typeof BLACKLIST_FILTER_OPTIONS)[number]["value"];

function blacklistQueryValue(
  filter: BlacklistFilterValue,
): boolean | undefined {
  if (filter === "yes") {
    return true;
  }
  if (filter === "no") {
    return false;
  }
  return undefined;
}

export function ClientProfilesView() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [blacklistFilter, setBlacklistFilter] =
    useState<BlacklistFilterValue>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, CLIENT_PROFILES_SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  const { profiles, total, isLoading, error } = useClientProfilesList({
    search: debouncedSearch || undefined,
    blacklisted: blacklistQueryValue(blacklistFilter),
    page,
    limit: CLIENT_PROFILES_PAGE_LIMIT,
  });

  const totalPages = Math.max(1, Math.ceil(total / CLIENT_PROFILES_PAGE_LIMIT));

  return (
    <>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          კლიენტის პროფილები
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          ერთი პიროვნება, მრავალი მოთხოვნა. ნომრით იდენტობა სააგენტოს მასშტაბით.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="ძებნა სახელით ან ნომრით…"
          className="h-8 w-full max-w-sm rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <InlineSelect
          value={blacklistFilter}
          onChange={(value) => {
            setBlacklistFilter(value as BlacklistFilterValue);
            setPage(1);
          }}
          options={BLACKLIST_FILTER_OPTIONS}
          aria-label="შავი სიის ფილტრი"
        />
      </div>

      <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">პროფილები იტვირთება…</p>
        ) : null}

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        {!isLoading && !error && profiles.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {debouncedSearch || blacklistFilter !== "all"
              ? "პროფილი ვერ მოიძებნა."
              : "კლიენტის პროფილები ჯერ არ გაქვთ."}
          </p>
        ) : null}

        {!isLoading && !error && profiles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-muted text-left text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">სახელი</th>
                  <th className="px-4 py-3">ნომერი</th>
                  <th className="px-4 py-3">გამოჩენა</th>
                  <th className="px-4 py-3">გარიგებები</th>
                  <th className="px-4 py-3">სტატუსი</th>
                  <th className="hidden px-4 py-3 md:table-cell">ბოლოს</th>
                  <th className="px-4 py-3 text-right">მოქმედება</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => {
                  const dealTypesLabel = formatClientProfileDealTypes(
                    profile.dealTypes,
                  );
                  const lastSeen = formatLifecycleDate(profile.lastSeenAt);
                  return (
                    <tr
                      key={profile.id}
                      className="cursor-pointer border-t border-border hover:bg-muted/60"
                      onClick={() => router.push(clientProfileHref(profile.id))}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {profile.name?.trim() || "უსახელო პროფილი"}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {profile.primaryPhone ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <ClientProfileOccurrenceLines
                          occurrenceCount={profile.occurrenceCount}
                          ownOccurrenceCount={profile.ownOccurrenceCount}
                        />
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {dealTypesLabel || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {profile.blacklisted ? (
                          <span className="inline-flex rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                            შავ სიაშია
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                        {lastSeen ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            router.push(clientProfileHref(profile.id));
                          }}
                          className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-primary/90"
                        >
                          ნახვა
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      {!isLoading && !error && total > 0 ? (
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            გვერდი {page} / {totalPages} • სულ {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((previousPage) => Math.max(1, previousPage - 1))}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              წინა
            </button>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() =>
                setPage((previousPage) => Math.min(totalPages, previousPage + 1))
              }
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              შემდეგი
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
