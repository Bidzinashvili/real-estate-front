"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useCurrentUser } from "@/shared/hooks";
import { usePropertyDetails } from "@/features/properties/usePropertyDetails";
import { canManageProperty, canViewPrivateListingFields } from "@/features/properties/listingVisibility";
import { updateProperty, verifyProperty, archiveProperty, unarchiveProperty, deleteProperty, restoreProperty } from "@/features/properties/api";
import { PropertyListingRemindersModal } from "@/widgets/Properties/PropertyListingRemindersModal";
import { PropertyListingChangeStatusModal } from "@/widgets/Properties/PropertyListingChangeStatusModal";
import { calculateMatchScore } from "@/features/properties/matchScore";
import { PropertyDetailsViewContent } from "@/widgets/PropertyDetails/PropertyDetailsViewContent";
import type { ReminderConfigPayload } from "@/features/lifecycle/lifecycleEnums";
import { canRestoreArchivedProperty } from "@/features/lifecycle/canRestoreArchivedRecord";
import { isPropertyArchived } from "@/features/lifecycle/isPropertyArchived";
import { useArchiveAction } from "@/features/lifecycle/useArchiveAction";
import { useSoftDeleteAction } from "@/features/lifecycle/useSoftDeleteAction";
import { ArchiveConfirmDialog } from "@/widgets/Lifecycle/ArchiveConfirmDialog";
import { DeleteConfirmDialog } from "@/widgets/Lifecycle/DeleteConfirmDialog";
import type { RecordColor } from "@/features/recordColor/recordColor";
import { useUpdateRecordColor } from "@/features/recordColor/useUpdateRecordColor";
import { useUpdateHideFromOthers } from "@/features/hideFromOthers/useUpdateHideFromOthers";

type PropertyDetailsReadOnlyBodyProps = {
  propertyId: string;
  layout: "page" | "embedded";
  onBeforeEditNavigation?: () => void;
  onDeleted?: () => void;
};

export function PropertyDetailsReadOnlyBody({
  propertyId,
  layout,
  onBeforeEditNavigation,
  onDeleted,
}: PropertyDetailsReadOnlyBodyProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { property, isLoading, error, refetch } = usePropertyDetails(propertyId);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [isSavingReminder, setIsSavingReminder] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [reminderError, setReminderError] = useState<string | null>(null);
  const { saveColor, isSaving: isSavingColor, error: colorError } =
    useUpdateRecordColor();
  const {
    saveHideFromOthers,
    isSaving: isSavingHideFromOthers,
    error: hideFromOthersError,
  } = useUpdateHideFromOthers();

  const canEdit = useMemo(() => {
    if (!user || !property) return false;
    return canManageProperty(user, property);
  }, [property, user]);

  const canViewPrivateFields = useMemo(() => {
    if (!user || !property) return false;
    return canViewPrivateListingFields(user, property);
  }, [property, user]);

  const archiveAction = useArchiveAction({
    canManage: canEdit,
    isArchived: property ? isPropertyArchived(property) : false,
    canRestore: property ? canRestoreArchivedProperty(property) : false,
    onArchive: () => {
      if (!property) {
        return Promise.resolve();
      }
      return archiveProperty(property.id);
    },
    onRestore: () => {
      if (!property) {
        return Promise.resolve();
      }
      return unarchiveProperty(property.id);
    },
    onSuccess: () => {
      void refetch();
    },
  });
  const deleteAction = useSoftDeleteAction({
    canManage: canEdit,
    onDelete: () => {
      if (!property) {
        return Promise.resolve();
      }
      return deleteProperty(property.id);
    },
    onRestore: () => {
      if (!property) {
        return Promise.resolve(null);
      }
      return restoreProperty(property.id);
    },
    onSuccess: () => {
      void refetch();
    },
    onDeleted: () => {
      onDeleted?.();
      if (layout === "embedded") {
        return;
      }
      if (property && isPropertyArchived(property)) {
        router.push("/archive");
        return;
      }
      router.push("/properties");
    },
  });

  const handleGoBack = () => {
    if (property && isPropertyArchived(property)) {
      router.push("/archive");
      return;
    }
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

  async function handleSelectColor(nextColor: RecordColor) {
    if (!property || !canEdit || property.color === undefined) {
      return;
    }
    try {
      await saveColor("property", property.id, nextColor);
      await refetch();
    } catch {
      return;
    }
  }

  async function handleToggleHideFromOthers(nextHidden: boolean) {
    if (!property || !canEdit) {
      return;
    }
    try {
      await saveHideFromOthers("property", property.id, nextHidden);
      await refetch();
    } catch {
      return;
    }
  }

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
        isArchiving={archiveAction.isPending}
        archiveError={archiveAction.error}
        matchPercentage={matchScore.percentage}
        canShowArchive={archiveAction.canShowArchive}
        canShowRestore={archiveAction.canShowRestore}
        canShowDelete={deleteAction.canShowDelete}
        isDeletePending={deleteAction.isPending}
        onGoBack={handleGoBack}
        onBeforeEditNavigation={onBeforeEditNavigation}
        onOpenReminders={() => setIsRemindersOpen(true)}
        onOpenChangeStatus={() => setIsChangeStatusOpen(true)}
        onArchive={archiveAction.requestArchive}
        onRestore={archiveAction.requestRestore}
        onRequestDelete={deleteAction.requestDelete}
        onSaveReminder={handleSaveReminder}
        onVerifyNow={handleVerifyNow}
        isSavingReminder={isSavingReminder}
        isVerifying={isVerifying}
        reminderError={reminderError}
        isSavingColor={isSavingColor}
        colorError={colorError}
        onSelectColor={(nextColor) => {
          void handleSelectColor(nextColor);
        }}
        isSavingHideFromOthers={isSavingHideFromOthers}
        hideFromOthersError={hideFromOthersError}
        onToggleHideFromOthers={(nextHidden) => {
          void handleToggleHideFromOthers(nextHidden);
        }}
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
      {archiveAction.confirmKind ? (
        <ArchiveConfirmDialog
          open
          kind={archiveAction.confirmKind}
          isProcessing={archiveAction.isPending}
          error={archiveAction.error}
          onConfirm={() => {
            void archiveAction.confirm();
          }}
          onCancel={archiveAction.cancel}
        />
      ) : null}
      {deleteAction.isConfirmOpen ? (
        <DeleteConfirmDialog
          open
          isProcessing={deleteAction.isPending}
          error={deleteAction.error}
          onConfirm={() => {
            void deleteAction.confirm();
          }}
          onCancel={deleteAction.cancel}
        />
      ) : null}
    </>
  );
}
