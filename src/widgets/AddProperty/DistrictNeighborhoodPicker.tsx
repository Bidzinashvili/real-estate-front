"use client";

import { useMemo } from "react";
import { useDistricts } from "@/features/districts/useDistricts";
import type { DistrictGroup } from "@/features/districts/districtTypes";
import { NativeSelectSurface } from "@/shared/ui/NativeSelectSurface";
import { addPropertySelectClassName } from "@/widgets/AddProperty/addPropertyFormFields";

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
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="districtGroup" className="block text-sm font-medium text-foreground">
              უბნის ჯგუფი
            </label>
            <NativeSelectSurface>
              <select
                id="districtGroup"
                disabled
                className={addPropertySelectClassName()}
              >
                <option>იტვირთება...</option>
              </select>
            </NativeSelectSurface>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="districtNeighborhood" className="block text-sm font-medium text-foreground">
              უბანი
            </label>
            <NativeSelectSurface>
              <select
                id="districtNeighborhood"
                disabled
                className={addPropertySelectClassName()}
              >
                <option>იტვირთება...</option>
              </select>
            </NativeSelectSurface>
          </div>
        </div>
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="districtGroup" className="block text-sm font-medium text-foreground">
            უბნის ჯგუფი
          </label>
          <NativeSelectSurface>
            <select
              id="districtGroup"
              value={selectedGroupName}
              disabled={isSelectDisabled}
              onChange={(event) => {
                const nextGroup = event.target.value;
                if (nextGroup === "") {
                  onChange(null);
                  return;
                }

                onChange({ group: nextGroup, neighborhood: "" });
              }}
              className={`${addPropertySelectClassName()} ${isSelectDisabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <option value="">აირჩიეთ უბნების ჯგუფი</option>
              {availableDistricts.map((districtGroup) => (
                <option key={districtGroup.name} value={districtGroup.name}>
                  {districtGroup.name}
                </option>
              ))}
            </select>
          </NativeSelectSurface>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="districtNeighborhood"
            className="block text-sm font-medium text-foreground"
          >
            უბანი
          </label>
          <NativeSelectSurface>
            <select
              id="districtNeighborhood"
              value={selectedNeighborhood}
              disabled={isSelectDisabled || selectedGroupName === ""}
              onChange={(event) => {
                const nextNeighborhood = event.target.value;
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
              className={`${addPropertySelectClassName()} ${isSelectDisabled || selectedGroupName === "" ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <option value="">
                {selectedGroupName === ""
                  ? "ჯერ აირჩიეთ უბნების ჯგუფი"
                  : "აირჩიეთ უბანი"}
              </option>
              {neighborhoods.map((neighborhoodName) => (
                <option key={neighborhoodName} value={neighborhoodName}>
                  {neighborhoodName}
                </option>
              ))}
            </select>
          </NativeSelectSurface>
        </div>
      </div>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
