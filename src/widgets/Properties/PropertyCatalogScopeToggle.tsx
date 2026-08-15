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
        className="inline-flex rounded-full border border-border bg-muted/90 p-0.5 shadow-sm"
        role="group"
        aria-label="განცხადებების სია"
      >
        <button
          type="button"
          onClick={() => setShowMyProperties(false)}
          aria-pressed={isAllActive}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
            isAllActive
              ? "bg-card text-foreground shadow-sm ring-1 ring-border/80"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          ყველა
        </button>
        <button
          type="button"
          disabled={myPropertiesDisabled}
          onClick={() => setShowMyProperties(true)}
          aria-pressed={isMyPropertiesActive}
          title={
            myPropertiesDisabled
              ? "შედით სისტემაში თქვენი განცხადებების სანახავად"
              : undefined
          }
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
            isMyPropertiesActive
              ? "bg-card text-foreground shadow-sm ring-1 ring-border/80"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          ჩემი განცხადებები
        </button>
      </div>
      {!isAuthLoading && !isLoggedIn && (
        <p className="max-w-xs text-xs text-muted-foreground">
          <Link
            href="/sign-in"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            შესვლა
          </Link>{" "}
          მხოლოდ თქვენი განცხადებების სანახავად.
        </p>
      )}
    </div>
  );
}
