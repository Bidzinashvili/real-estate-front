"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePropertiesCatalog } from "@/features/properties/usePropertiesCatalog";
import { getApiBaseUrl } from "@/shared/lib/auth";
import { useCurrentUser } from "@/shared/hooks";
import {
  PropertyCatalogDesktopAside,
  PropertyCatalogMobileDrawer,
  PropertyCatalogMobileFiltersButton,
} from "@/widgets/Properties/propertyCatalogFilters";
import { PropertyCatalogScopeToggle } from "@/widgets/Properties/PropertyCatalogScopeToggle";
import { PropertyListingCard } from "@/widgets/Properties/PropertyListingCard";

export function PropertiesView() {
  const router = useRouter();
  const apiBaseUrl = getApiBaseUrl();
  const { user, isLoading: isAuthLoading } = useCurrentUser();
  const catalog = usePropertiesCatalog({ syncUrl: true });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const isLoggedIn = user !== null;

  const {
    properties,
    total,
    page,
    totalPages,
    isLoading,
    error,
    state,
    setSearchInput,
    setPage,
  } = catalog;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="hidden w-72 shrink-0 lg:block">
        <PropertyCatalogDesktopAside catalog={catalog} />
      </div>

      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={() => router.push("/properties/new")}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Add property
          </button>
          <PropertyCatalogScopeToggle
            catalog={catalog}
            isLoggedIn={isLoggedIn}
            isAuthLoading={isAuthLoading}
          />
          <div className="flex w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 shadow-sm sm:w-72">
            <input
              type="search"
              value={state.searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search properties…"
              className="h-7 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            {state.searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="inline-flex h-7 w-7 items-center justify-center text-slate-400 transition hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
            <span
              className="inline-flex h-7 w-7 items-center justify-center text-slate-400"
              aria-hidden
            >
              <Search className="h-4 w-4" />
            </span>
          </div>
          <div className="lg:hidden">
            <PropertyCatalogMobileFiltersButton
              catalog={catalog}
              onOpen={() => setMobileFiltersOpen(true)}
            />
          </div>
        </div>

        <PropertyCatalogMobileDrawer
          catalog={catalog}
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
        />

        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          {isLoading && (
            <p className="text-sm text-slate-600">Loading properties…</p>
          )}

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          {!isLoading && !error && total === 0 && (
            <p className="text-sm text-slate-600">No properties found.</p>
          )}

          {!isLoading && !error && total > 0 && (
            <>
              <p className="mb-3 text-xs text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-700">{properties.length}</span>{" "}
                of <span className="font-medium text-slate-700">{total}</span>
              </p>
              <div className="mt-2 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-5 lg:gap-6">
                {properties.map((property) => (
                  <PropertyListingCard
                    key={property.id}
                    property={property}
                    apiBaseUrl={apiBaseUrl}
                    onView={(id) => router.push(`/properties/${id}`)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {!isLoading && !error && total > 0 && (
          <div className="flex flex-col gap-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
