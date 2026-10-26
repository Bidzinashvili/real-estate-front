"use client";

import { OPTION_CHIPS_FORM_LABEL_CLASS_NAME } from "@/shared/ui/OptionChips";
import { TbilisiNeighborhoodSections } from "@/widgets/Districts/TbilisiNeighborhoodSections";

interface DistrictNeighborhoodPickerProps {
  value: string;
  onChange: (nextDistrict: string) => void;
  disabled?: boolean;
  error?: string;
}

/** Property Tbilisi neighborhood: single select (one listing = one location). */
export function DistrictNeighborhoodPicker({
  value,
  onChange,
  disabled = false,
  error,
}: DistrictNeighborhoodPickerProps) {
  const selectedDistrict = value.trim();

  return (
    <div className="space-y-1.5 sm:col-span-2">
      <p className={OPTION_CHIPS_FORM_LABEL_CLASS_NAME}>უბანი</p>
      <TbilisiNeighborhoodSections
        selectedNeighborhoods={selectedDistrict === "" ? [] : [selectedDistrict]}
        onChange={(nextNeighborhoods) => onChange(nextNeighborhoods[0] ?? "")}
        selectionMode="single"
        disabled={disabled}
      />
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
