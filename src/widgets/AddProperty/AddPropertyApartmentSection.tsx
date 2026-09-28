"use client";

import { useState } from "react";
import type { DealType } from "@/features/properties/dealType";
import {
  bathroomCountChipOptions,
  DEFAULT_NEW_APARTMENT_BATHROOM_COUNT,
  DEFAULT_NEW_APARTMENT_KITCHEN_TYPE,
  KITCHEN_TYPE_FIELD_LABEL,
  KITCHEN_TYPE_OPTIONS,
  APARTMENT_PROJECT_FIELD_LABEL,
  RENOVATION_SELECT_OPTIONS,
} from "@/features/properties/addPropertyFormOptions";
import { isBuildingCondition } from "@/features/properties/types";
import { SelectField, TextField } from "@/widgets/AddProperty/addPropertyFormFields";
import { BuildingStructureFields } from "@/widgets/AddProperty/BuildingStructureFields";
import { MinRentalPeriodField } from "@/widgets/AddProperty/MinRentalPeriodField";
import { VerifiableBooleanField } from "@/widgets/AddProperty/VerifiableBooleanField";
import { ListingParkingFields } from "@/widgets/AddProperty/ListingParkingFields";
import { ListingBalconyFields } from "@/widgets/AddProperty/ListingBalconyFields";
import type { FormState } from "@/features/properties/addPropertyFormState";
import type { FormErrors } from "@/features/properties/addPropertyFormValidation";
import {
  normalizeManualBedroomsString,
  syncedBedroomsStringFromRoomsRaw,
} from "@/widgets/AddProperty/roomsBedroomsSyncHelpers";
import { FloorInput } from "@/shared/components/FloorInput";
import { HashtagPicker } from "@/shared/components/HashtagPicker";
import { NeedsVerificationToggle } from "@/shared/components/NeedsVerificationToggle";
import {
  applyBooleanUiState,
  booleanUiStateFromApartment,
  type ApartmentBooleanVerifiableField,
} from "@/features/properties/apartmentVerification";

type Props = {
  dealType: DealType;
  apartment: FormState["apartment"];
  fieldErrors: FormErrors;
  patchApartment: (patch: Partial<FormState["apartment"]>) => void;
};

function NumericVerificationRow({
  id,
  label,
  value,
  fieldKey,
  error,
  needsVerification,
  onValueChange,
  onNeedsVerificationChange,
}: {
  id: string;
  label: string;
  value: string;
  fieldKey: "parkingSpaces";
  error?: string;
  needsVerification: string[];
  onValueChange: (next: string) => void;
  onNeedsVerificationChange: (next: string[]) => void;
}) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <TextField
          id={id}
          label={label}
          type="number"
          value={value}
          onChange={(nextValue) => {
            onValueChange(nextValue);
            if (nextValue.trim() !== "") {
              onNeedsVerificationChange(
                needsVerification.filter((activeField) => activeField !== fieldKey),
              );
            }
          }}
          error={error}
        />
      </div>
      <NeedsVerificationToggle
        fieldKey={fieldKey}
        activeFields={needsVerification}
        onChange={onNeedsVerificationChange}
      />
    </div>
  );
}

