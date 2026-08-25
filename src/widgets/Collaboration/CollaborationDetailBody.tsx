"use client";

import { useState } from "react";
import Link from "next/link";
import type { CollaborationRequestDto } from "@/features/collaboration/collaborationApi.types";
import {
  canAdminDecide,
  canRecipientDecide,
} from "@/features/collaboration/collaborationEnums";
import {
  COLLABORATION_SPLIT_LABELS,
  MONITORING_STATE_LABELS,
} from "@/features/collaboration/collaborationLabels";
import {
  CLIENT_STATUS_LABELS,
  DEAL_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
  lookupEnumLabel,
} from "@/shared/i18n/enumLabels";
import { CollaborationStatusBadge } from "@/widgets/Collaboration/CollaborationStatusBadge";
import { CollaborationParticipantsList } from "@/widgets/Collaboration/CollaborationParticipantsList";

type CollaborationDetailBodyProps = {
  collaboration: CollaborationRequestDto;
  isAdmin: boolean;
  isSubmitting: boolean;
  actionError: string | null;
  onAccept?: () => void;
  onReject?: () => void;
  onAdminApprove?: () => void;
  onAdminReject?: () => void;
};

function formatDateTime(value: string | null): string {
  if (!value) {
    return "—";
  }
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }
  return parsedDate.toLocaleString("ka-GE");
}

export function CollaborationDetailBody({
  collaboration,
  isAdmin,
  isSubmitting,
  actionError,
  onAccept,
  onReject,
  onAdminApprove,
  onAdminReject,
}: CollaborationDetailBodyProps) {
  const [confirmReject, setConfirmReject] = useState(false);
  const listing = collaboration.property;
  const identitiesRevealed = collaboration.status === "APPROVED" || isAdmin;
  const showRecipientActions = canRecipientDecide(
    collaboration.viewerRole,
    collaboration.status,
  );
  const showAdminActions = isAdmin && canAdminDecide(collaboration.status);
  const clientRecord = collaboration.client;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">თანამშრომლობის მოთხოვნა</h1>
          <p className="text-sm text-muted-foreground">
            {listing.address}
            {listing.city ? `, ${listing.city}` : ""} · {listing.district}
          </p>
        </div>
        <CollaborationStatusBadge status={collaboration.status} />
      </div>

      <section className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        <h2 className="text-sm font-semibold text-foreground">განცხადება</h2>
        <p className="text-sm text-foreground">
          {lookupEnumLabel(DEAL_TYPE_LABELS, listing.dealType) ?? listing.dealType} ·{" "}
          {lookupEnumLabel(PROPERTY_STATUS_LABELS, listing.status) ?? listing.status}
        </p>
        <p className="text-sm font-medium text-foreground">
          {listing.pricePublic.toLocaleString()}
        </p>
        {listing.publicComment ? (
          <p className="text-sm text-muted-foreground">{listing.publicComment}</p>
        ) : null}
        <Link
          href={`/properties/${listing.id}`}
          className="inline-flex text-sm font-medium text-foreground underline-offset-2 hover:underline"
        >
          განცხადების გახსნა
        </Link>
      </section>

      <section className="space-y-2 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        <h2 className="text-sm font-semibold text-foreground">თანამშრომლობის წილი</h2>
        <p className="text-sm text-foreground">{COLLABORATION_SPLIT_LABELS[collaboration.split]}</p>
        <p className="text-xs text-muted-foreground">
          ეს არის თანამშრომლობის გაყოფა და არა შესაბამისობის პროცენტი.
        </p>
      </section>

      {clientRecord ? (
        <section className="space-y-2 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
          <h2 className="text-sm font-semibold text-foreground">კლიენტი</h2>
          <p className="text-sm text-foreground">{clientRecord.name ?? "დეტალები დამალულია დამტკიცებამდე"}</p>
          {clientRecord.phones && clientRecord.phones.length > 0 ? (
            <p className="text-xs text-muted-foreground">{clientRecord.phones.join(", ")}</p>
          ) : null}
          {clientRecord.dealType || clientRecord.status ? (
            <p className="text-xs text-muted-foreground">
              {lookupEnumLabel(DEAL_TYPE_LABELS, clientRecord.dealType) ?? clientRecord.dealType ?? "—"}
              {clientRecord.status
                ? ` · ${lookupEnumLabel(CLIENT_STATUS_LABELS, clientRecord.status) ?? clientRecord.status}`
                : ""}
            </p>
          ) : null}
          <Link
            href={`/clients/${clientRecord.id}`}
            className="inline-flex text-sm font-medium text-foreground underline-offset-2 hover:underline"
          >
            კლიენტის გახსნა
          </Link>
        </section>
      ) : null}

      <section className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        <h2 className="text-sm font-semibold text-foreground">მონაწილეები</h2>
        <CollaborationParticipantsList
          participants={collaboration.participants}
          identitiesRevealed={identitiesRevealed}
        />
      </section>

      <section className="space-y-1 rounded-xl bg-card p-4 text-xs text-muted-foreground shadow-sm ring-1 ring-border">
        <p>მოთხოვნა: {formatDateTime(collaboration.createdAt)}</p>
        <p>მიღება: {formatDateTime(collaboration.acceptedAt)}</p>
        <p>უარყოფა: {formatDateTime(collaboration.rejectedAt)}</p>
        <p>ადმინის გადაწყვეტილება: {formatDateTime(collaboration.adminDecidedAt)}</p>
        <p>დამტკიცება: {formatDateTime(collaboration.approvedAt)}</p>
      </section>

      {isAdmin && collaboration.monitor ? (
        <section className="space-y-2 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
          <h2 className="text-sm font-semibold text-foreground">მონიტორინგი</h2>
          <p className="text-sm text-foreground">
            {MONITORING_STATE_LABELS[collaboration.monitor.monitoringState]}
          </p>
          <Link
            href={`/collaborations/monitors/${collaboration.monitor.id}`}
            className="inline-flex text-sm font-medium text-foreground underline-offset-2 hover:underline"
          >
            ნოუთბუქის ჩანაწერის ნახვა
          </Link>
        </section>
      ) : null}

      {actionError ? (
        <p className="text-sm text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}

      {showRecipientActions ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onAccept}
            className="inline-flex items-center rounded-full bg-success px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            მიღება
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => setConfirmReject(true)}
            className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive shadow-sm transition hover:bg-destructive/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            უარყოფა
          </button>
        </div>
      ) : null}

      {showAdminActions ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onAdminApprove}
            className="inline-flex items-center rounded-full bg-success px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            დამტკიცება
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => setConfirmReject(true)}
            className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive shadow-sm transition hover:bg-destructive/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            უარყოფა
          </button>
        </div>
      ) : null}

      {confirmReject ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm text-foreground">დარწმუნებული ხართ, რომ გსურთ უარყოფა?</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setConfirmReject(false);
                if (showAdminActions) {
                  onAdminReject?.();
                  return;
                }
                onReject?.();
              }}
              className="inline-flex items-center rounded-full bg-destructive px-4 py-2 text-sm font-medium text-white"
            >
              დიახ, უარყოფა
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setConfirmReject(false)}
              className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
            >
              გაუქმება
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
