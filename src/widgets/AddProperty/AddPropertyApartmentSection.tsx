"use client";

import type { DealType } from "@/features/properties/dealType";
import {
  BUILDING_CONDITION_OPTIONS,
  KITCHEN_TYPE_OPTIONS,
} from "@/features/properties/addPropertyFormOptions";
import { CheckboxField, SelectField, TextField } from "@/widgets/AddProperty/addPropertyFormFields";
import type { FormState } from "@/features/properties/addPropertyFormState";
import type { FormErrors } from "@/features/properties/addPropertyFormValidation";

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
          onChange={(value) => patchApartment({ rooms: value })}
          required
          error={fieldErrors["apartment.rooms"]}
        />
        <TextField
          id="aptBedrooms"
          label="Bedrooms"
          type="number"
          value={apartment.bedrooms}
          onChange={(value) => patchApartment({ bedrooms: value })}
          required
          error={fieldErrors["apartment.bedrooms"]}
        />
        <TextField
          id="aptFloor"
          label="Floor"
          type="number"
          value={apartment.floor}
          onChange={(value) => patchApartment({ floor: value })}
          required
          error={fieldErrors["apartment.floor"]}
        />
        <TextField
          id="aptBuildingNumber"
          label="Building number"
          value={apartment.buildingNumber}
          onChange={(value) => patchApartment({ buildingNumber: value })}
        />
        <TextField
          id="aptProject"
          label="Project"
          value={apartment.project}
          onChange={(value) => patchApartment({ project: value })}
        />
        <TextField
          id="aptRenovation"
          label="Renovation"
          value={apartment.renovation}
          onChange={(value) => patchApartment({ renovation: value })}
        />
        {dealType === "RENT" && (
          <TextField
            id="aptMinRentalPeriod"
            label="Min rental period"
            type="number"
            value={apartment.minRentalPeriod}
            onChange={(value) => patchApartment({ minRentalPeriod: value })}
            error={fieldErrors["apartment.minRentalPeriod"]}
          />
        )}
        <CheckboxField
          id="aptBalcony"
          label="Balcony"
          checked={apartment.balcony}
          onChange={(checked) => patchApartment({ balcony: checked })}
        />
        <CheckboxField
          id="aptElevator"
          label="Elevator"
          checked={apartment.elevator}
          onChange={(checked) => patchApartment({ elevator: checked })}
        />
        <CheckboxField
          id="aptCentralHeating"
          label="Central heating"
          checked={apartment.centralHeating}
          onChange={(checked) => patchApartment({ centralHeating: checked })}
        />
        <CheckboxField
          id="aptAirConditioner"
          label="Air conditioner"
          checked={apartment.airConditioner}
          onChange={(checked) => patchApartment({ airConditioner: checked })}
        />
        <CheckboxField
          id="aptFurniture"
          label="Furniture"
          checked={apartment.furniture}
          onChange={(checked) => patchApartment({ furniture: checked })}
        />
        <CheckboxField
          id="aptAppliances"
          label="Appliances"
          checked={apartment.appliances}
          onChange={(checked) => patchApartment({ appliances: checked })}
        />
        <CheckboxField
          id="aptParking"
          label="Parking"
          checked={apartment.parking}
          onChange={(checked) => patchApartment({ parking: checked })}
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
