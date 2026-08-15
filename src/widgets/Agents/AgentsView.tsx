"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAgentsList } from "@/features/agents/useAgentsList";
import { InlineSelect } from "@/shared/ui/InlineSelect";

const PAGE_SIZE = 10;

type SortBy = "fullName" | "email" | "createdAt";
type Order = "asc" | "desc";

const AGENT_SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "createdAt", label: "უახლესი" },
  { value: "fullName", label: "სახელი" },
  { value: "email", label: "ელფოსტა" },
];

const ORDER_OPTIONS: { value: Order; label: string }[] = [
  { value: "desc", label: "კლებადი" },
  { value: "asc", label: "ზრდადი" },
];

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
            თქვენი აგენტები
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            მოძებნეთ და გაფილტრეთ აგენტები და სწრაფად გადადით დეტალებზე.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={() => router.push("/agents/new")}
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-primary/90"
          >
            აგენტის დამატება
          </button>

          <div className="flex w-full items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 shadow-sm sm:w-72">
            <input
              type="search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="ძიება..."
              className="h-7 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition hover:text-foreground"
                aria-label="ძიების გასუფთავება"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSearchChange(search)}
              className="inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition hover:text-foreground"
              aria-label="ძიება"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground shadow-sm">
            <span className="hidden font-medium sm:inline">სორტირება</span>
            <InlineSelect
              aria-label="აგენტების სორტირება"
              value={sortBy}
              onChange={(value) => handleSortChange(value as SortBy)}
              options={AGENT_SORT_OPTIONS}
            />
            <span className="h-4 w-px bg-border" />
            <InlineSelect
              aria-label="სორტირების მიმართულება"
              value={order}
              onChange={(value) => handleOrderChange(value as Order)}
              options={ORDER_OPTIONS}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        {isLoading && (
          <p className="text-sm text-muted-foreground">აგენტები იტვირთება…</p>
        )}

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && filteredAgents.length === 0 && (
          <p className="text-sm text-muted-foreground">
            აგენტები ჯერ არ გაქვთ.
          </p>
        )}

        {!isLoading && !error && filteredAgents.length > 0 && (
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-muted text-left text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">სახელი</th>
                  <th className="px-4 py-3">ელფოსტა</th>
                  <th className="px-4 py-3">ტელეფონი</th>
                  <th className="px-4 py-3">შემოუერთდა</th>
                  <th className="px-4 py-3 text-right">მოქმედებები</th>
                </tr>
              </thead>
              <tbody>
                {currentAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    className="border-t border-border hover:bg-muted/60"
                  >
                    <td className="px-4 py-3 text-foreground">
                      {agent.fullName}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {agent.email}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {agent.phone || "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => router.push(`/agents/${agent.id}`)}
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

      {!isLoading && !error && filteredAgents.length > 0 && (
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            გვერდი {safePage} / {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              წინა
            </button>
            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() =>
                setPage((prev) => Math.min(totalPages, prev + 1))
              }
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


