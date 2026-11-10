"use client";

import {
  PET_KIND_LABELS,
  type PetKindFormValue,
} from "@/features/clients/clientPetDescription";
import { OptionChips } from "@/shared/ui/OptionChips";

type SelectablePetKind = Exclude<PetKindFormValue, "">;

const PET_KIND_OPTIONS: ReadonlyArray<{ value: SelectablePetKind; label: string }> = [
  { value: "NONE", label: PET_KIND_LABELS.NONE },
  { value: "DOG", label: PET_KIND_LABELS.DOG },
  { value: "CAT", label: PET_KIND_LABELS.CAT },
  { value: "OTHER", label: PET_KIND_LABELS.OTHER },
];

const petOtherInputClassName =
  "shadow-none block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary";

type ClientPetFieldProps = {
  kind: PetKindFormValue;
  onKindChange: (kind: SelectablePetKind) => void;
  otherText: string;
  onOtherTextChange: (text: string) => void;
  disabled?: boolean;
};

export function ClientPetField({
  kind,
  onKindChange,
  otherText,
  onOtherTextChange,
  disabled = false,
}: ClientPetFieldProps) {
  return (
    <div className="space-y-2">
      <OptionChips
        aria-label="შინაური ცხოველი"
        value={kind}
        options={PET_KIND_OPTIONS}
        disabled={disabled}
        onChange={(nextKind) => {
          if (nextKind === "") {
            return;
          }
          onKindChange(nextKind);
        }}
      />
      {kind === "OTHER" ? (
        <input
          type="text"
          value={otherText}
          disabled={disabled}
          onChange={(event) => onOtherTextChange(event.target.value)}
          placeholder="მიუთითეთ შინაური ცხოველი"
          aria-label="შინაური ცხოველის დაზუსტება"
          maxLength={200}
          className={petOtherInputClassName}
        />
      ) : null}
    </div>
  );
}
