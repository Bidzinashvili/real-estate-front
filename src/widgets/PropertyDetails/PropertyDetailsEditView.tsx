"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { useCurrentUser } from "@/shared/hooks";
import { usePropertyDetails } from "@/features/properties/usePropertyDetails";
import { useUpdateProperty } from "@/features/properties/useUpdateProperty";
import { PropertyDetailsCard } from "@/widgets/PropertyDetails/PropertyDetailsCard";
import { useEffect, useMemo, useState } from "react";
import type { Property, PropertyUpdatePayload } from "@/features/properties/types";
import { canManageProperty, canViewPrivateListingFields } from "@/features/properties/listingVisibility";
import { refetchUpdatedProperty } from "@/features/properties/saveFlow";

type PropertyDetailsEditViewProps = {
  propertyId: string;
};

export function PropertyDetailsEditView({ propertyId }: PropertyDetailsEditViewProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { property, isLoading, error, refetch } = usePropertyDetails(propertyId);
  const { update, isLoading: isSaving, error: saveError } = useUpdateProperty();
  const [latestProperty, setLatestProperty] = useState<Property | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (property) {
      setLatestProperty(property);
    }
  }, [property]);

  const activeProperty = latestProperty ?? property;

  const canEdit = useMemo(() => {
    if (!user || !activeProperty) return false;
    return canManageProperty(user, activeProperty);
  }, [activeProperty, user]);

  const canViewPrivateFields = useMemo(() => {
    if (!user || !activeProperty) return false;
    return canViewPrivateListingFields(user, activeProperty);
  }, [activeProperty, user]);

  useEffect(() => {
    if (!activeProperty || !user) return;
    if (!canEdit) {
      router.replace(`/properties/${propertyId}`);
    }
  }, [activeProperty, canEdit, propertyId, router, user]);

  const handleGoBack = () => {
    router.push("/properties");
  };

  const handleSubmit = async (payload: PropertyUpdatePayload) => {
    if (!activeProperty || !canEdit) return;
    await update(activeProperty.id, payload);
    const refreshed = await refetchUpdatedProperty(activeProperty.id, refetch);
    if (refreshed) {
      setLatestProperty(refreshed);
    }
    setSuccessMessage("განცხადება შენახულია.");
  };

  if (isLoading || (!activeProperty && !error)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted text-foreground">
        <p className="text-muted-foreground">განცხადების დეტალები იტვირთება…</p>
      </main>
    );
  }

  if (error || !activeProperty) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted text-foreground">
        <div className="flex w-full max-w-xl flex-col gap-4 px-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="self-start text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>უკან</span>
            </span>
          </button>
          <p className="text-muted-foreground">
            {error ?? "განცხადება ვერ მოიძებნა."}
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted text-foreground">
        <p className="text-muted-foreground">სესია იტვირთება…</p>
      </main>
    );
  }

  if (!canEdit) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted text-foreground">
        <p className="text-muted-foreground">გადამისამართება…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted text-foreground">
      <div className="flex w-full max-w-2xl flex-col gap-4 px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleGoBack}
            className="self-start text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>განცხადებები</span>
            </span>
          </button>
          <Link
            href={`/properties/${propertyId}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            ობიექტის ნახვა
          </Link>
        </div>

        <PropertyDetailsCard
          property={activeProperty}
          presentation="edit"
          canEdit={canEdit}
          canViewPrivateFields={canViewPrivateFields}
          isSaving={isSaving}
          saveError={saveError}
          onSubmit={handleSubmit}
          onImagesChanged={async () => {
            const refreshed = await refetch();
            if (refreshed?.id === activeProperty.id) {
              setLatestProperty(refreshed);
            }
          }}
        />
        {successMessage && !saveError && (
          <p className="text-sm text-emerald-600">{successMessage}</p>
        )}
      </div>
    </main>
  );
}
