"use client";

import { AdvancedSearchSheet } from "@/widgets/DatabaseList/AdvancedSearchSheet";
import type { UsePropertiesCatalogResult } from "@/features/properties/usePropertiesCatalog";
import { PropertyCatalogFilterFields } from "@/widgets/Properties/propertyCatalogFilterFields";

export function PropertyCatalogAdvancedSearch({
  catalog,
  open,
  onClose,
}: {
  catalog: UsePropertiesCatalogResult;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AdvancedSearchSheet
      open={open}
      title="გაფართოებული ძებნა"
      appliedCount={catalog.advancedFilterCount}
      onClose={onClose}
      onClear={() => catalog.resetAdvancedFilters()}
    >
      <PropertyCatalogFilterFields
        catalog={catalog}
        showMobileFooter
        onApplyMobile={onClose}
      />
    </AdvancedSearchSheet>
  );
}
