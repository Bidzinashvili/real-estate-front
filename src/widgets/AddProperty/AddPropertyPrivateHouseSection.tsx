"use client";

import { useEffect, useState } from "react";
import type { DealType } from "@/features/properties/dealType";
import {
  BUILDING_CONDITION_OPTIONS,
  RENOVATION_SELECT_OPTIONS,
} from "@/features/properties/addPropertyFormOptions";
import {
  CheckboxField,
  NonNegativeCounterField,
  SelectField,
  TextField,
} from "@/widgets/AddProperty/addPropertyFormFields";
import type { FormState } from "@/features/properties/addPropertyFormState";
import type { FormErrors } from "@/features/properties/addPropertyFormValidation";
import {
  normalizeManualBedroomsString,
  syncedBedroomsStringFromRoomsRaw,
} from "@/widgets/AddProperty/roomsBedroomsSyncHelpers";

function parseAreaNumber(rawInput: string): number {
  const trimmedInput = rawInput.trim();
  if (trimmedInput === "") return 0;
  const parsedNumber = parseFloat(trimmedInput);
  return Number.isFinite(parsedNumber) ? parsedNumber : 0;
}

function totalAreaStringFromParts(houseArea: string, yardArea: string): string {
  if (houseArea.trim() === "" && yardArea.trim() === "") return "";
  const combinedSquareMeters =
    parseAreaNumber(houseArea) + parseAreaNumber(yardArea);
  return String(combinedSquareMeters);
}

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
  const [isBedroomsManuallyEdited, setIsBedroomsManuallyEdited] = useState(false);

  function handleRoomsChange(value: string) {
    patchPrivateHouse({
      rooms: value,
      ...(!isBedroomsManuallyEdited
        ? { bedrooms: syncedBedroomsStringFromRoomsRaw(value) }
        : {}),
    });
  }

  function handleBedroomsChange(value: string) {
    if (value.trim() === "") {
      setIsBedroomsManuallyEdited(false);
      patchPrivateHouse({
        bedrooms: syncedBedroomsStringFromRoomsRaw(privateHouse.rooms),
      });
      return;
    }
    setIsBedroomsManuallyEdited(true);
    patchPrivateHouse({ bedrooms: normalizeManualBedroomsString(value) });
  }

  const totalArea = totalAreaStringFromParts(
    privateHouse.houseArea,
    privateHouse.yardArea,
  );

  function handleHouseAreaChange(value: string) {
    patchPrivateHouse({
      houseArea: value,
      totalArea: totalAreaStringFromParts(value, privateHouse.yardArea),
    });
  }

  function handleYardAreaChange(value: string) {
    patchPrivateHouse({
      yardArea: value,
      totalArea: totalAreaStringFromParts(privateHouse.houseArea, value),
    });
  }

  useEffect(() => {
    const nextTotal = totalAreaStringFromParts(
      privateHouse.houseArea,
      privateHouse.yardArea,
    );
    if (nextTotal !== privateHouse.totalArea) {
      patchPrivateHouse({ totalArea: nextTotal });
    }
  }, [
    privateHouse.houseArea,
    privateHouse.yardArea,
    privateHouse.totalArea,
    patchPrivateHouse,
  ]);

  function handleDecreaseBalcony() {
    patchPrivateHouse({ balcony: Math.max(0, privateHouse.balcony - 1) });
  }

  function handleIncreaseBalcony() {
    patchPrivateHouse({ balcony: privateHouse.balcony + 1 });
  }

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
          onChange={handleHouseAreaChange}
          required
          error={fieldErrors["privateHouse.houseArea"]}
        />
        <TextField
          id="phYardArea"
          label="Yard area"
          type="number"
          value={privateHouse.yardArea}
          onChange={handleYardAreaChange}
          required
          error={fieldErrors["privateHouse.yardArea"]}
        />
        <TextField
          id="phTotalArea"
          label="Total area"
          type="number"
          value={totalArea}
          onChange={() => {}}
          readOnly
          required
          error={fieldErrors["privateHouse.totalArea"]}
        />
        <TextField
          id="phRooms"
          label="Rooms"
          type="number"
          value={privateHouse.rooms}
          onChange={handleRoomsChange}
          required
          error={fieldErrors["privateHouse.rooms"]}
        />
        <TextField
          id="phBedrooms"
          label="Bedrooms"
          type="number"
          value={privateHouse.bedrooms}
          onChange={handleBedroomsChange}
          required
          error={fieldErrors["privateHouse.bedrooms"]}
        />
        <SelectField
          id="phRenovation"
          label="Renovation"
          value={privateHouse.renovation}
          onChange={(value) => patchPrivateHouse({ renovation: value })}
          options={RENOVATION_SELECT_OPTIONS}
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
        <NonNegativeCounterField
          id="phBalcony"
          label="Balcony"
          value={privateHouse.balcony}
          onDecrease={handleDecreaseBalcony}
          onIncrease={handleIncreaseBalcony}
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
