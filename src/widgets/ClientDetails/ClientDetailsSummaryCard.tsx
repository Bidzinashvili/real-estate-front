import { DEAL_TYPE_LABELS, CLIENT_STATUS_LABELS } from "@/features/clients/clientEnums";
import type { ClientDetail } from "@/features/clients/types";
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

  const budgetRange =
    client.budgetMin !== null || client.budgetMax !== null
      ? [
          client.budgetMin !== null ? client.budgetMin.toLocaleString() : null,
          client.budgetMax !== null ? client.budgetMax.toLocaleString() : null,
        ]
          .filter(Boolean)
          .join(" – ")
      : null;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {client.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span>{DEAL_TYPE_LABELS[client.dealType]}</span>
            {budgetRange && (
              <>
                <span className="text-slate-300">·</span>
                <span>{budgetRange}</span>
              </>
            )}
            {districts.length > 0 && (
              <>
                <span className="text-slate-300">·</span>
                <span>{districts.join(", ")}</span>
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

      <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-slate-500">Phones</p>
          <div className="mt-1 space-y-0.5">
            {phones.map((phone, phoneIndex) => (
              <p key={phoneIndex} className="text-sm font-medium text-slate-800">
                {phone}
              </p>
            ))}
          </div>
        </div>

        {client.whatsapp && (
          <div>
            <p className="text-xs text-slate-500">WhatsApp</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{client.whatsapp}</p>
          </div>
        )}

        {client.pet && (
          <div>
            <p className="text-xs text-slate-500">Pet</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{client.pet}</p>
          </div>
        )}

        <div>
          <p className="text-xs text-slate-500">Created</p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {formatClientDetailsDate(client.createdAt)}
          </p>
        </div>
      </div>

      {client.description && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-500">Description</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
            {client.description}
          </p>
        </div>
      )}

      {addresses.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-500">Addresses</p>
          <div className="mt-1 space-y-0.5">
            {addresses.map((address, addressIndex) => (
              <p key={addressIndex} className="text-sm text-slate-800">
                {address}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
