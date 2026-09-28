"use client";

import { useRouter } from "next/navigation";
import { ArchiveCarryLink } from "@/features/lifecycle/ArchiveCarryLink";
import {
  archiveRecordBackLabel,
  carryArchiveNavigation,
  isOpenedFromArchiveLocation,
  recordListHref,
} from "@/features/lifecycle/archiveNavigation";
import { isPropertyArchived } from "@/features/lifecycle/isPropertyArchived";
import { useOpenedFromArchive } from "@/features/lifecycle/useOpenedFromArchive";
import { ArrowLeft, Eye } from "lucide-react";
import { useEffectiveAccessViewer } from "@/features/adminMode/useEffectiveAccessViewer";
import { useCurrentUser } from "@/shared/hooks";
import { usePropertyDetails } from "@/features/properties/usePropertyDetails";
import { useUpdateProperty } from "@/features/properties/useUpdateProperty";
import { PropertyDetailsCard } from "@/widgets/PropertyDetails/PropertyDetailsCard";
import { AdminModeToggle } from "@/widgets/AdminMode/AdminModeToggle";
import { useEffect, useMemo, useState } from "react";
import type { Property, PropertyUpdatePayload } from "@/features/properties/types";
import { canManageProperty } from "@/features/properties/listingVisibility";
import { refetchUpdatedProperty } from "@/features/properties/saveFlow";
import { NoteRemindersSection } from "@/widgets/Reminders/NoteRemindersSection";

type PropertyDetailsEditViewProps = {
  propertyId: string;
};

export function PropertyDetailsEditView({ propertyId }: PropertyDetailsEditViewProps) {
  const router = useRouter();
  const openedFromArchive = useOpenedFromArchive();
  const { user } = useCurrentUser();
  const accessViewer = useEffectiveAccessViewer();
  const { property, isLoading, error, refetch } =
    usePropertyDetails(propertyId);
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
    if (!accessViewer || !activeProperty) return false;
    return canManageProperty(accessViewer, activeProperty);
  }, [activeProperty, accessViewer]);

  useEffect(() => {
    if (!activeProperty || !user) return;
    if (!canEdit) {
      router.replace(carryArchiveNavigation(`/properties/${propertyId}`));
    }
  }, [activeProperty, canEdit, propertyId, router, user]);

  const listingIsArchived = activeProperty ? isPropertyArchived(activeProperty) : false;
  const listBackLabel = archiveRecordBackLabel(
    "property",
    openedFromArchive || listingIsArchived,
  );

  const handleGoBack = () => {
    router.push(
      recordListHref(
        "property",
        isOpenedFromArchiveLocation() ||
          (activeProperty ? isPropertyArchived(activeProperty) : false),
      ),
    );
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
              <span>{listBackLabel}</span>
            </span>
          </button>
          <ArchiveCarryLink
            href={`/properties/${propertyId}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            ობიექტის ნახვა
          </ArchiveCarryLink>
          <AdminModeToggle />
        </div>

        <NoteRemindersSection
          targetType="PROPERTY"
          propertyId={activeProperty.id}
          canManage={canEdit}
        />

        <PropertyDetailsCard
          property={activeProperty}
          presentation="edit"
          canEdit={canEdit}
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
