"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useCurrentUser } from "@/shared/hooks";
import { usePropertyDetails } from "@/features/properties/usePropertyDetails";
import { canViewPrivateListingFields } from "@/features/properties/listingVisibility";
import { updateProperty, verifyProperty } from "@/features/properties/api";
import { PropertyListingRemindersModal } from "@/widgets/Properties/PropertyListingRemindersModal";
import { PropertyListingChangeStatusModal } from "@/widgets/Properties/PropertyListingChangeStatusModal";
import { calculateMatchScore } from "@/features/properties/matchScore";
import { PropertyDetailsViewContent } from "@/widgets/PropertyDetails/PropertyDetailsViewContent";
import type { ReminderConfigPayload } from "@/features/lifecycle/lifecycleEnums";

type PropertyDetailsReadOnlyBodyProps = {
  propertyId: string;
  layout: "page" | "embedded";
  onBeforeEditNavigation?: () => void;
};

export function PropertyDetailsReadOnlyBody({
  propertyId,
  layout,
  onBeforeEditNavigation,
}: PropertyDetailsReadOnlyBodyProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { property, isLoading, error, refetch } = usePropertyDetails(propertyId);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [isSavingReminder, setIsSavingReminder] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [reminderError, setReminderError] = useState<string | null>(null);

  const canEdit = useMemo(() => {
    if (!user || !property) return false;
    if (user.role === "ADMIN") return true;
    return user.role === "AGENT" && property.userId === user.id;
  }, [property, user]);

  const canViewPrivateFields = useMemo(() => {
    if (!user || !property) return false;
    return canViewPrivateListingFields(user, property);
  }, [property, user]);

  const handleGoBack = () => {
    router.push("/properties");
  };

  const matchScore = useMemo(() => {
    if (!property) {
      return { percentage: null, matched: 0, total: 0 };
    }

    if (property.apartment) {
      return calculateMatchScore(
        [
          { key: "elevator", label: "ლიფტი", value: property.apartment.elevator },
          {
            key: "centralHeating",
            label: "ცენტრალური გათბობა",
            value: property.apartment.centralHeating,
          },
          {
            key: "airConditioner",
            label: "კონდიციონერი",
            value: property.apartment.airConditioner,
          },
          { key: "furnished", label: "ავეჯით", value: property.apartment.furnished },
        ],
        property.apartment.needsVerification,
      );
    }

    if (property.privateHouse) {
      return calculateMatchScore(
        [
          {
            key: "centralHeating",
            label: "ცენტრალური გათბობა",
            value: property.privateHouse.centralHeating,
          },
          {
            key: "airConditioner",
            label: "კონდიციონერი",
            value: property.privateHouse.airConditioner,
          },
          {
            key: "furnished",
            label: "ავეჯით",
            value: property.privateHouse.furnished,
          },
        ],
        property.privateHouse.needsVerification,
      );
    }

    if (property.commercial) {
      return calculateMatchScore(
        [
          {
            key: "centralHeating",
            label: "ცენტრალური გათბობა",
            value: property.commercial.centralHeating,
          },
          {
            key: "airConditioner",
            label: "კონდიციონერი",
            value: property.commercial.airConditioner,
          },
        ],
        property.commercial.needsVerification,
      );
    }

    return { percentage: null, matched: 0, total: 0 };
  }, [property]);

  async function handleSaveReminder(payload: ReminderConfigPayload) {
    if (!property || !canEdit) {
      return;
    }
    setIsSavingReminder(true);
    setReminderError(null);
    try {
      await updateProperty(property.id, { reminder: payload });
      await refetch();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "შეხსენების შენახვა ვერ მოხერხდა.";
      setReminderError(message);
      throw error;
    } finally {
      setIsSavingReminder(false);
    }
  }

  async function handleVerifyNow() {
    if (!property || !canEdit) {
      return;
    }
    setIsVerifying(true);
    setReminderError(null);
    try {
      await verifyProperty(property.id);
      await refetch();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "განცხადების გადამოწმება ვერ მოხერხდა.";
      setReminderError(message);
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleArchiveProperty() {
    if (!property || !canEdit) {
      return;
    }

    setIsArchiving(true);
    setArchiveError(null);
    try {
      await updateProperty(property.id, { status: "ARCHIVED" });
      await refetch();
    } catch (error) {
      setArchiveError(
        error instanceof Error ? error.message : "განცხადების დაარქივება ვერ მოხერხდა.",
      );
    } finally {
      setIsArchiving(false);
    }
  }

  const loadingBlock = (
    <div className="flex min-h-[12rem] items-center justify-center text-muted-foreground">
      <p className="text-muted-foreground">განცხადების დეტალები იტვირთება…</p>
    </div>
  );

  if (isLoading || (!property && !error)) {
    return loadingBlock;
  }

  if (error || !property) {
    const message = error ?? "განცხადება ვერ მოიძებნა.";
    if (layout === "embedded") {
      return <p className="text-sm text-muted-foreground">{message}</p>;
    }
    return (
      <div className="flex w-full flex-col gap-4">
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
        <p className="text-muted-foreground">{message}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[12rem] items-center justify-center text-muted-foreground">
        <p className="text-muted-foreground">სესია იტვირთება…</p>
      </div>
    );
  }

  return (
    <>
      <PropertyDetailsViewContent
        property={property}
        canEdit={canEdit}
        canViewPrivateFields={canViewPrivateFields}
        layout={layout}
        isArchiving={isArchiving}
        archiveError={archiveError}
        matchPercentage={matchScore.percentage}
        onGoBack={handleGoBack}
        onBeforeEditNavigation={onBeforeEditNavigation}
        onOpenReminders={() => setIsRemindersOpen(true)}
        onOpenChangeStatus={() => setIsChangeStatusOpen(true)}
        onArchive={() => {
          void handleArchiveProperty();
        }}
        onSaveReminder={handleSaveReminder}
        onVerifyNow={handleVerifyNow}
        isSavingReminder={isSavingReminder}
        isVerifying={isVerifying}
        reminderError={reminderError}
      />
      <PropertyListingRemindersModal
        open={isRemindersOpen}
        property={property}
        onClose={() => setIsRemindersOpen(false)}
        onScheduled={() => {
          void refetch();
        }}
      />
      {canEdit ? (
        <PropertyListingChangeStatusModal
          open={isChangeStatusOpen}
          property={property}
          onClose={() => setIsChangeStatusOpen(false)}
          onSaved={() => {
            void refetch();
          }}
        />
      ) : null}
    </>
  );
}
