"use client";

import { useState } from "react";
import { Bell, Eye, MapPin } from "lucide-react";
import { formatHotelScopeLabel } from "@/features/properties/addPropertyFormOptions";
import { formatDealTypeLabel } from "@/features/properties/dealType";
import { formatPropertyCardTitle, formatPropertyStreetLine } from "@/features/properties/formatPropertyCardTitle";
import { propertyCompactStats } from "@/features/properties/propertyCompactStats";
import type { Property } from "@/features/properties/types";
import { PROPERTY_TYPE_LABELS } from "@/shared/i18n/enumLabels";
import { PropertyCardImageCarousel } from "@/widgets/Properties/PropertyCardImageCarousel";
import { PropertyListingCardManager } from "@/widgets/Properties/PropertyListingCardManager";
import { PropertyListingCardPriceRow } from "@/widgets/Properties/PropertyListingCardPriceRow";
import { propertyMatchesHref } from "@/features/matching/matchingRoutes";
import { ui } from "@/shared/i18n/ui";
import { MatchPercentActions } from "@/widgets/Matching/MatchPercentActions";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import { formatLifecycleDate } from "@/features/lifecycle/formatLifecycleDate";
import { isPropertyArchived } from "@/features/lifecycle/isPropertyArchived";
import { canVerifyPropertyListing } from "@/features/lifecycle/propertyVerification";
import { useVerifyProperty } from "@/features/lifecycle/useVerifyProperty";
import { LifecycleStatusBadge } from "@/widgets/Lifecycle/LifecycleStatusBadge";
import { PropertyVerificationStatus } from "@/widgets/Lifecycle/PropertyVerificationStatus";
import { NoteReminderIndicator } from "@/widgets/Reminders/NoteReminderIndicator";
import { ReminderPickerModal } from "@/widgets/Reminders/ReminderPickerModal";
import { formatReminderScheduleLabel } from "@/features/reminders/formatReminderSchedule";
import {
  canEditRecordColor,
  isCustomRecordColor,
  type RecordColor,
} from "@/features/recordColor/recordColor";
import { recordColorSurfaceClassName } from "@/features/recordColor/recordColorSurface";
import { useUpdateRecordColor } from "@/features/recordColor/useUpdateRecordColor";
import { RecordColorPicker } from "@/widgets/RecordColor/RecordColorPicker";
import { HideFromOthersBadge } from "@/widgets/HideFromOthers/HideFromOthersBadge";
import { HideFromOthersToggle } from "@/widgets/HideFromOthers/HideFromOthersToggle";
import { ReadyToUploadBadge } from "@/widgets/ReadyToUpload/ReadyToUploadBadge";
import { useUpdateHideFromOthers } from "@/features/hideFromOthers/useUpdateHideFromOthers";
import { ClosedRecordStatChips } from "@/widgets/DatabaseList/ClosedRecordStatChips";
import { RecordTimestamp } from "@/widgets/RecordTimestamp/RecordTimestamp";
import { cn } from "@/shared/lib/utils";
import { propertyAreaSquareMeters } from "@/widgets/PropertyDetails/propertyViewFormatters";

function formatOwnerLine(property: Property) {
  const profileName = property.propertyOwner?.name?.trim();
  const name = profileName || property.ownerName?.trim();
  const phone = (property.ownerPhones ?? [])
    .map((ownerPhone) => ownerPhone.trim())
    .filter((ownerPhone) => ownerPhone !== "")
    .join(", ");
  if (name && phone) return `${name} • ${phone}`;
  if (name) return name;
  if (phone) return phone;
  return "";
}

type PropertyListingCardProps = {
  property: Property;
  apiBaseUrl: string | null;
  onView: (propertyId: string) => void;
  canChangeStatus?: boolean;
  canSetReminders?: boolean;
  onListingChanged?: () => void;
};

