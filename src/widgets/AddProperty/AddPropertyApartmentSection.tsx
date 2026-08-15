"use client";

import { useState } from "react";
import type { DealType } from "@/features/properties/dealType";
import {
  BUILDING_CONDITION_OPTIONS,
  KITCHEN_TYPE_OPTIONS,
  RENOVATION_SELECT_OPTIONS,
} from "@/features/properties/addPropertyFormOptions";
import { SelectField, TextField } from "@/widgets/AddProperty/addPropertyFormFields";
import { MinRentalPeriodField } from "@/widgets/AddProperty/MinRentalPeriodField";
import { VerifiableBooleanField } from "@/widgets/AddProperty/VerifiableBooleanField";
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
import type { PropertyFieldLockKey, PropertyFieldLocks } from "@/features/matching/matchingEnums";
import { PreferenceLockButton } from "@/widgets/ClientForm/PreferenceLockButton";
import { readPropertyFieldLock } from "@/features/matching/persistEntityLock";
import type { LockState } from "@/features/matching/matchingEnums";

type Props = {
  dealType: DealType;
  apartment: FormState["apartment"];
  fieldErrors: FormErrors;
  fieldLocks: PropertyFieldLocks;
  patchApartment: (patch: Partial<FormState["apartment"]>) => void;
  patchFieldLocks: (patch: PropertyFieldLocks) => void;
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
  fieldKey: "parkingSpaces" | "balconyArea";
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
  fieldLocks,
  patchApartment,
  patchFieldLocks,
}: Props) {
  const [isBedroomsManuallyEdited, setIsBedroomsManuallyEdited] = useState(false);
  const isRentalDeal = dealType === "RENT" || dealType === "DAILY_RENT";

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

  function handleFieldLockChange(lockKey: PropertyFieldLockKey, nextLock: LockState) {
    patchFieldLocks({
      ...fieldLocks,
      [lockKey]: nextLock === "frozen" ? "frozen" : "none",
    });
  }

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-sm font-semibold text-slate-800">Apartment details</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <SelectField
              id="aptBuildingCondition"
              label="Building condition"
              value={apartment.buildingCondition}
              onChange={(value) => patchApartment({ buildingCondition: value })}
              options={BUILDING_CONDITION_OPTIONS}
            />
          </div>
          <div className="pt-7">
            <PreferenceLockButton
              value={readPropertyFieldLock(fieldLocks, "buildingCondition")}
              onChange={(nextLock) => handleFieldLockChange("buildingCondition", nextLock)}
            />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <SelectField
              id="aptKitchenType"
              label="Kitchen type"
              value={apartment.kitchenType}
              onChange={(value) => patchApartment({ kitchenType: value })}
              options={KITCHEN_TYPE_OPTIONS}
            />
          </div>
          <div className="pt-7">
            <PreferenceLockButton
              value={readPropertyFieldLock(fieldLocks, "kitchenType")}
              onChange={(nextLock) => handleFieldLockChange("kitchenType", nextLock)}
            />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <TextField
              id="aptTotalArea"
              label="Total area"
              type="number"
              value={apartment.totalArea}
              onChange={(value) => patchApartment({ totalArea: value })}
              required
              error={fieldErrors["apartment.totalArea"]}
            />
          </div>
          <div className="pt-7">
            <PreferenceLockButton
              value={readPropertyFieldLock(fieldLocks, "area")}
              onChange={(nextLock) => handleFieldLockChange("area", nextLock)}
            />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <TextField
              id="aptRooms"
              label="Rooms"
              type="number"
              value={apartment.rooms}
              onChange={handleRoomsChange}
              required
              error={fieldErrors["apartment.rooms"]}
            />
          </div>
          <div className="pt-7">
            <PreferenceLockButton
              value={readPropertyFieldLock(fieldLocks, "rooms")}
              onChange={(nextLock) => handleFieldLockChange("rooms", nextLock)}
            />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <TextField
              id="aptBedrooms"
              label="Bedrooms"
              type="number"
              value={apartment.bedrooms}
              onChange={handleBedroomsChange}
              required
              error={fieldErrors["apartment.bedrooms"]}
            />
          </div>
          <div className="pt-7">
            <PreferenceLockButton
              value={readPropertyFieldLock(fieldLocks, "bedrooms")}
              onChange={(nextLock) => handleFieldLockChange("bedrooms", nextLock)}
            />
          </div>
        </div>
        <div className="flex items-start gap-2 sm:col-span-2">
          <div className="flex-1">
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
          <div className="pt-7">
            <PreferenceLockButton
              value={readPropertyFieldLock(fieldLocks, "floor")}
              onChange={(nextLock) => handleFieldLockChange("floor", nextLock)}
            />
          </div>
        </div>
        <TextField
          id="aptCeilingHeight"
          label="Ceiling height"
          type="number"
          value={apartment.ceilingHeight}
          onChange={(value) => patchApartment({ ceilingHeight: value })}
          error={fieldErrors["apartment.ceilingHeight"]}
        />
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <TextField
              id="aptBathrooms"
              label="Bathrooms"
              type="number"
              value={apartment.bathrooms}
              onChange={(value) => patchApartment({ bathrooms: value })}
              error={fieldErrors["apartment.bathrooms"]}
            />
          </div>
          <div className="pt-7">
            <PreferenceLockButton
              value={readPropertyFieldLock(fieldLocks, "bathrooms")}
              onChange={(nextLock) => handleFieldLockChange("bathrooms", nextLock)}
            />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <HashtagPicker
              id="aptProject"
              label="Project"
              value={apartment.project}
              onChange={(value) => patchApartment({ project: value })}
            />
          </div>
          <div className="pt-7">
            <PreferenceLockButton
              value={readPropertyFieldLock(fieldLocks, "project")}
              onChange={(nextLock) => handleFieldLockChange("project", nextLock)}
            />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <SelectField
              id="aptRenovation"
              label="Renovation"
              value={apartment.renovation}
              onChange={(value) => patchApartment({ renovation: value })}
              options={RENOVATION_SELECT_OPTIONS}
            />
          </div>
          <div className="pt-7">
            <PreferenceLockButton
              value={readPropertyFieldLock(fieldLocks, "renovation")}
              onChange={(nextLock) => handleFieldLockChange("renovation", nextLock)}
            />
          </div>
        </div>
        {isRentalDeal && (
          <div className="flex items-start gap-2 sm:col-span-2">
            <div className="flex-1">
              <MinRentalPeriodField
                idPrefix="apt"
                value={apartment.minRentalPeriod}
                onChange={(value) => patchApartment({ minRentalPeriod: value })}
                error={fieldErrors["apartment.minRentalPeriod"]}
              />
            </div>
            <div className="pt-7">
              <PreferenceLockButton
                value={readPropertyFieldLock(fieldLocks, "minRentalPeriod")}
                onChange={(nextLock) => handleFieldLockChange("minRentalPeriod", nextLock)}
              />
            </div>
          </div>
        )}
        <NumericVerificationRow
          id="aptBalconyArea"
          label="Total balcony area (m²)"
          value={apartment.balconyArea}
          fieldKey="balconyArea"
          error={fieldErrors["apartment.balconyArea"]}
          needsVerification={apartment.needsVerification}
          onValueChange={(value) => patchApartment({ balconyArea: value })}
          onNeedsVerificationChange={(nextFields) =>
            patchApartment({ needsVerification: nextFields })
          }
        />
        <NumericVerificationRow
          id="aptParking"
          label="Parking spaces"
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
            { id: "aptElevator", label: "Elevator", key: "elevator" },
            { id: "aptCentralHeating", label: "Central heating", key: "centralHeating" },
            { id: "aptAirConditioner", label: "Air conditioner", key: "airConditioner" },
            { id: "aptFurnished", label: "Furnished", key: "furnished" },
            { id: "aptGoodView", label: "Good view", key: "goodView" },
          ] as const
        ).map((field) => (
          <div key={field.key} className="flex items-end gap-2">
            <div className="flex-1">
              <VerifiableBooleanField
                id={field.id}
                label={field.label}
                value={booleanUiStateFromApartment(
                  apartment[field.key],
                  apartment.needsVerification,
                  field.key,
                )}
                onChange={(nextState) => handleBooleanFieldChange(field.key, nextState)}
              />
            </div>
            <PreferenceLockButton
              value={readPropertyFieldLock(fieldLocks, field.key)}
              onChange={(nextLock) => handleFieldLockChange(field.key, nextLock)}
            />
          </div>
        ))}
        {dealType === "RENT" ? (
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <VerifiableBooleanField
                id="aptPetsAllowed"
                label="Pets allowed"
                value={booleanUiStateFromApartment(
                  apartment.petsAllowed,
                  apartment.needsVerification,
                  "petsAllowed",
                )}
                onChange={(nextState) => handleBooleanFieldChange("petsAllowed", nextState)}
              />
            </div>
            <PreferenceLockButton
              value={readPropertyFieldLock(fieldLocks, "petsAllowed")}
              onChange={(nextLock) => handleFieldLockChange("petsAllowed", nextLock)}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