export function AddPropertyApartmentSection({
  dealType,
  apartment,
  fieldErrors,
  patchApartment,
}: Props) {
  const [isBedroomsManuallyEdited, setIsBedroomsManuallyEdited] = useState(false);
  const isRentalDeal = dealType === "RENT" || dealType === "DAILY_RENT";
  const bathroomCountValue =
    apartment.bathrooms.trim() === ""
      ? DEFAULT_NEW_APARTMENT_BATHROOM_COUNT
      : apartment.bathrooms;

  function handleRoomsChange(value: string) {
    patchApartment({
      rooms: value,
      ...(!isBedroomsManuallyEdited
        ? { bedrooms: syncedBedroomsStringFromRoomsRaw(value) }
        : {}),
    });
  }

  function handleBedroomsChange(value: string) {
    if (value.trim() === "") {
      setIsBedroomsManuallyEdited(false);
      patchApartment({
        bedrooms: syncedBedroomsStringFromRoomsRaw(apartment.rooms),
      });
      return;
    }
    setIsBedroomsManuallyEdited(true);
    patchApartment({ bedrooms: normalizeManualBedroomsString(value) });
  }

  function handleBooleanFieldChange(
    fieldKey: ApartmentBooleanVerifiableField,
    nextState: ReturnType<typeof booleanUiStateFromApartment>,
  ) {
    const next = applyBooleanUiState(apartment.needsVerification, fieldKey, nextState);
    patchApartment({
      [fieldKey]: next.value,
      needsVerification: next.needsVerification,
    } as Partial<FormState["apartment"]>);
  }

  return (
    <section className="space-y-3 rounded-xl border border-border bg-muted p-4">
      <h2 className="text-sm font-semibold text-foreground">ბინის დეტალები</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <BuildingStructureFields
            idPrefix="apt"
            buildingCondition={apartment.buildingCondition}
            buildingAgeType={apartment.buildingAgeType}
            showAgeType
            onChange={({ buildingCondition, buildingAgeType }) => {
              if (!isBuildingCondition(buildingCondition)) {
                return;
              }
              patchApartment({
                buildingCondition,
                buildingAgeType,
              });
            }}
          />
        </div>
        <TextField
          id="aptTotalArea"
          label="საერთო ფართობი"
          type="number"
          value={apartment.totalArea}
          onChange={(value) => patchApartment({ totalArea: value })}
          required
          error={fieldErrors["apartment.totalArea"]}
        />
        <TextField
          id="aptRooms"
          label="ოთახები"
          type="number"
          value={apartment.rooms}
          onChange={handleRoomsChange}
          required
          error={fieldErrors["apartment.rooms"]}
        />
        <TextField
          id="aptBedrooms"
          label="საძინებლები"
          type="number"
          value={apartment.bedrooms}
          onChange={handleBedroomsChange}
          required
          error={fieldErrors["apartment.bedrooms"]}
        />
        <div className="sm:col-span-2">
          <FloorInput
            floorId="aptFloor"
            totalFloorsId="aptTotalFloors"
            floorValue={apartment.floor}
            totalFloorsValue={apartment.totalFloors}
            onFloorChange={(value) => patchApartment({ floor: value })}
            onTotalFloorsChange={(value) => patchApartment({ totalFloors: value })}
            floorError={fieldErrors["apartment.floor"]}
            totalFloorsError={fieldErrors["apartment.totalFloors"]}
            required
          />
        </div>
        <TextField
          id="aptCeilingHeight"
          label="ჭერის სიმაღლე"
          type="number"
          value={apartment.ceilingHeight}
          onChange={(value) => patchApartment({ ceilingHeight: value })}
          error={fieldErrors["apartment.ceilingHeight"]}
        />
        <SelectField
          id="aptBathrooms"
          label="სველი წერტილები"
          value={bathroomCountValue}
          onChange={(value) => patchApartment({ bathrooms: value })}
          options={bathroomCountChipOptions(bathroomCountValue)}
          error={fieldErrors["apartment.bathrooms"]}
        />
        <HashtagPicker
          id="aptProject"
          label={APARTMENT_PROJECT_FIELD_LABEL}
          value={apartment.project}
          onChange={(value) => patchApartment({ project: value })}
        />
        <SelectField
          id="aptRenovation"
          label="რემონტი"
          value={apartment.renovation}
          onChange={(value) => patchApartment({ renovation: value })}
          options={RENOVATION_SELECT_OPTIONS}
        />
        <SelectField
          id="aptKitchenType"
          label={KITCHEN_TYPE_FIELD_LABEL}
          value={apartment.kitchenType || DEFAULT_NEW_APARTMENT_KITCHEN_TYPE}
          onChange={(value) => patchApartment({ kitchenType: value })}
          options={KITCHEN_TYPE_OPTIONS}
        />
        {isRentalDeal && (
          <div className="sm:col-span-2">
            <MinRentalPeriodField
              idPrefix="apt"
              value={apartment.minRentalPeriod}
              onChange={(value) => patchApartment({ minRentalPeriod: value })}
              error={fieldErrors["apartment.minRentalPeriod"]}
            />
          </div>
        )}
        <div className="sm:col-span-2">
          <ListingBalconyFields
            idPrefix="apt"
            balconyCount={apartment.balconyCount}
            needsVerification={apartment.needsVerification}
            balconyArea={apartment.balconyArea}
            veranda={apartment.veranda}
            onChange={(nextBalcony) => patchApartment(nextBalcony)}
            balconyAreaError={fieldErrors["apartment.balconyArea"]}
          />
        </div>
        <ListingParkingFields
          idPrefix="apt"
          parking={apartment.parking}
          parkingTypes={apartment.parkingTypes}
          onChange={(nextParking) => patchApartment(nextParking)}
        />
        <NumericVerificationRow
          id="aptParking"
          label="პარკინგის ადგილები"
          value={apartment.parkingSpaces}
          fieldKey="parkingSpaces"
          error={fieldErrors["apartment.parkingSpaces"]}
          needsVerification={apartment.needsVerification}
          onValueChange={(value) => patchApartment({ parkingSpaces: value })}
          onNeedsVerificationChange={(nextFields) =>
            patchApartment({ needsVerification: nextFields })
          }
        />
        {(
          [
            { id: "aptElevator", label: "ლიფტი", key: "elevator" },
            { id: "aptCentralHeating", label: "ცენტრალური გათბობა", key: "centralHeating" },
            { id: "aptAirConditioner", label: "კონდიციონერი", key: "airConditioner" },
            { id: "aptFurnished", label: "ავეჯით", key: "furnished" },
            { id: "aptGoodView", label: "კარგი ხედი", key: "goodView" },
          ] as const
        ).map((field) => (
          <VerifiableBooleanField
            key={field.key}
            id={field.id}
            label={field.label}
            value={booleanUiStateFromApartment(
              apartment[field.key],
              apartment.needsVerification,
              field.key,
            )}
            onChange={(nextState) => handleBooleanFieldChange(field.key, nextState)}
          />
        ))}
        {dealType === "RENT" ? (
          <VerifiableBooleanField
            id="aptPetsAllowed"
            label="ცხოველები დაიშვება"
            value={booleanUiStateFromApartment(
              apartment.petsAllowed,
              apartment.needsVerification,
              "petsAllowed",
            )}
            onChange={(nextState) => handleBooleanFieldChange("petsAllowed", nextState)}
          />
        ) : null}
      </div>
    </section>
  );
}
