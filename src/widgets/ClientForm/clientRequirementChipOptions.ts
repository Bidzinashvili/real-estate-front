import { CLIENT_PREFERENCE_LABELS } from "@/features/matching/matchingEnums";
import type { OptionChipItem } from "@/shared/ui/OptionChips";
import {
  CLIENT_REQUIREMENT_PREFERENCE_VALUES,
  type ClientRequirementPreference,
} from "@/features/clients/clientRequirementValues";

export const CLIENT_YES_DOES_NOT_MATTER_OPTIONS = [
  { value: "YES" as const, label: CLIENT_PREFERENCE_LABELS.YES },
  { value: "DOES_NOT_MATTER" as const, label: CLIENT_PREFERENCE_LABELS.DOES_NOT_MATTER },
] as const;

export const CLIENT_YES_DOES_NOT_MATTER_TO_VERIFY_OPTIONS = [
  ...CLIENT_YES_DOES_NOT_MATTER_OPTIONS,
  { value: "TO_VERIFY" as const, label: CLIENT_PREFERENCE_LABELS.TO_VERIFY },
] as const;

export const CLIENT_PET_REQUIREMENT_OPTIONS = [
  { value: "YES" as const, label: CLIENT_PREFERENCE_LABELS.YES },
  { value: "DOES_NOT_MATTER" as const, label: CLIENT_PREFERENCE_LABELS.DOES_NOT_MATTER },
  { value: "TO_VERIFY" as const, label: CLIENT_PREFERENCE_LABELS.TO_VERIFY },
] as const;

export const CLIENT_REQUIREMENT_PREFERENCE_CHIP_OPTIONS: OptionChipItem<ClientRequirementPreference>[] =
  CLIENT_REQUIREMENT_PREFERENCE_VALUES.filter((preference) => preference !== "NOT_SET").map(
    (preference) => ({
      value: preference,
      label:
        preference === "TO_VERIFY"
          ? CLIENT_PREFERENCE_LABELS.TO_VERIFY
          : CLIENT_PREFERENCE_LABELS.DOES_NOT_MATTER,
    }),
  );
