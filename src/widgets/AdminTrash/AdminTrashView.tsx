"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Trash2, X } from "lucide-react";
import { useCurrentUser } from "@/shared/hooks";
import { InlineSelect } from "@/shared/ui/InlineSelect";
import { formatPageOfWithTotal } from "@/shared/i18n/ui";
import { formatLifecycleDateTime } from "@/features/lifecycle/formatLifecycleDate";
import { isRecordArchived } from "@/features/lifecycle/isRecordArchived";
import { PROPERTY_STATUS_LABELS } from "@/features/properties/propertyStatus";
import { CLIENT_STATUS_LABELS } from "@/features/clients/clientEnums";
import { TRASH_COPY } from "@/features/adminTrash/trashCopy";
import {
  parseTrashSortBy,
  parseTrashSortOrder,
} from "@/features/adminTrash/normalizers";
import type {
  TrashClientRecord,
  TrashPropertyRecord,
  TrashSortBy,
  TrashSortOrder,
} from "@/features/adminTrash/types";
import { useTrashList } from "@/features/adminTrash/useTrashList";
import { useTrashSummary } from "@/features/adminTrash/useTrashSummary";
import { TrashRecordActions } from "@/widgets/AdminTrash/TrashRecordActions";

type TrashTab = "properties" | "clients";

const PAGE_SIZE = 20;

const SORT_OPTIONS: { value: TrashSortBy; label: string }[] = [
  { value: "deletedAt", label: TRASH_COPY.sortDeletedAt },
  { value: "createdAt", label: TRASH_COPY.sortCreatedAt },
  { value: "updatedAt", label: TRASH_COPY.sortUpdatedAt },
];

const ORDER_OPTIONS: { value: TrashSortOrder; label: string }[] = [
  { value: "desc", label: TRASH_COPY.orderDesc },
  { value: "asc", label: TRASH_COPY.orderAsc },
];

function parseTrashTab(value: string | null): TrashTab {
  return value === "clients" ? "clients" : "properties";
}

function formatStatusLabel(kind: TrashTab, status: string): string {
  if (kind === "properties") {
    return PROPERTY_STATUS_LABELS[status as keyof typeof PROPERTY_STATUS_LABELS] ?? status;
  }
  return CLIENT_STATUS_LABELS[status as keyof typeof CLIENT_STATUS_LABELS] ?? status;
}

