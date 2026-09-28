import type { ReactNode } from "react";
import { DEAL_TYPE_LABELS } from "@/features/clients/clientEnums";
import type { LockState } from "@/features/clients/clientApi.types";
import type { ClientDetail } from "@/features/clients/types";
import { ClientDetailsLockBadge } from "@/widgets/ClientDetails/ClientDetailsLockBadge";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import { formatLifecycleDate } from "@/features/lifecycle/formatLifecycleDate";
import { isClientArchived } from "@/features/lifecycle/isClientArchived";
import { LifecycleStatusBadge } from "@/widgets/Lifecycle/LifecycleStatusBadge";
import { HideFromOthersBadge } from "@/widgets/HideFromOthers/HideFromOthersBadge";
import { ClientProfileCompactIndicator } from "@/widgets/ClientProfiles/ClientProfileCompactIndicator";
import { isAgencySharedClientView } from "@/features/databaseList/viewerOwnership";
import { formatSharedClientHeadline } from "@/features/clients/formatSharedClientCriteria";
import { isCustomRecordColor } from "@/features/recordColor/recordColor";
import { recordColorSurfaceClassName } from "@/features/recordColor/recordColorSurface";
import { RecordTimestamp } from "@/widgets/RecordTimestamp/RecordTimestamp";
import { NoteLastOpenedLabel } from "@/widgets/NoteLastOpened/NoteLastOpenedLabel";
import { cn } from "@/shared/lib/utils";
import {
  inferClientCityFromDistricts,
  shouldShowTbilisiNeighborhoods,
} from "@/features/clients/clientCities";
import { RecordManagingAgentLine } from "@/widgets/RecordManagingAgent/RecordManagingAgentLine";

type ClientDetailsSummaryCardProps = {
  client: ClientDetail;
  getLock: (fieldKey: string, persisted?: LockState) => LockState;
  onLockChange: (fieldKey: string, nextLock: LockState) => void;
  canViewContactDetails?: boolean;
  showLockControls?: boolean;
};

