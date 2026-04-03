"use client";

import type { DealType } from "@/features/properties/dealType";
import { BUILDING_CONDITION_OPTIONS } from "@/features/properties/addPropertyFormOptions";
import { CheckboxField, SelectField, TextField } from "@/widgets/AddProperty/addPropertyFormFields";
import type { FormState } from "@/features/properties/addPropertyFormState";
import type { FormErrors } from "@/features/properties/addPropertyFormValidation";

type Props = {
  dealType: DealType;
  privateHouse: FormState["privateHouse"];
  fieldErrors: FormErrors;
  patchPrivateHouse: (patch: Partial<FormState["privateHouse"]>) => void;
};

export function AddPropertyPrivateHouseSection({
  dealType,
  privateHouse,
  fieldErrors,
  patchPrivateHouse,
}: Props) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-sm font-semibold text-slate-800">Private house details</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="phBuildingCondition"
          label="Building condition"
          value={privateHouse.buildingCondition}
          onChange={(value) => patchPrivateHouse({ buildingCondition: value })}
          options={BUILDING_CONDITION_OPTIONS}
        />
        <TextField
          id="phHouseArea"
          label="House area"
          type="number"
          value={privateHouse.houseArea}
          onChange={(value) => patchPrivateHouse({ houseArea: value })}
          required
          error={fieldErrors["privateHouse.houseArea"]}
        />
        <TextField
          id="phYardArea"
          label="Yard area"
          type="number"
          value={privateHouse.yardArea}
          onChange={(value) => patchPrivateHouse({ yardArea: value })}
          required
          error={fieldErrors["privateHouse.yardArea"]}
        />
        <TextField
          id="phTotalArea"
          label="Total area"
          type="number"
          value={privateHouse.totalArea}
          onChange={(value) => patchPrivateHouse({ totalArea: value })}
          required
          error={fieldErrors["privateHouse.totalArea"]}
        />
        <TextField
          id="phRooms"
          label="Rooms"
          type="number"
          value={privateHouse.rooms}
          onChange={(value) => patchPrivateHouse({ rooms: value })}
          required
          error={fieldErrors["privateHouse.rooms"]}
        />
        <TextField
          id="phBedrooms"
          label="Bedrooms"
          type="number"
          value={privateHouse.bedrooms}
          onChange={(value) => patchPrivateHouse({ bedrooms: value })}
          required
          error={fieldErrors["privateHouse.bedrooms"]}
        />
        <TextField
          id="phRenovation"
          label="Renovation"
          value={privateHouse.renovation}
          onChange={(value) => patchPrivateHouse({ renovation: value })}
        />
        {dealType === "RENT" && (
          <TextField
            id="phMinRentalPeriod"
            label="Min rental period"
            type="number"
            value={privateHouse.minRentalPeriod}
            onChange={(value) => patchPrivateHouse({ minRentalPeriod: value })}
            error={fieldErrors["privateHouse.minRentalPeriod"]}
          />
        )}
        <CheckboxField
          id="phBalcony"
          label="Balcony"
          checked={privateHouse.balcony}
          onChange={(checked) => patchPrivateHouse({ balcony: checked })}
        />
        <CheckboxField
          id="phCentralHeating"
          label="Central heating"
          checked={privateHouse.centralHeating}
          onChange={(checked) => patchPrivateHouse({ centralHeating: checked })}
        />
        <CheckboxField
          id="phAirConditioner"
          label="Air conditioner"
          checked={privateHouse.airConditioner}
          onChange={(checked) => patchPrivateHouse({ airConditioner: checked })}
        />
        <CheckboxField
          id="phFurniture"
          label="Furniture"
          checked={privateHouse.furniture}
          onChange={(checked) => patchPrivateHouse({ furniture: checked })}
        />
        <CheckboxField
          id="phAppliances"
          label="Appliances"
          checked={privateHouse.appliances}
          onChange={(checked) => patchPrivateHouse({ appliances: checked })}
        />
        <CheckboxField
          id="phParking"
          label="Parking"
          checked={privateHouse.parking}
          onChange={(checked) => patchPrivateHouse({ parking: checked })}
        />
        <CheckboxField
          id="phPool"
          label="Pool"
          checked={privateHouse.pool}
          onChange={(checked) => patchPrivateHouse({ pool: checked })}
        />
        <CheckboxField
          id="phFruitTrees"
          label="Fruit trees"
          checked={privateHouse.fruitTrees}
          onChange={(checked) => patchPrivateHouse({ fruitTrees: checked })}
        />
        <CheckboxField
          id="phElectricity"
          label="Electricity"
          checked={privateHouse.electricity}
          onChange={(checked) => patchPrivateHouse({ electricity: checked })}
        />
        <CheckboxField
          id="phWater"
          label="Water"
          checked={privateHouse.water}
          onChange={(checked) => patchPrivateHouse({ water: checked })}
        />
        <CheckboxField
          id="phGas"
          label="Gas"
          checked={privateHouse.gas}
          onChange={(checked) => patchPrivateHouse({ gas: checked })}
        />
        <CheckboxField
          id="phSewage"
          label="Sewage"
          checked={privateHouse.sewage}
          onChange={(checked) => patchPrivateHouse({ sewage: checked })}
        />
        {dealType === "RENT" && (
          <CheckboxField
            id="phPetsAllowed"
            label="Pets allowed"
            checked={privateHouse.petsAllowed}
            onChange={(checked) => patchPrivateHouse({ petsAllowed: checked })}
          />
        )}
      </div>
    </section>
  );
}
