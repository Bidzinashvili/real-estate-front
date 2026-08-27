import {
  formatBuildingAgeTypeLabel,
  formatBuildingConditionLabel,
  formatHotelScopeLabel,
  formatKitchenTypeLabel,
  formatLandCategoryLabel,
  formatLandUsageLabel,
  formatPropertyTypeLabel,
  formatRenovationLabel,
} from "@/features/properties/addPropertyFormOptions";
import { formatDealTypeLabel } from "@/features/properties/dealType";
import {
  formatPropertyStatusLabel,
  type Property,
  type PropertyStatus,
} from "@/features/properties/types";
import { COMMERCIAL_STATUS_LABELS, lookupEnumLabel } from "@/shared/i18n/enumLabels";

export const NEEDS_VERIFICATION_LABEL = "გადასამოწმებელია";

export function formatPropertyHeadline(property: Property): string {
  const district = property.district.trim();
  const address = property.address.trim();
  if (district && address) {
    return `${district}, ${address}`;
  }
  if (address) {
    return address;
  }
  if (district) {
    return district;
  }
  const city = property.city.trim();
  return city || "განცხადება";
}

export function formatPropertyFullAddress(property: Property): string {
  const parts = [property.city, property.district, property.address]
    .map((part) => part.trim())
    .filter((part) => part !== "");
  return parts.join(", ");
}

export function formatGelAmount(amount: number | null | undefined): string | null {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return null;
  }
  return `${amount.toLocaleString()} ₾`;
}

export function formatPropertyDateTime(isoTimestamp: string | null | undefined): string | null {
  if (!isoTimestamp || isoTimestamp.trim() === "") {
    return null;
  }
  const parsed = new Date(isoTimestamp);
  if (Number.isNaN(parsed.getTime())) {
    return isoTimestamp;
  }
  return parsed.toLocaleString();
}

export function isRentalDeal(property: Property): boolean {
  return property.dealType === "RENT" || property.dealType === "DAILY_RENT";
}

export function propertyAreaSquareMeters(property: Property): number | null {
  return (
    property.apartment?.totalArea ??
    property.privateHouse?.totalArea ??
    property.landPlot?.landArea ??
    property.commercial?.area ??
    null
  );
}

export function formatCommercialStatusLabel(raw: string | null | undefined): string | null {
  return lookupEnumLabel(COMMERCIAL_STATUS_LABELS, raw);
}

export function propertyTypeDisplayLabel(property: Property): string {
  const typeLabel = formatPropertyTypeLabel(property.propertyType) ?? property.propertyType;
  if (property.propertyType === "HOTEL" && property.hotelScope) {
    return `${typeLabel} · ${formatHotelScopeLabel(property.hotelScope)}`;
  }
  return typeLabel;
}

export function propertyStatusBadgeClass(status: PropertyStatus): string {
  if (status === "NEEDS_VERIFICATION") {
    return "bg-warning-muted text-warning-foreground";
  }
  if (status === "AVAILABLE_SOON") {
    return "bg-primary/15 text-primary";
  }
  if (status === "RENTED" || status === "SOLD" || status === "ARCHIVED") {
    return "bg-muted text-muted-foreground";
  }
  return "bg-success-muted text-success-foreground";
}

export {
  formatBuildingAgeTypeLabel,
  formatBuildingConditionLabel,
  formatDealTypeLabel,
  formatKitchenTypeLabel,
  formatLandCategoryLabel,
  formatLandUsageLabel,
  formatPropertyStatusLabel,
  formatRenovationLabel,
};
