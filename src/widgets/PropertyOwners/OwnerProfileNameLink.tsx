import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { PropertyOwnerSummary } from "@/features/propertyOwners/types";
import { propertyOwnerHref } from "@/features/propertyOwners/propertyOwnerRoutes";

type OwnerProfileNameLinkProps = {
  propertyOwner: PropertyOwnerSummary | null | undefined;
  className?: string;
};

export function OwnerProfileNameLink({
  propertyOwner,
  className,
}: OwnerProfileNameLinkProps) {
  if (!propertyOwner) {
    return null;
  }

  return (
    <Link
      href={propertyOwnerHref(propertyOwner.id)}
      className={
        className ??
        "inline-flex items-center gap-0.5 text-sm font-medium text-foreground underline-offset-2 hover:underline"
      }
    >
      მეპატრონე: {propertyOwner.name}
      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  );
}
