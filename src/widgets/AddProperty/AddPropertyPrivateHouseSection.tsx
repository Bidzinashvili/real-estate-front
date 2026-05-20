"use client";

import { useEffect, useState } from "react";
import type { DealType } from "@/features/properties/dealType";
import {
  BUILDING_CONDITION_OPTIONS,
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
import { NeedsVerificationToggle } from "@/shared/components/NeedsVerificationToggle";

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
          <MinRentalPeriodField
            idPrefix="ph"
            value={privateHouse.minRentalPeriod}
            onChange={(value) => patchPrivateHouse({ minRentalPeriod: value })}
            error={fieldErrors["privateHouse.minRentalPeriod"]}
          />
        )}
        <TextField
          id="phBalconyArea"
          label="Total balcony area (m²)"
          type="number"
          value={privateHouse.balconyArea}
          onChange={(value) => patchPrivateHouse({ balconyArea: value })}
          error={fieldErrors["privateHouse.balconyArea"]}
        />
        {[
          {
            id: "phCentralHeating",
            label: "Central heating",
            key: "centralHeating",
            checked: privateHouse.centralHeating,
            onChange: (checked: boolean) =>
              patchPrivateHouse({ centralHeating: checked }),
          },
          {
            id: "phAirConditioner",
            label: "Air conditioner",
            key: "airConditioner",
            checked: privateHouse.airConditioner,
            onChange: (checked: boolean) =>
              patchPrivateHouse({ airConditioner: checked }),
          },
          {
            id: "phFurnished",
            label: "Furnished",
            key: "furnished",
            checked: privateHouse.furnished,
            onChange: (checked: boolean) => patchPrivateHouse({ furnished: checked }),
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
              activeFields={privateHouse.needsVerification}
              onChange={(nextFields) =>
                patchPrivateHouse({ needsVerification: nextFields })
              }
            />
          </div>
        ))}
        <TextField
          id="phParking"
          label="Parking spaces"
          type="number"
          value={privateHouse.parkingSpaces}
          onChange={(value) => patchPrivateHouse({ parkingSpaces: value })}
          error={fieldErrors["privateHouse.parkingSpaces"]}
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