export function PropertyListingCard({
  property,
  apiBaseUrl,
  onView,
  canChangeStatus = false,
  canSetReminders = false,
  onListingChanged,
}: PropertyListingCardProps) {
  const generatedTitle = formatPropertyCardTitle(property);
  const streetLine = formatPropertyStreetLine(property);
  const areaSquareMeters = propertyAreaSquareMeters(property);
  const compactStats = propertyCompactStats(property);
  const ownerLine = canChangeStatus ? formatOwnerLine(property) : "";
  const nextReminderLabel =
    property.reminderSummary &&
    property.reminderSummary.activeCount > 0 &&
    property.reminderSummary.nextReminderAt
      ? formatReminderScheduleLabel(property.reminderSummary.nextReminderAt)
      : null;
  const [isReminderPickerOpen, setIsReminderPickerOpen] = useState(false);
  const { saveColor, isSaving: isSavingColor, error: colorError } =
    useUpdateRecordColor();
  const {
    saveHideFromOthers,
    isSaving: isSavingHideFromOthers,
    error: hideFromOthersError,
  } = useUpdateHideFromOthers();
  const canEditColor = canEditRecordColor(canChangeStatus, property.color);
  const hasCustomColor = isCustomRecordColor(property.color);
  const canToggleHideFromOthers =
    canChangeStatus &&
    Boolean(onListingChanged) &&
    property.hideFromOthers !== undefined;
  const listingOurSiteId = property.ourSiteId?.trim() ?? "";
  const listingPublicComment = property.publicComment?.trim() ?? "";
  const isArchivedListing = isPropertyArchived(property);
  const {
    verifyListing,
    isVerifying,
    error: verifyError,
    successMessage: verifySuccessMessage,
  } = useVerifyProperty();
  const canShowVerify =
    canChangeStatus &&
    Boolean(onListingChanged) &&
    canVerifyPropertyListing(property);

  async function handleVerifyListing() {
    if (!onListingChanged) {
      return;
    }
    const didVerify = await verifyListing(property.id);
    if (didVerify) {
      onListingChanged();
    }
  }

  async function handleSelectColor(nextColor: RecordColor) {
    if (!onListingChanged || property.color === undefined) {
      return;
    }
    try {
      await saveColor("property", property.id, nextColor);
      onListingChanged();
    } catch {
      return;
    }
  }

  async function handleToggleHideFromOthers(nextHidden: boolean) {
    if (!onListingChanged) {
      return;
    }
    try {
      await saveHideFromOthers("property", property.id, nextHidden);
      onListingChanged();
    } catch {
      return;
    }
  }

  return (
    <>
    <article
      onClick={() => onView(property.id)}
      className={cn(
        "flex min-w-0 w-full cursor-pointer flex-col overflow-hidden rounded-3xl shadow-sm ring-1 transition-shadow hover:shadow-md",
        hasCustomColor
          ? recordColorSurfaceClassName(property.color)
          : "bg-card ring-border",
      )}
    >
      <div className="relative">
        <div className="relative aspect-[3/2] w-full overflow-hidden">
          <PropertyCardImageCarousel
            propertyId={property.id}
            images={property.images}
            apiBaseUrl={apiBaseUrl}
            alt={generatedTitle}
          />
          <div className="absolute left-3 top-3 z-[15] flex max-w-[calc(100%-3.25rem)] flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
              {formatDealTypeLabel(property.dealType)}
            </span>
            <LifecycleStatusBadge
              kind="property"
              status={property.status}
              outcomeSource={property.outcomeSource}
              verificationReason={property.verificationReason}
              isArchived={isArchivedListing}
            />
            {isArchivedListing ? (
              <span className="inline-flex rounded-full bg-black/55 px-2.5 py-0.5 text-xs font-semibold text-white">
                {ARCHIVE_COPY.archivedBadge}
              </span>
            ) : null}
            {canSetReminders && property.reminderSummary ? (
              <NoteReminderIndicator summary={property.reminderSummary} />
            ) : null}
            <HideFromOthersBadge isHidden={property.hideFromOthers === true} />
            <ReadyToUploadBadge isReady={property.readyToUpload} />
          </div>
        </div>
        {(canChangeStatus || canSetReminders) && onListingChanged ? (
          <PropertyListingCardManager
            property={property}
            onListingChanged={onListingChanged}
            canChangeStatus={canChangeStatus}
            canSetReminders={canSetReminders}
            canEditColor={canEditColor}
            onSelectColor={handleSelectColor}
            isSavingColor={isSavingColor}
            colorError={colorError}
            canToggleHideFromOthers={canToggleHideFromOthers}
            onToggleHideFromOthers={handleToggleHideFromOthers}
            isSavingHideFromOthers={isSavingHideFromOthers}
            hideFromOthersError={hideFromOthersError}
            canVerify={canShowVerify}
            isVerifying={isVerifying}
            onVerify={() => {
              void handleVerifyListing();
            }}
          />
        ) : null}
      </div>

      <div className="space-y-2.5 p-3">
        <div className="flex items-start justify-between gap-3">
          <PropertyListingCardPriceRow
            pricePublic={property.pricePublic}
            areaSquareMeters={areaSquareMeters}
          />
          <span className="flex shrink-0 flex-col items-end gap-1">
            <span className="rounded-full bg-success-muted px-2 py-0.5 text-[10px] font-semibold text-success">
              {PROPERTY_TYPE_LABELS[property.propertyType] ?? property.propertyType}
            </span>
            {property.propertyType === "HOTEL" && property.hotelScope ? (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                {formatHotelScopeLabel(property.hotelScope)}
              </span>
            ) : null}
          </span>
        </div>

        <p className="line-clamp-2 text-lg font-semibold leading-snug text-foreground">
          {generatedTitle}
        </p>

        {listingOurSiteId ? (
          <p className="text-xs text-muted-foreground">ID: {listingOurSiteId}</p>
        ) : null}

        {streetLine ? (
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="min-w-0">{streetLine}</span>
          </p>
        ) : null}

        <ClosedRecordStatChips items={compactStats} />

        <PropertyVerificationStatus
          status={property.status}
          archivedAt={property.archivedAt}
          lastVerifiedAt={property.lastVerifiedAt}
          canManage={canShowVerify}
          isVerifying={isVerifying}
          error={verifyError}
          successMessage={verifySuccessMessage}
          onVerify={
            canShowVerify
              ? () => {
                  void handleVerifyListing();
                }
              : undefined
          }
        />

        {listingPublicComment ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {listingPublicComment}
          </p>
        ) : null}

        {canSetReminders && nextReminderLabel ? (
          <p className="text-xs text-muted-foreground">
            შეხსენება: {nextReminderLabel}
          </p>
        ) : null}

        <RecordTimestamp
          createdAt={property.createdAt}
          updatedAt={property.updatedAt}
        />

        <div
          className="space-y-2 pt-1"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onView(property.id);
              }}
              className="inline-flex h-9 min-w-[7rem] items-center justify-center gap-1.5 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
              ნახვა
            </button>
            {canSetReminders && onListingChanged ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsReminderPickerOpen(true);
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:bg-muted"
                aria-label="შეხსენების დაყენება"
                title="შეხსენების დაყენება"
              >
                <Bell className="h-4 w-4" aria-hidden />
              </button>
            ) : null}
            {canEditColor && property.color !== undefined ? (
              <RecordColorPicker
                value={property.color}
                disabled={isSavingColor}
                triggerClassName="h-9 w-9"
                onSelect={(nextColor) => {
                  void handleSelectColor(nextColor);
                }}
              />
            ) : null}
            {canToggleHideFromOthers && property.hideFromOthers !== undefined ? (
              <HideFromOthersToggle
                isHidden={property.hideFromOthers}
                disabled={isSavingHideFromOthers}
                variant="icon"
                onToggle={(nextHidden) => {
                  void handleToggleHideFromOthers(nextHidden);
                }}
              />
            ) : null}
            {property.propertyType === "APARTMENT" ? (
              <MatchPercentActions
                allHref={propertyMatchesHref(property.id, "GLOBAL")}
                mineHref={propertyMatchesHref(property.id, "MINE")}
                allLabel={`${ui.matchAll}: ${ui.allClients}`}
                mineLabel={`${ui.matchMine}: ${ui.myClients}`}
                sessionKind="property"
                entityId={property.id}
              />
            ) : null}
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
          {ownerLine ? (
            <p className="min-w-0 truncate text-xs text-muted-foreground">
              {ownerLine}
            </p>
          ) : null}
          {formatLifecycleDate(property.archivedAt) ? (
            <p className="text-xs text-muted-foreground">
              დაარქივებულია: {formatLifecycleDate(property.archivedAt)}
            </p>
          ) : null}
        </div>
      </div>
    </article>
    {canSetReminders && onListingChanged ? (
      <ReminderPickerModal
        mode="create"
        open={isReminderPickerOpen}
        target={{ targetType: "PROPERTY", propertyId: property.id }}
        onClose={() => setIsReminderPickerOpen(false)}
        onSaved={onListingChanged}
      />
    ) : null}
    </>
  );
}
