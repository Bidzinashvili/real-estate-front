"use client";

import { useMemo } from "react";
import { useDistricts } from "@/features/districts/useDistricts";
import type { DistrictGroup } from "@/features/districts/districtTypes";
import { OptionChips, OPTION_CHIPS_FORM_LABEL_CLASS_NAME } from "@/shared/ui/OptionChips";

export type Selection = { group: string; neighborhood: string } | null;

interface DistrictNeighborhoodPickerProps {
  value: Selection;
  onChange: (next: Selection) => void;
  disabled?: boolean;
  error?: string;
}

function findDistrictGroup(
  districts: DistrictGroup[],
  groupName: string,
): DistrictGroup | null {
  for (const districtGroup of districts) {
    if (districtGroup.name === groupName) {
      return districtGroup;
    }
  }

  return null;
}

export function DistrictNeighborhoodPicker({
  value,
  onChange,
  disabled = false,
  error,
}: DistrictNeighborhoodPickerProps) {
  const { districts, isLoading, error: loadError, retry } = useDistricts();
  const availableDistricts = districts ?? [];

  const selectedGroupName = value?.group ?? "";
  const selectedNeighborhood = value?.neighborhood ?? "";

  const selectedGroup = useMemo(
    () => findDistrictGroup(availableDistricts, selectedGroupName),
    [availableDistricts, selectedGroupName],
  );

  const neighborhoods = selectedGroup?.neighborhoods ?? [];
  const isSelectDisabled = disabled || isLoading || Boolean(loadError);

  const districtGroupOptions = [
    { value: "", label: "აირჩიეთ უბნების ჯგუფი" },
    ...availableDistricts.map((districtGroup) => ({
      value: districtGroup.name,
      label: districtGroup.name,
    })),
  ];

  const neighborhoodOptions = [
    {
      value: "",
      label:
        selectedGroupName === ""
          ? "ჯერ აირჩიეთ უბნების ჯგუფი"
          : "აირჩიეთ უბანი",
    },
    ...neighborhoods.map((neighborhoodName) => ({
      value: neighborhoodName,
      label: neighborhoodName,
    })),
  ];

  if (loadError) {
    return (
      <div className="space-y-2 sm:col-span-2">
        <p className="block text-sm font-medium text-foreground">
          უბნები და უბნის ნაწილები
        </p>
        <div className="rounded-lg border border-red-200 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <p>უბნების ჩატვირთვა ვერ მოხერხდა.</p>
          <button
            type="button"
            onClick={retry}
            className="mt-2 inline-flex items-center rounded-full border border-red-200 bg-card px-3 py-1.5 text-sm font-medium text-destructive transition hover:bg-destructive/15"
          >
            ხელახლა
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && districts === null) {
    return (
      <div className="space-y-2 sm:col-span-2">
        <p className="block text-sm font-medium text-foreground">
          უბნები და უბნის ნაწილები
        </p>
        <p className="text-sm text-muted-foreground">იტვირთება...</p>
      </div>
    );
  }

  if (availableDistricts.length === 0) {
    return (
      <div className="space-y-2 sm:col-span-2">
        <p className="block text-sm font-medium text-foreground">
          უბნები და უბნის ნაწილები
        </p>
        <div className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
          <p>უბნები არ არის.</p>
          <button
            type="button"
            onClick={retry}
            className="mt-2 inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            ხელახლა
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 sm:col-span-2">
      <div className="grid gap-4">
        <OptionChips
          id="districtGroup"
          label="უბნის ჯგუფი"
          labelClassName={OPTION_CHIPS_FORM_LABEL_CLASS_NAME}
          value={selectedGroupName}
          disabled={isSelectDisabled}
          onChange={(nextGroup) => {
            if (nextGroup === "") {
              onChange(null);
              return;
            }
            onChange({ group: nextGroup, neighborhood: "" });
          }}
          options={districtGroupOptions}
        />
        <OptionChips
          id="districtNeighborhood"
          label="უბანი"
          labelClassName={OPTION_CHIPS_FORM_LABEL_CLASS_NAME}
          value={selectedNeighborhood}
          disabled={isSelectDisabled || selectedGroupName === ""}
          onChange={(nextNeighborhood) => {
            if (nextNeighborhood === "") {
              onChange(
                selectedGroupName === ""
                  ? null
                  : { group: selectedGroupName, neighborhood: "" },
              );
              return;
            }
            onChange({
              group: selectedGroupName,
              neighborhood: nextNeighborhood,
            });
          }}
          options={neighborhoodOptions}
        />
      </div>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
