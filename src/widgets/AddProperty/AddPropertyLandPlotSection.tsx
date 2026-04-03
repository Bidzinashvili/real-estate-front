"use client";

import { LAND_STATUS_OPTIONS } from "@/features/properties/addPropertyFormOptions";
import { CheckboxField, SelectField, TextField } from "@/widgets/AddProperty/addPropertyFormFields";
import type { FormState } from "@/features/properties/addPropertyFormState";
import type { FormErrors } from "@/features/properties/addPropertyFormValidation";

type Props = {
  landPlot: FormState["landPlot"];
  fieldErrors: FormErrors;
  patchLandPlot: (patch: Partial<FormState["landPlot"]>) => void;
};

export function AddPropertyLandPlotSection({ landPlot, fieldErrors, patchLandPlot }: Props) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-sm font-semibold text-slate-800">Land plot details</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="lpLandArea"
          label="Land area"
          type="number"
          value={landPlot.landArea}
          onChange={(value) => patchLandPlot({ landArea: value })}
          required
          error={fieldErrors["landPlot.landArea"]}
        />
        <SelectField
          id="lpStatus"
          label="Status"
          value={landPlot.status}
          onChange={(value) => patchLandPlot({ status: value })}
          options={LAND_STATUS_OPTIONS}
        />
        <CheckboxField
          id="lpForInvestment"
          label="For investment"
          checked={landPlot.forInvestment}
          onChange={(checked) => patchLandPlot({ forInvestment: checked })}
        />
        <CheckboxField
          id="lpApprovedProject"
          label="Approved project"
          checked={landPlot.approvedProject}
          onChange={(checked) => patchLandPlot({ approvedProject: checked })}
        />
        <CheckboxField
          id="lpCanBeDivided"
          label="Can be divided"
          checked={landPlot.canBeDivided}
          onChange={(checked) => patchLandPlot({ canBeDivided: checked })}
        />
        <CheckboxField
          id="lpFruitTrees"
          label="Fruit trees"
          checked={landPlot.fruitTrees}
          onChange={(checked) => patchLandPlot({ fruitTrees: checked })}
        />
        <CheckboxField
          id="lpElectricity"
          label="Electricity"
          checked={landPlot.electricity}
          onChange={(checked) => patchLandPlot({ electricity: checked })}
        />
        <CheckboxField
          id="lpWater"
          label="Water"
          checked={landPlot.water}
          onChange={(checked) => patchLandPlot({ water: checked })}
        />
        <CheckboxField
          id="lpGas"
          label="Gas"
          checked={landPlot.gas}
          onChange={(checked) => patchLandPlot({ gas: checked })}
        />
        <CheckboxField
          id="lpSewage"
          label="Sewage"
          checked={landPlot.sewage}
          onChange={(checked) => patchLandPlot({ sewage: checked })}
        />
      </div>
    </section>
  );
}
