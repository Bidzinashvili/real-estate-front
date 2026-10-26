"use client";

import Link from "next/link";
import { formatPropertyCardTitle } from "@/features/properties/formatPropertyCardTitle";
import { usePropertyDetails } from "@/features/properties/usePropertyDetails";

type ClientLinkedPropertyLineProps = {
  propertyId: string;
};

export function ClientLinkedPropertyLine({ propertyId }: ClientLinkedPropertyLineProps) {
  const { property, isLoading, error } = usePropertyDetails(propertyId);

  const label =
    property !== null
      ? formatPropertyCardTitle(property)
      : isLoading
        ? "იტვირთება…"
        : error
          ? "ბინის დეტალები ვერ ჩაიტვირთა"
          : propertyId;

  return (
    <div>
      <p className="text-xs text-muted-foreground">დაკავშირებული ბინა</p>
      <Link
        href={`/properties/${propertyId}`}
        className="mt-1 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline"
      >
        {label}
      </Link>
    </div>
  );
}
