"use client";

import { useMemo, useState } from "react";
import { Heart, MapPin, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDealTypeLabel } from "@/features/properties/dealType";
import { usePropertiesList } from "@/features/properties/usePropertiesList";
import type { Property } from "@/features/properties/types";
import { InlineSelect } from "@/shared/ui/InlineSelect";

const PAGE_SIZE = 10;

type SortBy = "createdAt" | "pricePublic" | "updatedAt";
type Order = "asc" | "desc";

const PROPERTY_SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "createdAt", label: "Newest" },
  { value: "pricePublic", label: "Price" },
  { value: "updatedAt", label: "Updated" },
];

const ORDER_OPTIONS: { value: Order; label: string }[] = [
  { value: "desc", label: "Desc" },
  { value: "asc", label: "Asc" },
];

function formatAddress(property: Property) {
  const parts = [
    property.address,
    property.district ? `(${property.district})` : null,
    property.city,
  ].filter(Boolean);

  return parts.join(" ");
}

function getPrimaryImage(property: Property): string {
  if (!property.images || property.images.length === 0) {
    return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";
  }

  return property.images[0];
}

export function PropertiesView() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [order, setOrder] = useState<Order>("desc");
  const [page, setPage] = useState(1);

  const { properties, isLoading, error } = usePropertiesList({ enabled: true });

  const normalizedSearch = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedSearch) return properties;

    return properties.filter((property) => {
      const target = [
        property.address,
        property.city,
        property.district,
        property.ownerName,
        property.ownerPhone,
        property.cadastralCode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return target.includes(normalizedSearch);
    });
  }, [normalizedSearch, properties]);

  const sorted = useMemo(() => {
    const sign = order === "asc" ? 1 : -1;

    return [...filtered].sort((a, b) => {
      if (sortBy === "pricePublic") return (a.pricePublic - b.pricePublic) * sign;

      const aDate = new Date(a[sortBy]).getTime();
      const bDate = new Date(b[sortBy]).getTime();
      return (aDate - bDate) * sign;
    });
  }, [filtered, order, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const currentProperties = sorted.slice(startIndex, startIndex + PAGE_SIZE);

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
            Your properties, at a glance
          </h1>
          <p className="max-w-md text-sm text-slate-600">
            Search, sort, and scan key listing details quickly.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <div className="flex w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 shadow-sm sm:w-72">
            <input
              type="search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search properties..."
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

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">
            <span className="hidden font-medium sm:inline">Sort</span>
            <InlineSelect
              aria-label="Sort properties by"
              value={sortBy}
              onChange={(value) => handleSortChange(value as SortBy)}
              options={PROPERTY_SORT_OPTIONS}
            />
            <span className="h-4 w-px bg-slate-200" />
            <InlineSelect
              aria-label="Sort order"
              value={order}
              onChange={(value) => handleOrderChange(value as Order)}
              options={ORDER_OPTIONS}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        {isLoading && <p className="text-sm text-slate-600">Loading properties…</p>}

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && sorted.length === 0 && (
          <p className="text-sm text-slate-600">
            No properties match your search.
          </p>
        )}

        {!isLoading && !error && sorted.length > 0 && (
          <div className="mt-2 grid justify-items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
            {currentProperties.map((property) => (
              <article
                key={property.id}
                className="w-full max-w-[400px] overflow-hidden rounded-3xl bg-[#dfe8e4] shadow-sm ring-1 ring-slate-200"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={getPrimaryImage(property)}
                    alt={formatAddress(property)}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                    {formatDealTypeLabel(property.dealType)}
                  </div>
                  <button
                    type="button"
                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white"
                    aria-label="Favorite"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2.5 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-2xl font-semibold tracking-tight text-slate-900">
                      {property.pricePublic.toLocaleString()} ₾
                    </p>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      {property.propertyType}
                    </span>
                  </div>

                  <p className="truncate text-lg font-semibold text-slate-800">
                    {property.description || formatAddress(property)}
                  </p>

                  <p className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    {formatAddress(property)}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-slate-700">
                      {property.apartment?.rooms ?? "—"} rooms
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-slate-700">
                      {property.apartment?.bedrooms ?? "—"} bedrooms
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-slate-700">
                      {property.apartment?.totalArea ?? "—"} m2
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <p className="text-xs text-slate-500">
                      {property.ownerName} • {property.ownerPhone || "—"}
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push(`/properties/${property.id}`)}
                      className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800"
                    >
                      View
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {!isLoading && !error && sorted.length > 0 && (
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

