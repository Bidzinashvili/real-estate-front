"use client";

import {
  LISTING_PARKING_OPTIONS,
  LISTING_PARKING_TYPE_OPTIONS,
  nextListingParkingSelection,
  parkingTypesForParking,
  type ListingParkingSelection,
} from "@/features/properties/listingParking";
import type { ListingParking, ListingParkingType } from "@/features/properties/types";
import { LISTING_PARKING_FIELD_LABEL } from "@/shared/i18n/enumLabels";
import {
  MultiOptionChips,
  OptionChips,
  OPTION_CHIPS_FORM_LABEL_CLASS_NAME,
} from "@/shared/ui/OptionChips";

type ListingParkingFieldsProps = {
  idPrefix: string;
  parking: ListingParking;
  parkingTypes: ListingParkingType[];
  onChange: (next: ListingParkingSelection) => void;
  size?: "compact" | "default";
  labelClassName?: string;
};

export function ListingParkingFields({
  idPrefix,
  parking,
  parkingTypes,
  onChange,
  size = "default",
  labelClassName = OPTION_CHIPS_FORM_LABEL_CLASS_NAME,
}: ListingParkingFieldsProps) {
  const selectedParkingTypes = parkingTypesForParking(parking, parkingTypes);

  return (
    <div className="space-y-3 sm:col-span-2">
      <OptionChips
        id={`${idPrefix}-parking`}
        label={LISTING_PARKING_FIELD_LABEL}
        labelClassName={labelClassName}
        value={parking}
        onChange={(nextParking) =>
          onChange(nextListingParkingSelection(nextParking, selectedParkingTypes))
        }
        options={LISTING_PARKING_OPTIONS}
        size={size}
      />
      {parking === "YES" ? (
        <MultiOptionChips
          id={`${idPrefix}-parkingTypes`}
          aria-label="პარკინგის ტიპი"
          value={selectedParkingTypes}
          onChange={(nextParkingTypes) =>
            onChange({
              parking,
              parkingTypes: parkingTypesForParking(parking, nextParkingTypes),
            })
          }
          options={LISTING_PARKING_TYPE_OPTIONS}
          size={size}
        />
      ) : null}
    </div>
  );
}
