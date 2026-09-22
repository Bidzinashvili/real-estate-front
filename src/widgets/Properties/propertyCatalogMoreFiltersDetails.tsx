"use client";

import type { UsePropertiesCatalogResult } from "@/features/properties/usePropertiesCatalog";
import {
  PROPERTY_CATALOG_INPUT_CLASS as INPUT_CLASS,
  PROPERTY_CATALOG_LABEL_CLASS as LABEL_CLASS,
} from "@/widgets/Properties/propertyCatalogFilterSharedStyles";
import { NumericRangeFields } from "@/widgets/DatabaseList/NumericRangeFields";
import { MultiOptionChips, OptionChips } from "@/shared/ui/OptionChips";
import type {
  PropertyBalconyFilter,
  PropertyParkingFilter,
} from "@/features/properties/propertyCatalogUrlParams";
import {
  LISTING_PARKING_OPTIONS,
  LISTING_PARKING_TYPE_OPTIONS,
  parseListingParkingFilterValue,
} from "@/features/properties/listingParking";
import { LISTING_PARKING_FIELD_LABEL } from "@/shared/i18n/enumLabels";

const BALCONY_OPTIONS: ReadonlyArray<{
  value: PropertyBalconyFilter;
  label: string;
}> = [
  { value: "", label: "ყველა" },
  { value: "true", label: "არის" },
  { value: "false", label: "არ არის" },
];

const PARKING_FILTER_OPTIONS: ReadonlyArray<{
  value: PropertyParkingFilter;
  label: string;
}> = [{ value: "", label: "ყველა" }, ...LISTING_PARKING_OPTIONS];

type PropertyCatalogMoreFiltersDetailsProps = {
  catalog: UsePropertiesCatalogResult;
};

function parseBalconySelectValue(raw: string): PropertyBalconyFilter {
  if (raw === "true" || raw === "false") {
    return raw;
  }
  return "";
}

export function PropertyCatalogMoreFiltersDetails({
  catalog,
}: PropertyCatalogMoreFiltersDetailsProps) {
  const { state } = catalog;
  const showParkingTypes = state.parking !== "NO" && state.parking !== "TO_VERIFY";

  return (
    <div className="space-y-4">
      <NumericRangeFields
        label="ოთახები"
        fromValue={state.roomsFrom}
        toValue={state.roomsTo}
        onFromChange={catalog.setRoomsFrom}
        onToChange={catalog.setRoomsTo}
        fromAriaLabel="ოთახები დან"
        toAriaLabel="ოთახები მდე"
        inputClassName={INPUT_CLASS}
        labelClassName={LABEL_CLASS}
      />
      <div>
        <span className={LABEL_CLASS}>საძინებლები</span>
        <input
          type="text"
          inputMode="numeric"
          value={state.bedrooms}
          onChange={(event) => catalog.setBedrooms(event.target.value)}
          className={INPUT_CLASS}
        />
      </div>
      <NumericRangeFields
        label="სართული"
        fromValue={state.floorFrom}
        toValue={state.floorTo}
        onFromChange={catalog.setFloorFrom}
        onToChange={catalog.setFloorTo}
        fromAriaLabel="სართული დან"
        toAriaLabel="სართული მდე"
        inputClassName={INPUT_CLASS}
        labelClassName={LABEL_CLASS}
      />
      <div>
        <span className={LABEL_CLASS}>სართულიანობა</span>
        <input
          type="text"
          inputMode="numeric"
          value={state.totalFloors}
          onChange={(event) => catalog.setTotalFloors(event.target.value)}
          className={INPUT_CLASS}
          placeholder="სულ სართული"
        />
      </div>
      <OptionChips
        label="აივანი"
        labelClassName={LABEL_CLASS}
        aria-label="აივნით გაფილტვრა"
        value={state.balcony}
        onChange={(selectedValue) =>
          catalog.setBalcony(parseBalconySelectValue(selectedValue))
        }
        options={BALCONY_OPTIONS}
      />
      <div className="space-y-3">
        <OptionChips
          label={LISTING_PARKING_FIELD_LABEL}
          labelClassName={LABEL_CLASS}
          aria-label="პარკინგით გაფილტვრა"
          value={state.parking}
          onChange={(selectedValue) =>
            catalog.setParking(parseListingParkingFilterValue(selectedValue))
          }
          options={PARKING_FILTER_OPTIONS}
        />
        {showParkingTypes ? (
          <MultiOptionChips
            aria-label="პარკინგის ტიპით გაფილტვრა"
            value={state.parkingTypes}
            onChange={catalog.setParkingTypes}
            options={LISTING_PARKING_TYPE_OPTIONS}
          />
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className={LABEL_CLASS}>ეზოს ფართობი</span>
          <input
            type="text"
            inputMode="decimal"
            value={state.yardArea}
            onChange={(event) => catalog.setYardArea(event.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <span className={LABEL_CLASS}>სახლის ფართობი</span>
          <input
            type="text"
            inputMode="decimal"
            value={state.houseArea}
            onChange={(event) => catalog.setHouseArea(event.target.value)}
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
          onChange={(event) => catalog.setLandArea(event.target.value)}
          className={INPUT_CLASS}
        />
      </div>
      <div>
        <span className={LABEL_CLASS}>კომერციული ფართობი</span>
        <input
          type="text"
          inputMode="decimal"
          value={state.commercialArea}
          onChange={(event) => catalog.setCommercialArea(event.target.value)}
          className={INPUT_CLASS}
        />
      </div>
    </div>
  );
}
