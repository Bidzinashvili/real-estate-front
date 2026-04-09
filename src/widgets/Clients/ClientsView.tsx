"use client";

import { useState } from "react";
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
import type { DealType, ClientStatus } from "@/features/clients/clientEnums";

const SORT_OPTIONS: { value: ClientSortBy; label: string }[] = [
  { value: "createdAt", label: "Created" },
  { value: "updatedAt", label: "Updated" },
  { value: "name", label: "Name" },
];

const ORDER_OPTIONS: { value: ClientSortOrder; label: string }[] = [
  { value: "desc", label: "Desc" },
  { value: "asc", label: "Asc" },
];

const DEAL_TYPE_OPTIONS = [
  { value: "", label: "All deal types" },
  ...DEAL_TYPES.map((dealType) => ({
    value: dealType,
    label: DEAL_TYPE_LABELS[dealType],
  })),
];

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  ...CLIENT_STATUSES.map((clientStatus) => ({
    value: clientStatus,
    label: CLIENT_STATUS_LABELS[clientStatus],
  })),
];

const STATUS_BADGE_CLASSES: Record<ClientStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  ARCHIVED: "bg-slate-100 text-slate-600",
};

const DEFAULT_LIMIT = 20;

export function ClientsView() {
  const router = useRouter();

  const [district, setDistrict] = useState("");
  const [budgetMinInput, setBudgetMinInput] = useState("");
  const [budgetMaxInput, setBudgetMaxInput] = useState("");
  const [dealTypeFilter, setDealTypeFilter] = useState<DealType | "">("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "">("");
  const [sortBy, setSortBy] = useState<ClientSortBy>("createdAt");
  const [order, setOrder] = useState<ClientSortOrder>("desc");
  const [page, setPage] = useState(1);

  const budgetMin = budgetMinInput !== "" ? Number(budgetMinInput) : undefined;
  const budgetMax = budgetMaxInput !== "" ? Number(budgetMaxInput) : undefined;

  const { clients, total, isLoading, error } = useClientsList({
    district: district.trim() || undefined,
    budgetMin: budgetMin !== undefined && Number.isFinite(budgetMin) ? budgetMin : undefined,
    budgetMax: budgetMax !== undefined && Number.isFinite(budgetMax) ? budgetMax : undefined,
    dealType: dealTypeFilter || undefined,
    status: statusFilter || undefined,
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
            Clients &amp; Leads
          </h1>
          <p className="max-w-md text-sm text-slate-600">
            Manage your CRM leads, track deal progress, and follow up with clients.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/clients/new")}
          className="inline-flex items-center justify-center self-start rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800 sm:self-auto"
        >
          Add client
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <input
          type="text"
          value={district}
          onChange={(event) => handleDistrictChange(event.target.value)}
          placeholder="District…"
          className="h-8 w-36 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
        />

        <input
          type="number"
          value={budgetMinInput}
          onChange={(event) => {
            setBudgetMinInput(event.target.value);
            setPage(1);
          }}
          placeholder="Budget min"
          className="h-8 w-32 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
        />

        <input
          type="number"
          value={budgetMaxInput}
          onChange={(event) => {
            setBudgetMaxInput(event.target.value);
            setPage(1);
          }}
          placeholder="Budget max"
          className="h-8 w-32 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
        />

        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">
          <InlineSelect
            aria-label="Filter by deal type"
            value={dealTypeFilter}
            onChange={handleDealTypeChange}
            options={DEAL_TYPE_OPTIONS}
          />
        </div>

        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">
          <InlineSelect
            aria-label="Filter by status"
            value={statusFilter}
            onChange={handleStatusChange}
            options={STATUS_OPTIONS}
          />
        </div>

        <div className="ml-auto flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">
          <span className="hidden font-medium sm:inline">Sort</span>
          <InlineSelect
            aria-label="Sort clients by"
            value={sortBy}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
          />
          <span className="h-4 w-px bg-slate-200" />
          <InlineSelect
            aria-label="Sort order"
            value={order}
            onChange={handleOrderChange}
            options={ORDER_OPTIONS}
          />
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        {isLoading && (
          <p className="text-sm text-slate-600">Loading clients…</p>
        )}

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && clients.length === 0 && (
          <p className="text-sm text-slate-600">No clients found.</p>
        )}

        {!isLoading && !error && clients.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-slate-50 text-left text-xs font-medium text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Deal</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-t border-slate-100 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {client.name}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {client.phones[0] ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {DEAL_TYPE_LABELS[client.dealType]}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[client.status]}`}
                      >
                        {CLIENT_STATUS_LABELS[client.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {client.budgetMin !== null || client.budgetMax !== null
                        ? [
                            client.budgetMin !== null ? client.budgetMin.toLocaleString() : null,
                            client.budgetMax !== null ? client.budgetMax.toLocaleString() : null,
                          ]
                            .filter(Boolean)
                            .join(" – ")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {client.districts[0] ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => router.push(`/clients/${client.id}`)}
                        className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800"
                      >
                        View
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
        <div className="flex items-center justify-between gap-3 text-xs text-slate-600">
          <span>
            Page {page} of {totalPages} &bull; {total} total
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
