"use client";

import {
  COMMERCIAL_STATUS_OPTIONS,
  RENOVATION_SELECT_OPTIONS,
} from "@/features/properties/addPropertyFormOptions";
import { CheckboxField, SelectField, TextField } from "@/widgets/AddProperty/addPropertyFormFields";
import type { FormState } from "@/features/properties/addPropertyFormState";
import type { FormErrors } from "@/features/properties/addPropertyFormValidation";

type Props = {
  commercial: FormState["commercial"];
  fieldErrors: FormErrors;
  patchCommercial: (patch: Partial<FormState["commercial"]>) => void;
};

export function AddPropertyCommercialSection({
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
        <TextField
          id="cmFloor"
          label="Floor"
          type="number"
          value={commercial.floor}
          onChange={(value) => patchCommercial({ floor: value })}
          required
          error={fieldErrors["commercial.floor"]}
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
        <CheckboxField
          id="cmCentralHeating"
          label="Central heating"
          checked={commercial.centralHeating}
          onChange={(checked) => patchCommercial({ centralHeating: checked })}
        />
        <CheckboxField
          id="cmAirConditioner"
          label="Air conditioner"
          checked={commercial.airConditioner}
          onChange={(checked) => patchCommercial({ airConditioner: checked })}
        />
        <CheckboxField
          id="cmParking"
          label="Parking"
          checked={commercial.parking}
          onChange={(checked) => patchCommercial({ parking: checked })}
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
