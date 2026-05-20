"use client";

import { useState } from "react";
import type { DealType } from "@/features/properties/dealType";
import {
  BUILDING_CONDITION_OPTIONS,
  KITCHEN_TYPE_OPTIONS,
  RENOVATION_SELECT_OPTIONS,
} from "@/features/properties/addPropertyFormOptions";
import {
  CheckboxField,
  SelectField,
  TextField,
} from "@/widgets/AddProperty/addPropertyFormFields";
import { MinRentalPeriodField } from "@/widgets/AddProperty/MinRentalPeriodField";
import type { FormState } from "@/features/properties/addPropertyFormState";
import type { FormErrors } from "@/features/properties/addPropertyFormValidation";
import {
  normalizeManualBedroomsString,
  syncedBedroomsStringFromRoomsRaw,
} from "@/widgets/AddProperty/roomsBedroomsSyncHelpers";
import { FloorInput } from "@/shared/components/FloorInput";
import { HashtagPicker } from "@/shared/components/HashtagPicker";
import { NeedsVerificationToggle } from "@/shared/components/NeedsVerificationToggle";

type Props = {
  dealType: DealType;
  apartment: FormState["apartment"];
  fieldErrors: FormErrors;
  patchApartment: (patch: Partial<FormState["apartment"]>) => void;
};

export function AddPropertyApartmentSection({
  dealType,
  apartment,
  fieldErrors,
  patchApartment,
}: Props) {
  const [isBedroomsManuallyEdited, setIsBedroomsManuallyEdited] = useState(false);

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

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-sm font-semibold text-slate-800">Apartment details</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="aptBuildingCondition"
          label="Building condition"
          value={apartment.buildingCondition}
          onChange={(value) => patchApartment({ buildingCondition: value })}
          options={BUILDING_CONDITION_OPTIONS}
        />
        <SelectField
          id="aptKitchenType"
          label="Kitchen type"
          value={apartment.kitchenType}
          onChange={(value) => patchApartment({ kitchenType: value })}
          options={KITCHEN_TYPE_OPTIONS}
        />
        <TextField
          id="aptTotalArea"
          label="Total area"
          type="number"
          value={apartment.totalArea}
          onChange={(value) => patchApartment({ totalArea: value })}
          required
          error={fieldErrors["apartment.totalArea"]}
        />
        <TextField
          id="aptRooms"
          label="Rooms"
          type="number"
          value={apartment.rooms}
          onChange={handleRoomsChange}
          required
          error={fieldErrors["apartment.rooms"]}
        />
        <TextField
          id="aptBedrooms"
          label="Bedrooms"
          type="number"
          value={apartment.bedrooms}
          onChange={handleBedroomsChange}
          required
          error={fieldErrors["apartment.bedrooms"]}
        />
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
        <TextField
          id="aptCeilingHeight"
          label="Ceiling height"
          type="number"
          value={apartment.ceilingHeight}
          onChange={(value) => patchApartment({ ceilingHeight: value })}
          error={fieldErrors["apartment.ceilingHeight"]}
        />
        <HashtagPicker
          id="aptProject"
          label="Project"
          value={apartment.project}
          onChange={(value) => patchApartment({ project: value })}
        />
        <SelectField
          id="aptRenovation"
          label="Renovation"
          value={apartment.renovation}
          onChange={(value) => patchApartment({ renovation: value })}
          options={RENOVATION_SELECT_OPTIONS}
        />
        {dealType === "RENT" && (
          <MinRentalPeriodField
            idPrefix="apt"
            value={apartment.minRentalPeriod}
            onChange={(value) => patchApartment({ minRentalPeriod: value })}
            error={fieldErrors["apartment.minRentalPeriod"]}
          />
        )}
        <TextField
          id="aptBalconyArea"
          label="Total balcony area (m²)"
          type="number"
          value={apartment.balconyArea}
          onChange={(value) => patchApartment({ balconyArea: value })}
          error={fieldErrors["apartment.balconyArea"]}
        />
        {[
          {
            id: "aptElevator",
            label: "Elevator",
            key: "elevator",
            checked: apartment.elevator,
            onChange: (checked: boolean) => patchApartment({ elevator: checked }),
          },
          {
            id: "aptCentralHeating",
            label: "Central heating",
            key: "centralHeating",
            checked: apartment.centralHeating,
            onChange: (checked: boolean) => patchApartment({ centralHeating: checked }),
          },
          {
            id: "aptAirConditioner",
            label: "Air conditioner",
            key: "airConditioner",
            checked: apartment.airConditioner,
            onChange: (checked: boolean) => patchApartment({ airConditioner: checked }),
          },
          {
            id: "aptFurnished",
            label: "Furnished",
            key: "furnished",
            checked: apartment.furnished,
            onChange: (checked: boolean) => patchApartment({ furnished: checked }),
          },
        ].map((field) => (
          <div key={field.key} className="flex items-center gap-2">
            <div className="flex-1">
              <CheckboxField
                id={field.id}
                label={field.label}
                checked={field.checked}
                onChange={field.onChange}
              />
            </div>
            <NeedsVerificationToggle
              fieldKey={field.key}
              activeFields={apartment.needsVerification}
              onChange={(nextFields) =>
                patchApartment({ needsVerification: nextFields })
              }
            />
          </div>
        ))}
        <TextField
          id="aptParking"
          label="Parking spaces"
          type="number"
          value={apartment.parkingSpaces}
          onChange={(value) => patchApartment({ parkingSpaces: value })}
          error={fieldErrors["apartment.parkingSpaces"]}
        />
        {dealType === "RENT" && (
          <CheckboxField
            id="aptPetsAllowed"
            label="Pets allowed"
            checked={apartment.petsAllowed}
            onChange={(checked) => patchApartment({ petsAllowed: checked })}
          />
        )}
      </div>
    </section>
  );
}
