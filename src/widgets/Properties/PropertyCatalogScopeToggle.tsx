"use client";

import Link from "next/link";
import type { UsePropertiesCatalogResult } from "@/features/properties/usePropertiesCatalog";

type PropertyCatalogScopeToggleProps = {
  catalog: UsePropertiesCatalogResult;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
};

export function PropertyCatalogScopeToggle({
  catalog,
  isLoggedIn,
  isAuthLoading,
}: PropertyCatalogScopeToggleProps) {
  const { state, setShowMyProperties } = catalog;
  const showMyProperties = state.showMyProperties;
  const myPropertiesDisabled = isAuthLoading || !isLoggedIn;
  const isAllActive = !showMyProperties || myPropertiesDisabled;
  const isMyPropertiesActive = showMyProperties && !myPropertiesDisabled;

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="inline-flex rounded-full border border-slate-200 bg-slate-50/90 p-0.5 shadow-sm"
        role="group"
        aria-label="Property list scope"
      >
        <button
          type="button"
          onClick={() => setShowMyProperties(false)}
          aria-pressed={isAllActive}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
            isAllActive
              ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All
        </button>
        <button
          type="button"
          disabled={myPropertiesDisabled}
          onClick={() => setShowMyProperties(true)}
          aria-pressed={isMyPropertiesActive}
          title={
            myPropertiesDisabled
              ? "Sign in to filter by your properties"
              : undefined
          }
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
            isMyPropertiesActive
              ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          My Properties
        </button>
      </div>
      {!isAuthLoading && !isLoggedIn && (
        <p className="max-w-xs text-xs text-slate-500">
          <Link
            href="/sign-in"
            className="font-medium text-slate-700 underline-offset-2 hover:underline"
          >
            Sign in
          </Link>{" "}
          to see only your listings.
        </p>
      )}
    </div>
  );
}
