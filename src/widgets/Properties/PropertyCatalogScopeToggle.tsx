"use client";

import type { UsePropertiesCatalogResult } from "@/features/properties/usePropertiesCatalog";
import { toggleDatabaseListScope } from "@/features/databaseList/databaseListScope";
import { OnlyMineToggle } from "@/widgets/DatabaseList/OnlyMineToggle";

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
  const { state, setListScope } = catalog;
  const isMineActive = state.listScope === "MINE";
  const isToggleDisabled = isAuthLoading || !isLoggedIn;

  return (
    <OnlyMineToggle
      isActive={isMineActive && !isToggleDisabled}
      disabled={isToggleDisabled}
      onToggle={() => {
        if (isToggleDisabled) {
          return;
        }
        setListScope(toggleDatabaseListScope(state.listScope));
      }}
    />
  );
}
