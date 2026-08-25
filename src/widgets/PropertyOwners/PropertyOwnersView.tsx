"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePropertyOwnersList } from "@/features/propertyOwners/usePropertyOwnersList";
import {
  PROPERTY_OWNERS_PAGE_LIMIT,
  PROPERTY_OWNERS_SEARCH_DEBOUNCE_MS,
} from "@/features/propertyOwners/getPropertyOwnersQuery";
import {
  PROPERTY_OWNERS_NEW_HREF,
  propertyOwnerHref,
} from "@/features/propertyOwners/propertyOwnerRoutes";
import { primaryContactFromList } from "@/features/propertyOwners/ownerContactDrafts";

export function PropertyOwnersView() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, PROPERTY_OWNERS_SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  const { owners, total, isLoading, error } = usePropertyOwnersList({
    search: debouncedSearch || undefined,
    page,
    limit: PROPERTY_OWNERS_PAGE_LIMIT,
  });

  const totalPages = Math.max(1, Math.ceil(total / PROPERTY_OWNERS_PAGE_LIMIT));

  return (
    <>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            მეპატრონეები
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            მართეთ მეპატრონის პროფილები, ნომრები და დაკავშირებული განცხადებები.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(PROPERTY_OWNERS_NEW_HREF)}
          className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-primary/90"
        >
          მეპატრონის დამატება
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="ძებნა სახელით ან ნომრით…"
          className="h-8 w-full max-w-sm rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">მეპატრონეები იტვირთება…</p>
        ) : null}

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        {!isLoading && !error && owners.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {debouncedSearch
              ? "მეპატრონე ვერ მოიძებნა."
              : "მეპატრონეები ჯერ არ გაქვთ."}
          </p>
        ) : null}

        {!isLoading && !error && owners.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-muted text-left text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">სახელი</th>
                  <th className="px-4 py-3">მთავარი ნომერი</th>
                  <th className="px-4 py-3">კონტაქტები</th>
                  <th className="px-4 py-3">განცხადებები</th>
                  <th className="hidden px-4 py-3 md:table-cell">კომენტარი</th>
                  <th className="px-4 py-3 text-right">მოქმედება</th>
                </tr>
              </thead>
              <tbody>
                {owners.map((owner) => {
                  const primary = primaryContactFromList(owner.contacts);
                  const commentPreview = owner.comment?.trim() ?? "";
                  return (
                    <tr
                      key={owner.id}
                      className="cursor-pointer border-t border-border hover:bg-muted/60"
                      onClick={() => router.push(propertyOwnerHref(owner.id))}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {owner.name}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {primary?.phone ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {owner.contacts.length}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {owner.propertyCount}
                      </td>
                      <td className="hidden max-w-xs truncate px-4 py-3 text-muted-foreground md:table-cell">
                        {commentPreview || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            router.push(propertyOwnerHref(owner.id));
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
              onClick={() => setPage((previousPage) => Math.min(totalPages, previousPage + 1))}
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
