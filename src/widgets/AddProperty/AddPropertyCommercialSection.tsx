"use client";

import type { DealType } from "@/features/properties/dealType";
import {
  COMMERCIAL_STATUS_OPTIONS,
  RENOVATION_SELECT_OPTIONS,
} from "@/features/properties/addPropertyFormOptions";
import { CheckboxField, SelectField, TextField } from "@/widgets/AddProperty/addPropertyFormFields";
import { MinRentalPeriodField } from "@/widgets/AddProperty/MinRentalPeriodField";
import type { FormState } from "@/features/properties/addPropertyFormState";
import type { FormErrors } from "@/features/properties/addPropertyFormValidation";
import { FloorInput } from "@/shared/components/FloorInput";
import { NeedsVerificationToggle } from "@/shared/components/NeedsVerificationToggle";

type Props = {
  dealType: DealType;
  commercial: FormState["commercial"];
  fieldErrors: FormErrors;
  patchCommercial: (patch: Partial<FormState["commercial"]>) => void;
};

export function AddPropertyCommercialSection({
  dealType,
  commercial,
  fieldErrors,
  patchCommercial,
}: Props) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-sm font-semibold text-slate-800">Commercial details</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="cmArea"
          label="Area"
          type="number"
          value={commercial.area}
          onChange={(value) => patchCommercial({ area: value })}
          required
          error={fieldErrors["commercial.area"]}
        />
        <FloorInput
          floorId="cmFloor"
          totalFloorsId="cmTotalFloors"
          floorValue={commercial.floor}
          totalFloorsValue={commercial.totalFloors}
          onFloorChange={(value) => patchCommercial({ floor: value })}
          onTotalFloorsChange={(value) => patchCommercial({ totalFloors: value })}
          floorError={fieldErrors["commercial.floor"]}
          totalFloorsError={fieldErrors["commercial.totalFloors"]}
          required
        />
        <TextField
          id="cmCeilingHeight"
          label="Ceiling height"
          type="number"
          value={commercial.ceilingHeight}
          onChange={(value) => patchCommercial({ ceilingHeight: value })}
          error={fieldErrors["commercial.ceilingHeight"]}
        />
        <SelectField
          id="cmStatus"
          label="Status"
          value={commercial.status}
          onChange={(value) => patchCommercial({ status: value })}
          options={COMMERCIAL_STATUS_OPTIONS}
        />
        <SelectField
          id="cmRenovation"
          label="Renovation"
          value={commercial.renovation}
          onChange={(value) => patchCommercial({ renovation: value })}
          options={RENOVATION_SELECT_OPTIONS}
        />
        {dealType === "RENT" && (
          <MinRentalPeriodField
            idPrefix="cm"
            value={commercial.minRentalPeriod}
            onChange={(value) => patchCommercial({ minRentalPeriod: value })}
            error={fieldErrors["commercial.minRentalPeriod"]}
          />
        )}
        {[
          {
            id: "cmCentralHeating",
            label: "Central heating",
            key: "centralHeating",
            checked: commercial.centralHeating,
            onChange: (checked: boolean) =>
              patchCommercial({ centralHeating: checked }),
          },
          {
            id: "cmAirConditioner",
            label: "Air conditioner",
            key: "airConditioner",
            checked: commercial.airConditioner,
            onChange: (checked: boolean) =>
              patchCommercial({ airConditioner: checked }),
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
              activeFields={commercial.needsVerification}
              onChange={(nextFields) =>
                patchCommercial({ needsVerification: nextFields })
              }
            />
          </div>
        ))}
        <TextField
          id="cmParking"
          label="Parking spaces"
          type="number"
          value={commercial.parkingSpaces}
          onChange={(value) => patchCommercial({ parkingSpaces: value })}
          error={fieldErrors["commercial.parkingSpaces"]}
        />
        <CheckboxField
          id="cmElectricity"
          label="Electricity"
          checked={commercial.electricity}
          onChange={(checked) => patchCommercial({ electricity: checked })}
        />
        <CheckboxField
          id="cmWater"
          label="Water"
          checked={commercial.water}
          onChange={(checked) => patchCommercial({ water: checked })}
        />
        <CheckboxField
          id="cmGas"
          label="Gas"
          checked={commercial.gas}
          onChange={(checked) => patchCommercial({ gas: checked })}
        />
        <CheckboxField
          id="cmSewage"
          label="Sewage"
          checked={commercial.sewage}
          onChange={(checked) => patchCommercial({ sewage: checked })}
        />
      </div>
    </section>
  );
}