export function ClientDetailsSummaryCard({
  client,
  getLock,
  onLockChange,
  canViewContactDetails = true,
  showLockControls = true,
}: ClientDetailsSummaryCardProps) {
  const isSharedView = isAgencySharedClientView(client);
  const phones = canViewContactDetails ? (client.phones ?? []) : [];
  const whatsapp = canViewContactDetails ? client.whatsapp : null;
  const districts = client.districts ?? [];
  const inferredCity = inferClientCityFromDistricts(districts);
  const showTbilisiNeighborhoods = shouldShowTbilisiNeighborhoods(inferredCity);
  const neighborhoodNames = showTbilisiNeighborhoods ? districts : [];
  const addresses = client.addresses ?? [];
  const labels = client.labels ?? [];
  const districtsLock = getLock("districts", client.districtsLock);
  const addressesLock = getLock("addresses", client.addressesLock);
  const budgetMinLock = getLock("budgetMin", client.budgetMinLock);
  const budgetMaxLock = getLock("budgetMax", client.budgetMaxLock);
  const petLock = getLock("pet", client.petLock);

  const isRentDeal = client.dealType === "RENT" || client.dealType === "DAILY_RENT";
  const showPetBlock =
    isRentDeal || Boolean(client.pet) || (showLockControls && petLock !== "none");
  const headline = isSharedView
    ? formatSharedClientHeadline(client)
    : client.name.trim() || formatSharedClientHeadline(client);

  function renderLockBadge(
    fieldKey: string,
    lock: LockState,
    persistedLock: LockState,
  ): ReactNode {
    if (!showLockControls) {
      return null;
    }
    return (
      <ClientDetailsLockBadge
        lock={lock}
        persistedLock={persistedLock}
        onChange={(nextLock) => onLockChange(fieldKey, nextLock)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl p-6 shadow-sm ring-1",
        !isSharedView && isCustomRecordColor(client.color)
          ? recordColorSurfaceClassName(client.color)
          : "bg-card ring-border",
      )}
    >
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {headline}
          </h1>
          <RecordManagingAgentLine
            userId={client.userId}
            managingAgent={client.managingAgent}
          />
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{DEAL_TYPE_LABELS[client.dealType]}</span>
            {isSharedView ? (
              <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                საერთო მოთხოვნა
              </span>
            ) : null}
          </div>
          {!isSharedView ? (
            <div className="mt-2">
              <ClientProfileCompactIndicator
                clientProfileId={client.clientProfileId}
                clientProfile={client.clientProfile}
              />
            </div>
          ) : (
            <div className="mt-2">
              <ClientProfileCompactIndicator
                clientProfileId={null}
                clientProfile={client.clientProfile}
                allowProfileLink={false}
              />
            </div>
          )}
        </div>
        <LifecycleStatusBadge
          kind="client"
          status={client.status}
          outcomeSource={isSharedView ? null : client.outcomeSource}
          verificationReason={isSharedView ? null : client.verificationReason}
        />
        {!isSharedView && client.hideFromOthers !== undefined ? (
          <HideFromOthersBadge isHidden={client.hideFromOthers === true} />
        ) : null}
        {isClientArchived(client) ? (
          <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {ARCHIVE_COPY.archivedBadge}
          </span>
        ) : null}
      </div>

      {!isSharedView && formatLifecycleDate(client.lastVerifiedAt) ? (
        <p className="mt-3 text-xs text-muted-foreground">
          გადამოწმებულია: {formatLifecycleDate(client.lastVerifiedAt)}
        </p>
      ) : null}
      {formatLifecycleDate(client.archivedAt) ? (
        <p className="mt-1 text-xs text-muted-foreground">
          {ARCHIVE_COPY.archivedAtLabel}: {formatLifecycleDate(client.archivedAt)}
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
        {canViewContactDetails && phones.length > 0 ? (
          <div>
            <p className="text-xs text-muted-foreground">ტელეფონები</p>
            <div className="mt-1 space-y-0.5">
              {phones.map((phone, phoneIndex) => (
                <p key={phoneIndex} className="text-sm font-medium text-foreground">
                  {phone}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {canViewContactDetails && whatsapp ? (
          <div>
            <p className="text-xs text-muted-foreground">WhatsApp</p>
            <p className="mt-1 text-sm font-medium text-foreground">{whatsapp}</p>
          </div>
        ) : null}

        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-xs text-muted-foreground">მინ. ბიუჯეტი</p>
            {renderLockBadge("budgetMin", budgetMinLock, client.budgetMinLock ?? "none")}
          </div>
          <p className="mt-1 text-sm font-medium text-foreground">
            {client.budgetMin !== null ? client.budgetMin.toLocaleString() : "—"}
          </p>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-xs text-muted-foreground">მაქს. ბიუჯეტი</p>
            {renderLockBadge("budgetMax", budgetMaxLock, client.budgetMaxLock ?? "none")}
          </div>
          <p className="mt-1 text-sm font-medium text-foreground">
            {client.budgetMax !== null ? client.budgetMax.toLocaleString() : "—"}
          </p>
        </div>

        {showPetBlock && (
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-xs text-muted-foreground">შინაური ცხოველი</p>
              {renderLockBadge("pet", petLock, client.petLock ?? "none")}
            </div>
            <p className="mt-1 text-sm font-medium text-foreground">
              {client.pet ?? "—"}
            </p>
          </div>
        )}

        <div className="sm:col-span-2">
          <RecordTimestamp
            createdAt={client.createdAt}
            updatedAt={client.updatedAt}
          />
          {!isSharedView && client.noteLastOpenedAt !== undefined ? (
            <NoteLastOpenedLabel
              className="mt-1.5"
              noteLastOpenedAt={client.noteLastOpenedAt}
            />
          ) : null}
        </div>
      </div>

      {!isSharedView && client.description ? (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">აღწერა</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
            {client.description}
          </p>
        </div>
      ) : null}

      {addresses.length > 0 ? (
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-xs text-muted-foreground">მისამართები</p>
            {renderLockBadge("addresses", addressesLock, client.addressesLock ?? "none")}
          </div>
          <div className="mt-1 space-y-0.5">
            {addresses.map((address, addressIndex) => (
              <p key={addressIndex} className="text-sm text-foreground">
                {address}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      {!isSharedView && labels.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">ლეიბლები</p>
          <div className="mt-1 space-y-0.5">
            {labels.map((label, labelIndex) => (
              <p key={labelIndex} className="text-sm text-foreground">
                {label}
              </p>
            ))}
          </div>
        </div>
      )}

      {(inferredCity || neighborhoodNames.length > 0) && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">ქალაქი</p>
          <p className="mt-1 text-sm text-foreground">{inferredCity}</p>
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <p className="text-xs text-muted-foreground">უბნები</p>
            {renderLockBadge("districts", districtsLock, client.districtsLock ?? "none")}
          </div>
          <div className="mt-1 space-y-0.5">
            {showTbilisiNeighborhoods && neighborhoodNames.length > 0 ? (
              neighborhoodNames.map((district, districtIndex) => (
                <p key={districtIndex} className="text-sm text-foreground">
                  {district}
                </p>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
