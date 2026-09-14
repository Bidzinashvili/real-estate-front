"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePropertyOwnerDetails } from "@/features/propertyOwners/usePropertyOwnerDetails";
import { PROPERTY_OWNERS_LIST_HREF } from "@/features/propertyOwners/propertyOwnerRoutes";
import { PropertyOwnerIdentityCard } from "@/widgets/PropertyOwnerDetails/PropertyOwnerIdentityCard";
import { PropertyOwnerContactsSection } from "@/widgets/PropertyOwnerDetails/PropertyOwnerContactsSection";
import { PropertyOwnerLinkedProperties } from "@/widgets/PropertyOwnerDetails/PropertyOwnerLinkedProperties";

type PropertyOwnerDetailsViewProps = {
  ownerId: string;
};

export function PropertyOwnerDetailsView({ ownerId }: PropertyOwnerDetailsViewProps) {
  const router = useRouter();
  const { owner, isLoading, error, statusCode, refetch } =
    usePropertyOwnerDetails(ownerId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">მეპატრონე იტვირთება…</p>;
  }

  if (error || !owner) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => router.push(PROPERTY_OWNERS_LIST_HREF)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          ყველა მეპატრონე
        </button>
        <p className="text-sm text-destructive" role="alert">
          {statusCode === 403
            ? "ამ მეპატრონეზე წვდომა არ გაქვთ."
            : statusCode === 404
              ? "მეპატრონე ვერ მოიძებნა."
              : (error ?? "მეპატრონე ვერ მოიძებნა.")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => router.push(PROPERTY_OWNERS_LIST_HREF)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        ყველა მეპატრონე
      </button>

      <PropertyOwnerIdentityCard
        owner={owner}
        onUpdated={() => void refetch()}
      />
      <PropertyOwnerContactsSection
        owner={owner}
        onUpdated={() => void refetch()}
      />
      <PropertyOwnerLinkedProperties
        listings={owner.properties ?? []}
        propertyCount={owner.propertyCount}
      />
    </div>
  );
}
