"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAgentsList } from "@/features/agents/useAgentsList";

const PAGE_SIZE = 10;

type SortBy = "fullName" | "email" | "createdAt";
type Order = "asc" | "desc";

export function AgentsView() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [order, setOrder] = useState<Order>("desc");
  const [page, setPage] = useState(1);

  const { agents, isLoading, error } = useAgentsList({
    enabled: true,
    sortBy,
    order,
  });

  const normalizedSearch = search.trim().toLowerCase();
  const filteredAgents = normalizedSearch
    ? agents.filter((agent) => {
        const target = `${agent.fullName} ${agent.email} ${agent.phone ?? ""}`.toLowerCase();
        return target.includes(normalizedSearch);
      })
    : agents;

  const totalPages = Math.max(1, Math.ceil(filteredAgents.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const currentAgents = filteredAgents.slice(startIndex, startIndex + PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (value: SortBy) => {
    setSortBy(value);
    setPage(1);
  };

  const handleOrderChange = (value: Order) => {
    setOrder(value);
    setPage(1);
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Your agents, at a glance
          </h1>
          <p className="max-w-md text-sm text-slate-600">
            Quickly search, filter, and jump into agent details. Keep your team
            and pipeline up to date.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={() => router.push("/agents/new")}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Add agent
          </button>

          <div className="flex w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 shadow-sm sm:w-72">
            <input
              type="search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search..."
              className="h-7 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="inline-flex h-7 w-7 items-center justify-center text-slate-400 transition hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSearchChange(search)}
              className="inline-flex h-7 w-7 items-center justify-center text-slate-400 transition hover:text-slate-700"
              aria-label="Search"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-sm">
            <span className="hidden font-medium sm:inline">Sort</span>
            <select
              value={sortBy}
              onChange={(event) =>
                handleSortChange(event.target.value as SortBy)
              }
              className="bg-transparent pr-2 text-xs outline-none"
            >
              <option value="createdAt">Newest</option>
              <option value="fullName">Name</option>
              <option value="email">Email</option>
            </select>
            <span className="h-4 w-px bg-slate-200" />
            <select
              value={order}
              onChange={(event) =>
                handleOrderChange(event.target.value as Order)
              }
              className="bg-transparent text-xs outline-none"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        {isLoading && (
          <p className="text-sm text-slate-600">Loading agents…</p>
        )}

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && filteredAgents.length === 0 && (
          <p className="text-sm text-slate-600">
            You don&apos;t have any agents yet.
          </p>
        )}

        {!isLoading && !error && filteredAgents.length > 0 && (
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-slate-50 text-left text-xs font-medium text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    className="border-t border-slate-100 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3 text-slate-900">
                      {agent.fullName}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {agent.email}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {agent.phone || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => router.push(`/agents/${agent.id}`)}
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

      {!isLoading && !error && filteredAgents.length > 0 && (
        <div className="flex items-center justify-between gap-3 text-xs text-slate-600">
          <span>
            Page {safePage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() =>
                setPage((prev) => Math.min(totalPages, prev + 1))
              }
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


