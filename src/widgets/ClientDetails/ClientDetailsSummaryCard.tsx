import { DEAL_TYPE_LABELS, CLIENT_STATUS_LABELS } from "@/features/clients/clientEnums";
import type { ClientDetail } from "@/features/clients/types";
import { ClientDetailsLockBadge } from "@/widgets/ClientDetails/ClientDetailsLockBadge";
import {
  formatClientDetailsDate,
  formatClientDetailsDateTime,
} from "./clientDetailsFormatters";
import { CLIENT_DETAILS_STATUS_BADGE_CLASSES } from "./clientDetailsStatusBadgeClasses";

type ClientDetailsSummaryCardProps = {
  client: ClientDetail;
};

export function ClientDetailsSummaryCard({ client }: ClientDetailsSummaryCardProps) {
  const phones = client.phones ?? [];
  const districts = client.districts ?? [];
  const addresses = client.addresses ?? [];
  const labels = client.labels ?? [];
  const showDistrictsBlock =
    districts.length > 0 ||
    (client.districtsLock !== undefined && client.districtsLock !== "none");

  const budgetRange =
    client.budgetMin !== null || client.budgetMax !== null
      ? [
          client.budgetMin !== null ? client.budgetMin.toLocaleString() : null,
          client.budgetMax !== null ? client.budgetMax.toLocaleString() : null,
        ]
          .filter(Boolean)
          .join(" – ")
      : null;

  const showAddressesBlock =
    addresses.length > 0 ||
    (client.addressesLock !== undefined && client.addressesLock !== "none");
  const showLabelsBlock =
    labels.length > 0 || (client.labelsLock !== undefined && client.labelsLock !== "none");
  const showPetBlock =
    Boolean(client.pet) ||
    (client.petLock !== undefined && client.petLock !== "none");

  return (
    <div className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {client.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{DEAL_TYPE_LABELS[client.dealType]}</span>
            {(budgetRange ||
              (client.budgetMinLock !== undefined && client.budgetMinLock !== "none") ||
              (client.budgetMaxLock !== undefined && client.budgetMaxLock !== "none")) && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="inline-flex flex-wrap items-center gap-1.5">
                  {budgetRange ? <span>{budgetRange}</span> : null}
                  {client.budgetMinLock !== undefined ? (
                    <ClientDetailsLockBadge lock={client.budgetMinLock} />
                  ) : null}
                  {client.budgetMaxLock !== undefined &&
                  client.budgetMaxLock !== client.budgetMinLock ? (
                    <ClientDetailsLockBadge lock={client.budgetMaxLock} />
                  ) : null}
                </span>
              </>
            )}
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

        {showPetBlock && (
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-xs text-muted-foreground">შინაური ცხოველი</p>
              {client.petLock !== undefined ? (
                <ClientDetailsLockBadge lock={client.petLock} />
              ) : null}
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
            {client.addressesLock !== undefined ? (
              <ClientDetailsLockBadge lock={client.addressesLock} />
            ) : null}
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

      {showLabelsBlock && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-xs text-muted-foreground">ლეიბლები</p>
            {client.labelsLock !== undefined ? <ClientDetailsLockBadge lock={client.labelsLock} /> : null}
          </div>
          <div className="mt-1 space-y-0.5">
            {labels.length > 0 ? (
              labels.map((label, labelIndex) => (
                <p key={labelIndex} className="text-sm text-foreground">
                  {label}
                </p>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
        </div>
      )}

      {showDistrictsBlock && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-xs text-muted-foreground">უბნები</p>
            {client.districtsLock !== undefined ? (
              <ClientDetailsLockBadge lock={client.districtsLock} />
            ) : null}
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
