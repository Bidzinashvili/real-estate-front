"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import type { Property } from "@/features/properties/types";
import { collectPropertyTemporaryLocks } from "@/features/matching/collectTemporaryLocks";
import type { LockState, PropertyFieldLockKey, PropertyFieldLocks } from "@/features/matching/matchingEnums";
import { propertyMatchesHref } from "@/features/matching/matchingRoutes";
import { applyPropertyFieldLock } from "@/features/matching/persistEntityLock";
import { getApiBaseUrl } from "@/shared/lib/auth";
import { ui } from "@/shared/i18n/ui";
import { MatchingLockHint } from "@/widgets/ClientForm/PreferenceLockButton";
import { MatchPercentActions } from "@/widgets/Matching/MatchPercentActions";
import { PropertyViewActionsCard } from "@/widgets/PropertyDetails/PropertyViewActionsCard";
import { PropertyViewCharacteristics } from "@/widgets/PropertyDetails/PropertyViewCharacteristics";
import {
  PropertyViewPrivateComments,
  PropertyViewPublicComment,
} from "@/widgets/PropertyDetails/PropertyViewComments";
import { PropertyViewContactCard } from "@/widgets/PropertyDetails/PropertyViewContactCard";
import { PropertyViewGallery } from "@/widgets/PropertyDetails/PropertyViewGallery";
import { PropertyViewMetaCard } from "@/widgets/PropertyDetails/PropertyViewMetaCard";
import { PropertyViewSummaryCard } from "@/widgets/PropertyDetails/PropertyViewSummaryCard";
import { PropertyDetailsLifecycleSection } from "@/widgets/PropertyDetails/PropertyDetailsLifecycleSection";
import { formatDealTypeLabel, formatPropertyHeadline } from "@/widgets/PropertyDetails/propertyViewFormatters";
import { PropertyDetailWhatsAppButton } from "@/widgets/PropertyShare/PropertyDetailWhatsAppButton";
import { LifecycleStatusBadge } from "@/widgets/Lifecycle/LifecycleStatusBadge";
import { VerificationReminderPanel } from "@/widgets/Lifecycle/VerificationReminderPanel";
import { NoteRemindersSection } from "@/widgets/Reminders/NoteRemindersSection";
import type { ReminderConfigPayload } from "@/features/lifecycle/lifecycleEnums";
import { isRentalDealType } from "@/features/properties/propertyStatus";
import { isPropertyArchived } from "@/features/lifecycle/isPropertyArchived";
import { canVerifyPropertyListing, PROPERTY_VERIFICATION_COPY } from "@/features/lifecycle/propertyVerification";
import { canEditRecordColor, type RecordColor } from "@/features/recordColor/recordColor";
import { RecordColorPicker } from "@/widgets/RecordColor/RecordColorPicker";
import { HideFromOthersBadge } from "@/widgets/HideFromOthers/HideFromOthersBadge";
import { HideFromOthersToggle } from "@/widgets/HideFromOthers/HideFromOthersToggle";
import { ReadyToUploadBadge } from "@/widgets/ReadyToUpload/ReadyToUploadBadge";
import { ReadyToUploadToggle } from "@/widgets/ReadyToUpload/ReadyToUploadToggle";
import { AdminModeToggle } from "@/widgets/AdminMode/AdminModeToggle";

type PropertyDetailsViewContentProps = {
  property: Property;
  canEdit: boolean;
  layout: "page" | "embedded";
  isArchiving: boolean;
  archiveError: string | null;
  matchPercentage: number | null;
  canShowArchive: boolean;
  canShowRestore: boolean;
  canShowDelete: boolean;
  isDeletePending: boolean;
  onGoBack: () => void;
  onBeforeEditNavigation?: () => void;
  onOpenReminders: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onRequestDelete: () => void;
  onOpenChangeStatus: () => void;
  onSaveReminder: (payload: ReminderConfigPayload) => Promise<void>;
  onVerifyNow: () => Promise<void>;
  isSavingReminder: boolean;
  isVerifying: boolean;
  reminderError: string | null;
  verifyError: string | null;
  verifySuccessMessage: string | null;
  isSavingColor: boolean;
  colorError: string | null;
  onSelectColor: (color: RecordColor) => void;
  isSavingHideFromOthers: boolean;
  hideFromOthersError: string | null;
  onToggleHideFromOthers: (nextHidden: boolean) => void;
  isSavingReadyToUpload: boolean;
  readyToUploadError: string | null;
  onToggleReadyToUpload: (nextReady: boolean) => void;
};

