import type { DealType } from "@/features/properties/dealType";
import type { PropertyStatus } from "@/features/properties/propertyStatus";
import type { PropertyType } from "@/features/properties/propertyModelTypes";

export type HiddenPropertyCoverImage = {
  id?: string;
  url: string;
  originalName: string;
};

export type HiddenPropertyItem = {
  id: string;
  propertyType: PropertyType;
  dealType: DealType;
  district: string;
  address: string;
  street: string | null;
  pricePublic: number;
  status: PropertyStatus;
  archivedAt: string | null;
  coverImage: HiddenPropertyCoverImage | null;
  hiddenAt: string;
};

export type HiddenPropertiesListResponse = {
  hiddenProperties: HiddenPropertyItem[];
};

export type UnhideClientPropertyResponse = {
  unhidden: true;
  id: string;
};
