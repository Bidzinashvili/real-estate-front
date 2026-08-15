"use client";

import type { UsePropertiesCatalogResult } from "@/features/properties/usePropertiesCatalog";
import {
  PROPERTY_CATALOG_INPUT_CLASS as INPUT_CLASS,
  PROPERTY_CATALOG_LABEL_CLASS as LABEL_CLASS,
} from "@/widgets/Properties/propertyCatalogFilterSharedStyles";

type PropertyCatalogMoreFiltersDetailsProps = {
  catalog: UsePropertiesCatalogResult;
};

export function PropertyCatalogMoreFiltersDetails({
  catalog,
}: PropertyCatalogMoreFiltersDetailsProps) {
  const { state } = catalog;

  return (
    <details className="group rounded-lg border border-border bg-muted/80 open:bg-card">
      <summary className="cursor-pointer list-none px-3 py-2.5 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          მეტი ფილტრი
          <span className="text-xs font-normal text-muted-foreground">ზუსტი ველები</span>
        </span>
      </summary>
      <div className="space-y-4 border-t border-border p-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className={LABEL_CLASS}>ოთახები</span>
            <input
              type="text"
              inputMode="numeric"
              value={state.rooms}
              onChange={(e) => catalog.setRooms(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <span className={LABEL_CLASS}>საძინებლები</span>
            <input
              type="text"
              inputMode="numeric"
              value={state.bedrooms}
              onChange={(e) => catalog.setBedrooms(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div>
          <span className={LABEL_CLASS}>სართული</span>
          <input
            type="text"
            inputMode="numeric"
            value={state.floor}
            onChange={(e) => catalog.setFloor(e.target.value)}
            className={INPUT_CLASS}
            placeholder="ბინა ან კომერციული"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className={LABEL_CLASS}>ეზოს ფართობი</span>
            <input
              type="text"
              inputMode="decimal"
              value={state.yardArea}
              onChange={(e) => catalog.setYardArea(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <span className={LABEL_CLASS}>სახლის ფართობი</span>
            <input
              type="text"
              inputMode="decimal"
              value={state.houseArea}
              onChange={(e) => catalog.setHouseArea(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div>
          <span className={LABEL_CLASS}>მიწის ფართობი</span>
          <input
            type="text"
            inputMode="decimal"
            value={state.landArea}
            onChange={(e) => catalog.setLandArea(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <span className={LABEL_CLASS}>კომერციული ფართობი</span>
          <input
            type="text"
            inputMode="decimal"
            value={state.commercialArea}
            onChange={(e) => catalog.setCommercialArea(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      </div>
    </details>
  );
}
