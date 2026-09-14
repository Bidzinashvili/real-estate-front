import { formatDealTypeLabel, isDealType } from "@/features/properties/dealType";
import { isHotelScope, isPropertyType } from "@/features/properties/propertyModelTypes";
import type { PropertyType } from "@/features/properties/propertyModelTypes";
import { formatGeorgianLocative } from "@/shared/i18n/formatGeorgianLocative";

export type PublicPropertyTitleSource = {
  dealType: string;
  propertyType: string;
  district?: string | null;
  city?: string | null;
  hotelScope?: string | null;
  rooms?: number | null;
};

const PUBLIC_TITLE_TYPE_NOUNS: Record<PropertyType, string> = {
  APARTMENT: "ბინა",
  PRIVATE_HOUSE: "სახლი",
  LAND_PLOT: "მიწის ნაკვეთი",
  COMMERCIAL: "კომერციული ფართი",
  COTTAGE: "აგარაკი",
  HOTEL: "სასტუმრო",
};

function publicTypeNoun(source: PublicPropertyTitleSource): string {
  if (!isPropertyType(source.propertyType)) {
    return "ობიექტი";
  }
  if (source.propertyType === "HOTEL" && isHotelScope(source.hotelScope ?? "")) {
    return source.hotelScope === "HOTEL_ROOM" ? "სასტუმროს ნომერი" : "სასტუმრო";
  }
  return PUBLIC_TITLE_TYPE_NOUNS[source.propertyType];
}

function roomsPrefix(rooms: number | null | undefined): string {
  if (rooms === null || rooms === undefined || !Number.isFinite(rooms) || rooms <= 0) {
    return "";
  }
  return `${rooms} ოთახიანი `;
}

export function formatPublicPropertyTitle(source: PublicPropertyTitleSource): string {
  const dealLabel = isDealType(source.dealType)
    ? formatDealTypeLabel(source.dealType)
    : "განცხადება";
  const typeNoun = publicTypeNoun(source);
  const roomsLabel = roomsPrefix(source.rooms);
  const headlineCore = `${dealLabel} ${roomsLabel}${typeNoun}`.replace(/\s+/g, " ").trim();
  const locationPlace = (source.district ?? "").trim() || (source.city ?? "").trim();
  const locative = formatGeorgianLocative(locationPlace);

  if (locative) {
    return `${headlineCore} ${locative}`;
  }
  return headlineCore;
}
