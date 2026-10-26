import { DEAL_TYPES, type DealType, isDealType } from "@/features/clients/clientEnums";

export const CLIENT_FORM_DEAL_TYPES = ["SALE", "RENT"] as const;
export type ClientFormDealType = (typeof CLIENT_FORM_DEAL_TYPES)[number];

export const CLIENT_DEAL_INTENT_LABELS: Record<DealType, string> = {
  SALE: "ყიდვა",
  RENT: "ქირა",
  DAILY_RENT: "დღიური ქირა",
};

export function formatClientDealIntentLabel(
  dealType: DealType | string | null | undefined,
): string {
  if (!dealType) {
    return "";
  }
  if (isDealType(dealType)) {
    return CLIENT_DEAL_INTENT_LABELS[dealType];
  }
  return dealType;
}

export type ClientDealTypeSelectOption = { value: string; label: string };

export function buildClientFormDealTypeOptions(
  currentDealType?: DealType | null,
): ClientDealTypeSelectOption[] {
  const options: ClientDealTypeSelectOption[] = CLIENT_FORM_DEAL_TYPES.map(
    (dealType) => ({
      value: dealType,
      label: CLIENT_DEAL_INTENT_LABELS[dealType],
    }),
  );
  if (currentDealType === "DAILY_RENT") {
    options.push({
      value: "DAILY_RENT",
      label: CLIENT_DEAL_INTENT_LABELS.DAILY_RENT,
    });
  }
  return options;
}

export function buildClientListDealTypeFilterOptions(): ClientDealTypeSelectOption[] {
  return [
    { value: "", label: "ყველა გარიგება" },
    ...DEAL_TYPES.map((dealType) => ({
      value: dealType,
      label: CLIENT_DEAL_INTENT_LABELS[dealType],
    })),
  ];
}

export function mapClientInviteDealTypeSelectOptions(
  valuesFromSchema: string[] | undefined,
): ClientDealTypeSelectOption[] {
  const fallbackValues = CLIENT_FORM_DEAL_TYPES as readonly string[];
  const source =
    valuesFromSchema && valuesFromSchema.length > 0 ? valuesFromSchema : fallbackValues;
  return source
    .filter((value): value is DealType => isDealType(value))
    .filter(
      (value) =>
        value === "SALE" ||
        value === "RENT" ||
        value === "DAILY_RENT",
    )
    .map((value) => ({
      value,
      label: CLIENT_DEAL_INTENT_LABELS[value],
    }));
}
