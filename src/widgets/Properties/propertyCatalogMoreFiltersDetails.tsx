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
    <details className="group rounded-lg border border-slate-200 bg-slate-50/80 open:bg-white">
      <summary className="cursor-pointer list-none px-3 py-2.5 text-sm font-medium text-slate-800 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          More filters
          <span className="text-xs font-normal text-slate-500">Exact fields</span>
        </span>
      </summary>
      <div className="space-y-4 border-t border-slate-100 p-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className={LABEL_CLASS}>Rooms</span>
            <input
              type="text"
              inputMode="numeric"
              value={state.rooms}
              onChange={(e) => catalog.setRooms(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <span className={LABEL_CLASS}>Bedrooms</span>
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
          <span className={LABEL_CLASS}>Floor</span>
          <input
            type="text"
            inputMode="numeric"
            value={state.floor}
            onChange={(e) => catalog.setFloor(e.target.value)}
            className={INPUT_CLASS}
            placeholder="Apartment or commercial"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className={LABEL_CLASS}>Yard area</span>
            <input
              type="text"
              inputMode="decimal"
              value={state.yardArea}
              onChange={(e) => catalog.setYardArea(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <span className={LABEL_CLASS}>House area</span>
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
          <span className={LABEL_CLASS}>Land area</span>
          <input
            type="text"
            inputMode="decimal"
            value={state.landArea}
            onChange={(e) => catalog.setLandArea(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <span className={LABEL_CLASS}>Commercial area</span>
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