export function PropertyDetailsViewContent({
  property,
  canEdit,
  layout,
  isArchiving,
  archiveError,
  matchPercentage,
  canShowArchive,
  canShowRestore,
  canShowDelete,
  isDeletePending,
  onGoBack,
  onBeforeEditNavigation,
  onOpenReminders,
  onArchive,
  onRestore,
  onRequestDelete,
  onOpenChangeStatus,
  onSaveReminder,
  onVerifyNow,
  isSavingReminder,
  isVerifying,
  reminderError,
  verifyError,
  verifySuccessMessage,
  isSavingColor,
  colorError,
  onSelectColor,
  isSavingHideFromOthers,
  hideFromOthersError,
  onToggleHideFromOthers,
  isSavingReadyToUpload,
  readyToUploadError,
  onToggleReadyToUpload,
}: PropertyDetailsViewContentProps) {
  const apiBaseUrl = getApiBaseUrl();
  const headline = formatPropertyHeadline(property);
  const canManageLocks = property.propertyType === "APARTMENT" && canEdit;
  const [fieldLockOverlay, setFieldLockOverlay] = useState<PropertyFieldLocks>(
    () => property.fieldLocks ?? {},
  );

  useEffect(() => {
    setFieldLockOverlay(property.fieldLocks ?? {});
  }, [property.id, property.updatedAt]);

  function handleFieldLockChange(lockKey: PropertyFieldLockKey, nextLock: LockState) {
    setFieldLockOverlay((previousLocks) =>
      applyPropertyFieldLock(previousLocks, lockKey, nextLock),
    );
  }

  const temporaryLockedFields = collectPropertyTemporaryLocks(fieldLockOverlay);
  const isArchivedListing = isPropertyArchived(property);
  const showVerifyAction = canEdit && canVerifyPropertyListing(property);

  return (
    <div className="flex w-full min-w-0 flex-col gap-5">
      <div className="flex flex-col gap-4">
        {layout === "page" ? (
          <button
            type="button"
            onClick={onGoBack}
            className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>განცხადებები</span>
          </button>
        ) : null}

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {headline}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {formatDealTypeLabel(property.dealType)}
              </span>
              <LifecycleStatusBadge
                kind="property"
                status={property.status}
                outcomeSource={property.outcomeSource}
                verificationReason={property.verificationReason}
                isArchived={isArchivedListing}
              />
              <HideFromOthersBadge isHidden={property.hideFromOthers === true} />
              <ReadyToUploadBadge isReady={property.readyToUpload} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AdminModeToggle />
            {canEditRecordColor(canEdit, property.color) && property.color !== undefined ? (
              <RecordColorPicker
                value={property.color}
                disabled={isSavingColor}
                onSelect={onSelectColor}
              />
            ) : null}
            {canEdit && property.hideFromOthers !== undefined ? (
              <HideFromOthersToggle
                isHidden={property.hideFromOthers}
                disabled={isSavingHideFromOthers}
                variant="icon"
                onToggle={onToggleHideFromOthers}
              />
            ) : null}
            {canEdit && property.readyToUpload !== undefined ? (
              <ReadyToUploadToggle
                isReady={property.readyToUpload}
                disabled={isSavingReadyToUpload}
                variant="icon"
                onToggle={onToggleReadyToUpload}
              />
            ) : null}
            <PropertyDetailWhatsAppButton property={property} />
            {property.propertyType === "APARTMENT" ? (
              <MatchPercentActions
                allHref={propertyMatchesHref(property.id, "GLOBAL")}
                mineHref={propertyMatchesHref(property.id, "MINE")}
                allLabel={`${ui.matchAll}: ${ui.allClients}`}
                mineLabel={`${ui.matchMine}: ${ui.myClients}`}
                sessionKind="property"
                entityId={property.id}
                temporaryLockedFields={temporaryLockedFields}
              />
            ) : null}
            {canEdit ? (
              <Link
                href={`/properties/${property.id}/edit`}
                onClick={() => {
                  onBeforeEditNavigation?.();
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                რედაქტირება
              </Link>
            ) : null}
          </div>
        </div>
        {colorError ? (
          <p className="text-xs text-destructive" role="alert">
            {colorError}
          </p>
        ) : null}
        {hideFromOthersError ? (
          <p className="text-xs text-destructive" role="alert">
            {hideFromOthersError}
          </p>
        ) : null}
        {readyToUploadError ? (
          <p className="text-xs text-destructive" role="alert">
            {readyToUploadError}
          </p>
        ) : null}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.9fr)] lg:items-start">
        <div className="order-1 min-w-0">
          <PropertyViewGallery images={property.images} apiBaseUrl={apiBaseUrl} />
        </div>

        <div className="order-2 h-auto min-w-0 self-start overflow-visible lg:col-start-2 lg:row-start-1">
          <PropertyViewSummaryCard
            property={property}
            fieldLocks={canManageLocks ? fieldLockOverlay : undefined}
            onFieldLockChange={canManageLocks ? handleFieldLockChange : undefined}
            canVerify={showVerifyAction}
            isVerifying={isVerifying}
            verifyError={verifyError}
            verifySuccessMessage={verifySuccessMessage}
            onVerify={showVerifyAction ? onVerifyNow : undefined}
          />
        </div>

        <div className="order-3 flex min-w-0 flex-col gap-5 lg:col-start-1">
          {canManageLocks ? <MatchingLockHint /> : null}
          <PropertyViewCharacteristics
            property={property}
            fieldLocks={canManageLocks ? fieldLockOverlay : undefined}
            onFieldLockChange={canManageLocks ? handleFieldLockChange : undefined}
          />
          <PropertyViewPublicComment property={property} />
        </div>

        <div className="order-4 flex min-w-0 flex-col gap-4 lg:col-start-2">
          <PropertyViewContactCard property={property} />
          <PropertyDetailsLifecycleSection
            property={property}
            canVerify={showVerifyAction}
            isVerifying={isVerifying}
            verifyError={verifyError}
            verifySuccessMessage={verifySuccessMessage}
            onVerify={showVerifyAction ? onVerifyNow : undefined}
          />
          {canEdit ? (
            <VerificationReminderPanel
              fields={property}
              presetSet={
                isRentalDealType(property.dealType) &&
                (property.status === "RENTED" || isArchivedListing)
                  ? "rentalExpiry"
                  : "verification"
              }
              canEdit={canEdit}
              isSaving={isSavingReminder}
              isVerifying={isVerifying}
              error={reminderError ?? verifyError}
              onSaveReminder={onSaveReminder}
              onVerifyNow={showVerifyAction ? onVerifyNow : undefined}
              verifyLabel={
                property.status === "NEEDS_VERIFICATION"
                  ? PROPERTY_VERIFICATION_COPY.verifyStillActive
                  : PROPERTY_VERIFICATION_COPY.verifyTodayCombined
              }
            />
          ) : null}
          {canEdit ? (
            <NoteRemindersSection
              targetType="PROPERTY"
              propertyId={property.id}
              canCreate={canEdit}
            />
          ) : null}
          <PropertyViewPrivateComments property={property} />
          <PropertyViewMetaCard property={property} />
          {layout === "page" ? (
            <PropertyViewActionsCard
              property={property}
              canEdit={canEdit}
              isArchivePending={isArchiving}
              archiveError={archiveError}
              matchPercentage={matchPercentage}
              canShowArchive={canShowArchive}
              canShowRestore={canShowRestore}
              canShowDelete={canShowDelete}
              isDeletePending={isDeletePending}
              isSavingColor={isSavingColor}
              onOpenReminders={onOpenReminders}
              onRequestArchive={onArchive}
              onRequestRestore={onRestore}
              onRequestDelete={onRequestDelete}
              onOpenChangeStatus={onOpenChangeStatus}
              onSelectColor={onSelectColor}
              isSavingHideFromOthers={isSavingHideFromOthers}
              hideFromOthersError={hideFromOthersError}
              onToggleHideFromOthers={onToggleHideFromOthers}
              isSavingReadyToUpload={isSavingReadyToUpload}
              readyToUploadError={readyToUploadError}
              onToggleReadyToUpload={onToggleReadyToUpload}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
