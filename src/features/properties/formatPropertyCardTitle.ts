import { formatPublicPropertyTitle } from "@/features/propertyShare/formatPublicPropertyTitle";
import type { Property } from "@/features/properties/types";

export function formatPropertyCardTitle(property: Property): string {
  const storedTitle = property.title?.trim();
  if (storedTitle) {
    return storedTitle;
  }

  return formatPublicPropertyTitle({
    dealType: property.dealType,
    propertyType: property.propertyType,
    district: property.district,
    city: property.city,
    hotelScope: property.hotelScope,
    rooms: property.apartment?.rooms ?? property.privateHouse?.rooms ?? null,
  });
}

export function formatPropertyStreetLine(property: Property): string {
  const street = property.address.trim();
  if (street) {
    return street;
  }
  return property.city.trim();
}
