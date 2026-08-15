"use client";

import type { DealType } from "@/features/properties/dealType";
import {
  LAND_CATEGORY_SELECT_OPTIONS,
  LAND_USAGE_SELECT_OPTIONS,
} from "@/features/properties/addPropertyFormOptions";
import { CheckboxField, SelectField, TextField } from "@/widgets/AddProperty/addPropertyFormFields";
import { MinRentalPeriodField } from "@/widgets/AddProperty/MinRentalPeriodField";
import type { FormState } from "@/features/properties/addPropertyFormState";
import type { FormErrors } from "@/features/properties/addPropertyFormValidation";
import type { CommercialStatus, LandCategory } from "@/features/properties/types";

type Props = {
  dealType: DealType;
  landPlot: FormState["landPlot"];
  fieldErrors: FormErrors;
  patchLandPlot: (patch: Partial<FormState["landPlot"]>) => void;
};

export function AddPropertyLandPlotSection({
  dealType,
  landPlot,
  fieldErrors,
  patchLandPlot,
}: Props) {
  const hasLandCategory = landPlot.landCategory !== "";

  function handleLandCategoryChange(nextRaw: string) {
    const nextCategory = nextRaw as LandCategory | "";
    patchLandPlot({
      landCategory: nextCategory,
      landUsage: "",
    });
  }

  function handleLandUsageChange(nextRaw: string) {
    patchLandPlot({ landUsage: nextRaw as CommercialStatus | "" });
  }

  return (
    <section className="space-y-3 rounded-xl border border-border bg-muted p-4">
      <h2 className="text-sm font-semibold text-foreground">მიწის ნაკვეთის დეტალები</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="lpLandArea"
          label="მიწის ფართობი"
          type="number"
          value={landPlot.landArea}
          onChange={(value) => patchLandPlot({ landArea: value })}
          required
          error={fieldErrors["landPlot.landArea"]}
        />
        <SelectField
          id="lpLandCategory"
          label="მიწის კატეგორია"
          value={landPlot.landCategory}
          onChange={handleLandCategoryChange}
          options={LAND_CATEGORY_SELECT_OPTIONS}
          error={fieldErrors["landPlot.landCategory"]}
        />
        <SelectField
          id="lpLandUsage"
          label="მიწის დანიშნულება"
          value={landPlot.landUsage}
          onChange={handleLandUsageChange}
          options={LAND_USAGE_SELECT_OPTIONS}
          disabled={!hasLandCategory}
          error={fieldErrors["landPlot.landUsage"]}
        />
        {dealType === "RENT" || dealType === "DAILY_RENT" ? (
          <MinRentalPeriodField
            idPrefix="lp"
            value={landPlot.minRentalPeriod}
            onChange={(value) => patchLandPlot({ minRentalPeriod: value })}
            error={fieldErrors["landPlot.minRentalPeriod"]}
          />
        ) : null}
        <CheckboxField
          id="lpForInvestment"
          label="საინვესტიციო"
          checked={landPlot.forInvestment}
          onChange={(checked) => patchLandPlot({ forInvestment: checked })}
        />
        <CheckboxField
          id="lpApprovedProject"
          label="დამტკიცებული პროექტი"
          checked={landPlot.approvedProject}
          onChange={(checked) => patchLandPlot({ approvedProject: checked })}
        />
        <CheckboxField
          id="lpCanBeDivided"
          label="იყოფა"
          checked={landPlot.canBeDivided}
          onChange={(checked) => patchLandPlot({ canBeDivided: checked })}
        />
        <CheckboxField
          id="lpFruitTrees"
          label="ხეხილი"
          checked={landPlot.fruitTrees}
          onChange={(checked) => patchLandPlot({ fruitTrees: checked })}
        />
        <CheckboxField
          id="lpElectricity"
          label="ელექტროენერგია"
          checked={landPlot.electricity}
          onChange={(checked) => patchLandPlot({ electricity: checked })}
        />
        <CheckboxField
          id="lpWater"
          label="წყალი"
          checked={landPlot.water}
          onChange={(checked) => patchLandPlot({ water: checked })}
        />
        <CheckboxField
          id="lpGas"
          label="გაზი"
          checked={landPlot.gas}
          onChange={(checked) => patchLandPlot({ gas: checked })}
        />
        <CheckboxField
          id="lpSewage"
          label="კანალიზაცია"
          checked={landPlot.sewage}
          onChange={(checked) => patchLandPlot({ sewage: checked })}
        />
      </div>
    </section>
  );
}
