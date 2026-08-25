import { DEAL_TYPE_LABELS, CLIENT_STATUS_LABELS } from "@/features/clients/clientEnums";
import type { LockState } from "@/features/clients/clientApi.types";
import type { ClientDetail } from "@/features/clients/types";
import { ClientDetailsLockBadge } from "@/widgets/ClientDetails/ClientDetailsLockBadge";
import {
  formatClientDetailsDate,
  formatClientDetailsDateTime,
} from "./clientDetailsFormatters";
import { CLIENT_DETAILS_STATUS_BADGE_CLASSES } from "./clientDetailsStatusBadgeClasses";

type ClientDetailsSummaryCardProps = {
  client: ClientDetail;
  getLock: (fieldKey: string, persisted?: LockState) => LockState;
  onLockChange: (fieldKey: string, nextLock: LockState) => void;
};

export function ClientDetailsSummaryCard({
  client,
  getLock,
  onLockChange,
}: ClientDetailsSummaryCardProps) {
  const phones = client.phones ?? [];
  const districts = client.districts ?? [];
  const addresses = client.addresses ?? [];
  const labels = client.labels ?? [];
  const districtsLock = getLock("districts", client.districtsLock);
  const addressesLock = getLock("addresses", client.addressesLock);
  const budgetMinLock = getLock("budgetMin", client.budgetMinLock);
  const budgetMaxLock = getLock("budgetMax", client.budgetMaxLock);
  const petLock = getLock("pet", client.petLock);

  const isRentDeal = client.dealType === "RENT" || client.dealType === "DAILY_RENT";
  const showDistrictsBlock = true;
  const showAddressesBlock = true;
  const showPetBlock = isRentDeal || Boolean(client.pet) || petLock !== "none";

  return (
    <div className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {client.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{DEAL_TYPE_LABELS[client.dealType]}</span>
          </div>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${CLIENT_DETAILS_STATUS_BADGE_CLASSES[client.status]}`}
        >
          {CLIENT_STATUS_LABELS[client.status]}
        </span>
      </div>

      {client.reminderDate && (
        <p className="mt-3 text-xs text-amber-700">
          Reminder: {formatClientDetailsDateTime(client.reminderDate)}
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
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

        {client.whatsapp && (
          <div>
            <p className="text-xs text-muted-foreground">WhatsApp</p>
            <p className="mt-1 text-sm font-medium text-foreground">{client.whatsapp}</p>
          </div>
        )}

        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-xs text-muted-foreground">მინ. ბიუჯეტი</p>
            <ClientDetailsLockBadge
              lock={budgetMinLock}
              onChange={(nextLock) => onLockChange("budgetMin", nextLock)}
            />
          </div>
          <p className="mt-1 text-sm font-medium text-foreground">
            {client.budgetMin !== null ? client.budgetMin.toLocaleString() : "—"}
          </p>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-xs text-muted-foreground">მაქს. ბიუჯეტი</p>
            <ClientDetailsLockBadge
              lock={budgetMaxLock}
              onChange={(nextLock) => onLockChange("budgetMax", nextLock)}
            />
          </div>
          <p className="mt-1 text-sm font-medium text-foreground">
            {client.budgetMax !== null ? client.budgetMax.toLocaleString() : "—"}
          </p>
        </div>

        {showPetBlock && (
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-xs text-muted-foreground">შინაური ცხოველი</p>
              <ClientDetailsLockBadge
                lock={petLock}
                onChange={(nextLock) => onLockChange("pet", nextLock)}
              />
            </div>
            <p className="mt-1 text-sm font-medium text-foreground">
              {client.pet ?? "—"}
            </p>
          </div>
        )}

        <div>
          <p className="text-xs text-muted-foreground">შექმნილია</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {formatClientDetailsDate(client.createdAt)}
          </p>
        </div>
      </div>

      {client.description && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">აღწერა</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
            {client.description}
          </p>
        </div>
      )}

      {showAddressesBlock && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-xs text-muted-foreground">მისამართები</p>
            <ClientDetailsLockBadge
              lock={addressesLock}
              onChange={(nextLock) => onLockChange("addresses", nextLock)}
            />
          </div>
          <div className="mt-1 space-y-0.5">
            {addresses.length > 0 ? (
              addresses.map((address, addressIndex) => (
                <p key={addressIndex} className="text-sm text-foreground">
                  {address}
                </p>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
        </div>
      )}

      {labels.length > 0 && (
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

      {showDistrictsBlock && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-xs text-muted-foreground">უბნები</p>
            <ClientDetailsLockBadge
              lock={districtsLock}
              onChange={(nextLock) => onLockChange("districts", nextLock)}
            />
          </div>
          <div className="mt-1 space-y-0.5">
            {districts.length > 0 ? (
              districts.map((district, districtIndex) => (
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
