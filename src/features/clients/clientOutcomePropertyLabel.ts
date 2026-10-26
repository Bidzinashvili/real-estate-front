import type { DealType } from "@/features/clients/clientEnums";
import { isRentDealType } from "@/features/clients/clientEnums";

export function formatClientOutcomePropertyFieldLabel(dealType: DealType): string {
  if (isRentDealType(dealType)) {
    return "რომელი ბინა ვაქირავეთ?";
  }
  return "რომელი ბინა ვაყიდინეთ?";
}

export function clientDealTypeToPropertyCatalogDealType(
  dealType: DealType,
): "SALE" | "RENT" {
  if (dealType === "SALE") {
    return "SALE";
  }
  return "RENT";
}
