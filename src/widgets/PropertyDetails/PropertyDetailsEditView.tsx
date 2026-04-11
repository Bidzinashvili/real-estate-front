"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCurrentUser } from "@/shared/hooks";
import { usePropertyDetails } from "@/features/properties/usePropertyDetails";
import { useUpdateProperty } from "@/features/properties/useUpdateProperty";
import { PropertyDetailsCard } from "@/widgets/PropertyDetails/PropertyDetailsCard";
import { useEffect, useMemo, useState } from "react";
import type { Property, PropertyUpdatePayload } from "@/features/properties/types";
import { canViewPrivateListingFields } from "@/features/properties/listingVisibility";
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
    if (user.role === "ADMIN") return true;
    return user.role === "AGENT" && activeProperty.userId === user.id;
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
    setSuccessMessage("Property saved successfully.");
  };

  if (isLoading || (!activeProperty && !error)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <p className="text-slate-500">Loading property details…</p>
      </main>
    );
  }

  if (error || !activeProperty) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="flex w-full max-w-xl flex-col gap-4 px-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="self-start text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Go back</span>
            </span>
          </button>
          <p className="text-slate-500">
            {error ?? "We could not find this property."}
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <p className="text-slate-500">Loading your session…</p>
      </main>
    );
  }

  if (!canEdit) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <p className="text-slate-500">Redirecting…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
      <div className="flex w-full max-w-2xl flex-col gap-4 px-4">
        <button
          type="button"
          onClick={handleGoBack}
          className="self-start text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <span className="inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Go back</span>
          </span>
        </button>

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
