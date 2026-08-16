"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClientsList } from "@/features/clients/useClientsList";
import { InlineSelect } from "@/shared/ui/InlineSelect";
import {
  DEAL_TYPES,
  CLIENT_STATUSES,
  DEAL_TYPE_LABELS,
  CLIENT_STATUS_LABELS,
} from "@/features/clients/clientEnums";
import type { ClientSortBy, ClientSortOrder } from "@/features/clients/getClientsQuery";
import {
  buildBudgetFilterParam,
  buildDistrictFilterParam,
  buildStatusFilterParam,
  DISTRICT_FILTER_DEBOUNCE_MS,
  DISTRICT_FILTER_MIN_LENGTH,
} from "@/features/clients/getClientsQuery";
import type { DealType, ClientStatus } from "@/features/clients/clientEnums";

const SORT_OPTIONS: { value: ClientSortBy; label: string }[] = [
  { value: "createdAt", label: "შექმნილია" },
  { value: "updatedAt", label: "განახლებულია" },
  { value: "name", label: "სახელი" },
];

const ORDER_OPTIONS: { value: ClientSortOrder; label: string }[] = [
  { value: "desc", label: "კლებადი" },
  { value: "asc", label: "ზრდადი" },
];

const DEAL_TYPE_OPTIONS = [
  { value: "", label: "ყველა გარიგება" },
  ...DEAL_TYPES.map((dealType) => ({
    value: dealType,
    label: DEAL_TYPE_LABELS[dealType],
  })),
];

const STATUS_OPTIONS = [
  { value: "", label: "ყველა სტატუსი" },
  ...CLIENT_STATUSES.map((clientStatus) => ({
    value: clientStatus,
    label: CLIENT_STATUS_LABELS[clientStatus],
  })),
];

const STATUS_BADGE_CLASSES: Record<ClientStatus, string> = {
  ACTIVE: "bg-success-muted text-success-foreground",
  IN_PROGRESS: "bg-primary/15 text-primary",
  ARCHIVED: "bg-muted text-muted-foreground",
};

const DEFAULT_LIMIT = 20;

export function ClientsView() {
  const router = useRouter();

  const [district, setDistrict] = useState("");
  const [debouncedDistrict, setDebouncedDistrict] = useState("");
  const [budgetMinInput, setBudgetMinInput] = useState("");
  const [budgetMaxInput, setBudgetMaxInput] = useState("");
  const [dealTypeFilter, setDealTypeFilter] = useState<DealType | "">("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "">("");
  const [sortBy, setSortBy] = useState<ClientSortBy>("createdAt");
  const [order, setOrder] = useState<ClientSortOrder>("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const trimmedDistrict = district.trim();
    if (Array.from(trimmedDistrict).length < DISTRICT_FILTER_MIN_LENGTH) {
      setDebouncedDistrict(district);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedDistrict(district);
    }, DISTRICT_FILTER_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [district]);

  const { clients, total, isLoading, error } = useClientsList({
    district: buildDistrictFilterParam(debouncedDistrict),
    budgetMin: buildBudgetFilterParam(budgetMinInput),
    budgetMax: buildBudgetFilterParam(budgetMaxInput),
    dealType: dealTypeFilter || undefined,
    status: buildStatusFilterParam(statusFilter),
    sortBy,
    order,
    page,
    limit: DEFAULT_LIMIT,
  });

  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_LIMIT));

  const handleFilterChange = () => {
    setPage(1);
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    handleFilterChange();
  };

  const handleDealTypeChange = (value: string) => {
    setDealTypeFilter(value as DealType | "");
    handleFilterChange();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as ClientStatus | "");
    handleFilterChange();
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as ClientSortBy);
    setPage(1);
  };

  const handleOrderChange = (value: string) => {
    setOrder(value as ClientSortOrder);
    setPage(1);
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            კლიენტები და ლიდები
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            მართეთ კლიენტები, თვალი ადევნეთ გარიგებებს და განაგრძეთ კომუნიკაცია.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Link
            href="/clients/invite-links"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            მოწვევის ბმულები
          </Link>
          <button
            type="button"
            onClick={() => router.push("/clients/new")}
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-primary/90"
          >
            კლიენტის დამატება
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        <input
          type="text"
          value={district}
          onChange={(event) => handleDistrictChange(event.target.value)}
          placeholder="უბანი…"
          className="h-8 w-36 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />

        <input
          type="number"
          value={budgetMinInput}
          onChange={(event) => {
            setBudgetMinInput(event.target.value);
            setPage(1);
          }}
          placeholder="მინ. ბიუჯეტი"
          className="h-8 w-32 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />

        <input
          type="number"
          value={budgetMaxInput}
          onChange={(event) => {
            setBudgetMaxInput(event.target.value);
            setPage(1);
          }}
          placeholder="მაქს. ბიუჯეტი"
          className="h-8 w-32 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />

        <div className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground shadow-sm">
          <InlineSelect
            aria-label="გარიგების ტიპით გაფილტვრა"
            value={dealTypeFilter}
            onChange={handleDealTypeChange}
            options={DEAL_TYPE_OPTIONS}
          />
        </div>

        <div className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground shadow-sm">
          <InlineSelect
            aria-label="სტატუსით გაფილტვრა"
            value={statusFilter}
            onChange={handleStatusChange}
            options={STATUS_OPTIONS}
          />
        </div>

        <div className="ml-auto flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground shadow-sm">
          <span className="hidden font-medium sm:inline">სორტირება</span>
          <InlineSelect
            aria-label="კლიენტების სორტირება"
            value={sortBy}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
          />
          <span className="h-4 w-px bg-border" />
          <InlineSelect
            aria-label="სორტირების მიმართულება"
            value={order}
            onChange={handleOrderChange}
            options={ORDER_OPTIONS}
          />
        </div>
      </div>

      <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        {isLoading && (
          <p className="text-sm text-muted-foreground">კლიენტები იტვირთება…</p>
        )}

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && clients.length === 0 && (
          <p className="text-sm text-muted-foreground">კლიენტები ვერ მოიძებნა.</p>
        )}

        {!isLoading && !error && clients.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-muted text-left text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">სახელი</th>
                  <th className="px-4 py-3">ტელეფონი</th>
                  <th className="px-4 py-3">გარიგება</th>
                  <th className="px-4 py-3">სტატუსი</th>
                  <th className="px-4 py-3">ბიუჯეტი</th>
                  <th className="px-4 py-3">უბანი</th>
                  <th className="px-4 py-3">შექმნილია</th>
                  <th className="px-4 py-3 text-right">მოქმედებები</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-t border-border hover:bg-muted/60"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {client.name}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {client.phones[0] ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {DEAL_TYPE_LABELS[client.dealType]}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[client.status]}`}
                      >
                        {CLIENT_STATUS_LABELS[client.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {client.budgetMin !== null || client.budgetMax !== null
                        ? [
                            client.budgetMin !== null ? client.budgetMin.toLocaleString() : null,
                            client.budgetMax !== null ? client.budgetMax.toLocaleString() : null,
                          ]
                            .filter(Boolean)
                            .join(" – ")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {client.districts[0] ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => router.push(`/clients/${client.id}`)}
                        className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-primary/90"
                      >
                        ნახვა
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!isLoading && !error && total > 0 && (
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            გვერდი {page} / {totalPages} • სულ {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              წინა
            </button>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              შემდეგი
            </button>
          </div>
        </div>
      )}
    </>
  );
}