export function AdminTrashView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const isAdmin = user?.role === "ADMIN";
  const activeTab = parseTrashTab(searchParams.get("tab"));
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const appliedSearch = (searchParams.get("search") ?? "").trim();
  const sortBy = parseTrashSortBy(searchParams.get("sortBy"));
  const order = parseTrashSortOrder(searchParams.get("order"));
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const { summary } = useTrashSummary(isAdmin);
  const propertyList = useTrashList<TrashPropertyRecord>(
    "properties",
    {
      search: appliedSearch || undefined,
      sortBy,
      order,
      page,
      limit: PAGE_SIZE,
    },
    isAdmin && activeTab === "properties",
  );
  const clientList = useTrashList<TrashClientRecord>(
    "clients",
    {
      search: appliedSearch || undefined,
      sortBy,
      order,
      page,
      limit: PAGE_SIZE,
    },
    isAdmin && activeTab === "clients",
  );

  const activeList = activeTab === "properties" ? propertyList : clientList;
  const totalPages = Math.max(1, Math.ceil(activeList.total / PAGE_SIZE));

  const queryForHref = useMemo(() => {
    const params = new URLSearchParams();
    if (appliedSearch) {
      params.set("search", appliedSearch);
    }
    if (sortBy !== "deletedAt") {
      params.set("sortBy", sortBy);
    }
    if (order !== "desc") {
      params.set("order", order);
    }
    return params;
  }, [appliedSearch, order, sortBy]);

  function trashHref(tab: TrashTab, nextPage?: number): string {
    const params = new URLSearchParams(queryForHref.toString());
    if (tab === "clients") {
      params.set("tab", "clients");
    }
    if (nextPage && nextPage > 1) {
      params.set("page", String(nextPage));
    }
    const queryString = params.toString();
    return queryString ? `/admin/trash?${queryString}` : "/admin/trash";
  }

  function replaceQuery(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    params.delete("page");
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  if (!isUserLoading && user && !isAdmin) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {TRASH_COPY.forbidden}
      </p>
    );
  }

  const isForbidden = activeList.statusCode === 403;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="inline-flex items-center gap-2 text-2xl font-semibold tracking-tight text-destructive sm:text-3xl">
            <Trash2 className="h-7 w-7" aria-hidden />
            {TRASH_COPY.pageTitle}
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            {TRASH_COPY.pageDescription}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:w-auto">
          <div className="rounded-2xl bg-card px-4 py-3 shadow-sm ring-1 ring-border">
            <p className="text-xs text-muted-foreground">{TRASH_COPY.propertiesCount}</p>
            <p className="text-lg font-semibold text-foreground">
              {summary?.properties ?? "—"}
            </p>
          </div>
          <div className="rounded-2xl bg-card px-4 py-3 shadow-sm ring-1 ring-border">
            <p className="text-xs text-muted-foreground">{TRASH_COPY.clientsCount}</p>
            <p className="text-lg font-semibold text-foreground">
              {summary?.clients ?? "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="inline-flex rounded-full border border-border bg-muted/90 p-0.5 shadow-sm"
          role="tablist"
          aria-label={TRASH_COPY.pageTitle}
        >
          <Link
            href={trashHref("properties")}
            role="tab"
            aria-selected={activeTab === "properties"}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              activeTab === "properties"
                ? "bg-card text-foreground shadow-sm ring-1 ring-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {TRASH_COPY.propertiesTab}
          </Link>
          <Link
            href={trashHref("clients")}
            role="tab"
            aria-selected={activeTab === "clients"}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              activeTab === "clients"
                ? "bg-card text-foreground shadow-sm ring-1 ring-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {TRASH_COPY.clientsTab}
          </Link>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
          <form
            className="flex w-full items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 shadow-sm sm:w-72"
            onSubmit={(event) => {
              event.preventDefault();
              replaceQuery({ search: searchInput.trim() || null });
            }}
          >
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={TRASH_COPY.searchPlaceholder}
              className="h-7 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  replaceQuery({ search: null });
                }}
                className="inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition hover:text-foreground"
                aria-label="ძიების გასუფთავება"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ) : null}
            <button
              type="submit"
              className="inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition hover:text-foreground"
              aria-label="ძიება"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground shadow-sm">
            <span className="hidden font-medium sm:inline">{TRASH_COPY.sortLabel}</span>
            <InlineSelect
              aria-label={TRASH_COPY.sortLabel}
              value={sortBy}
              onChange={(value) => replaceQuery({ sortBy: value === "deletedAt" ? null : value })}
              options={SORT_OPTIONS}
            />
            <span className="h-4 w-px bg-border" />
            <InlineSelect
              aria-label="სორტირების მიმართულება"
              value={order}
              onChange={(value) => replaceQuery({ order: value === "desc" ? null : value })}
              options={ORDER_OPTIONS}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-destructive/20">
        {isForbidden ? (
          <p className="text-sm text-destructive" role="alert">
            {TRASH_COPY.forbidden}
          </p>
        ) : null}
        {activeList.isLoading ? (
          <p className="text-sm text-muted-foreground">იტვირთება…</p>
        ) : null}
        {activeList.error && !isForbidden ? (
          <p className="text-sm text-destructive" role="alert">
            {activeList.error}
          </p>
        ) : null}
        {!activeList.isLoading && !activeList.error && activeList.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {activeTab === "properties"
              ? TRASH_COPY.emptyProperties
              : TRASH_COPY.emptyClients}
          </p>
        ) : null}
        {!activeList.isLoading && !isForbidden && activeList.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-muted text-left text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">
                    {activeTab === "properties" ? "მისამართი" : "სახელი"}
                  </th>
                  <th className="px-4 py-3">{TRASH_COPY.statusLabel}</th>
                  <th className="px-4 py-3">{TRASH_COPY.deletedAtLabel}</th>
                  <th className="px-4 py-3">{TRASH_COPY.agentLabel}</th>
                  <th className="px-4 py-3 text-right">მოქმედებები</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === "properties"
                  ? propertyList.items.map((item) => (
                      <tr key={item.id} className="border-t border-border">
                        <td className="px-4 py-3 text-foreground">
                          <div className="space-y-1">
                            <Link
                              href={`/admin/trash/properties/${item.id}`}
                              className="font-medium hover:underline"
                            >
                              {item.address || item.district || item.city || item.id}
                            </Link>
                            {isRecordArchived(item) ? (
                              <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                {TRASH_COPY.deletedFromArchive}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {formatStatusLabel("properties", item.status) || "—"}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {formatLifecycleDateTime(item.deletedAt) ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {item.agent?.fullName || item.agent?.email || "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <TrashRecordActions
                            kind="property"
                            recordId={item.id}
                            archivedAt={item.archivedAt}
                            onCompleted={propertyList.refetch}
                          />
                        </td>
                      </tr>
                    ))
                  : clientList.items.map((item) => (
                      <tr key={item.id} className="border-t border-border">
                        <td className="px-4 py-3 text-foreground">
                          <div className="space-y-1">
                            <Link
                              href={`/admin/trash/clients/${item.id}`}
                              className="font-medium hover:underline"
                            >
                              {item.name || item.id}
                            </Link>
                            {isRecordArchived(item) ? (
                              <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                {TRASH_COPY.deletedFromArchive}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {formatStatusLabel("clients", item.status) || "—"}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {formatLifecycleDateTime(item.deletedAt) ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {item.agent?.fullName || item.agent?.email || "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <TrashRecordActions
                            kind="client"
                            recordId={item.id}
                            archivedAt={item.archivedAt}
                            onCompleted={clientList.refetch}
                          />
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      {!activeList.isLoading && activeList.total > 0 ? (
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{formatPageOfWithTotal(page, totalPages, activeList.total)}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => router.push(trashHref(activeTab, page - 1))}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              წინა
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => router.push(trashHref(activeTab, page + 1))}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              შემდეგი
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
