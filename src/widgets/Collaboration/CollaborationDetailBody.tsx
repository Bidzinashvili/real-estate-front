"use client";

import { useState } from "react";
import Link from "next/link";
import type { CollaborationRequestDto } from "@/features/collaboration/collaborationApi.types";
import {
  canAdminDecide,
  canViewerNegotiate,
  type CollaborationSplit,
} from "@/features/collaboration/collaborationEnums";
import {
  COLLABORATION_SPLIT_LABELS,
  COLLABORATION_SPLIT_SHORT_LABELS,
  formatCollaborationProposalUpdatedHint,
  MONITORING_STATE_LABELS,
} from "@/features/collaboration/collaborationLabels";
import { parseSupportedListingCurrency } from "@/features/currency/types";
import {
  DEAL_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
  lookupEnumLabel,
} from "@/shared/i18n/enumLabels";
import { formatListingAmount } from "@/widgets/PropertyDetails/propertyViewFormatters";
import { CollaborationStatusBadge } from "@/widgets/Collaboration/CollaborationStatusBadge";
import { CollaborationParticipantsList } from "@/widgets/Collaboration/CollaborationParticipantsList";
import {
  COLLABORATION_CLIENT_TARGET_LABEL,
  COLLABORATION_PROPERTY_DELETED_LABEL,
  formatCollaborationPropertyDistrict,
  formatCollaborationRequestHeadline,
} from "@/widgets/Collaboration/collaborationPropertyDisplay";
import { CollaborationClientDecisionSection } from "@/widgets/Collaboration/CollaborationClientDecisionSection";
import { collaborationClientHasRevealedContact } from "@/features/collaboration/collaborationClientContact";
import { CollaborationCounterOfferPanel } from "@/widgets/Collaboration/CollaborationCounterOfferPanel";

type CollaborationDetailBodyProps = {
  collaboration: CollaborationRequestDto;
  isAdmin: boolean;
  isSubmitting: boolean;
  actionError: string | null;
  onAccept?: () => void;
  onReject?: () => void;
  onCounter?: (split: CollaborationSplit, additionalParticipantIds: string[]) => void;
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
  onCounter,
  onAdminApprove,
  onAdminReject,
}: CollaborationDetailBodyProps) {
  const [confirmReject, setConfirmReject] = useState(false);
  const [showCounterPanel, setShowCounterPanel] = useState(false);
  const listing = collaboration.property;
  const listingPriceLabel = listing
    ? formatListingAmount(
        listing.pricePublic,
        parseSupportedListingCurrency(listing.currency),
      )
    : null;
  const isClientOnlyCollaboration = !listing && Boolean(collaboration.clientId ?? collaboration.client);
  const identitiesRevealed = collaboration.status === "APPROVED" || isAdmin;
  const awaitingRole = collaboration.awaitingRole ?? null;
  const showNegotiationActions = canViewerNegotiate(collaboration.viewerRole, awaitingRole);
  const showAdminActions = isAdmin && canAdminDecide(collaboration.status);
  const clientRecord = collaboration.client;
  const clientContactRevealed = clientRecord
    ? collaborationClientHasRevealedContact(clientRecord)
    : false;
  const splitSectionTitle =
    collaboration.status === "PENDING_ADMIN" || collaboration.acceptedAt
      ? "შეთანხმებული განაწილება"
      : "შეთავაზებული განაწილება";
  const proposalUpdatedHint = formatCollaborationProposalUpdatedHint(
    collaboration.proposedByRole,
    collaboration.viewerRole,
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">თანამშრომლობის მოთხოვნა</h1>
          <p className="text-sm text-muted-foreground">
            {formatCollaborationRequestHeadline(collaboration, identitiesRevealed)}
            {listing
              ? ` · ${formatCollaborationPropertyDistrict(listing) ?? "—"}`
              : isClientOnlyCollaboration
                ? ` · ${COLLABORATION_CLIENT_TARGET_LABEL}`
                : ""}
          </p>
        </div>
        <CollaborationStatusBadge
          status={collaboration.status}
          viewerRole={collaboration.viewerRole}
          awaitingRole={awaitingRole}
        />
      </div>

      {listing ? (
        <section className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
          <h2 className="text-sm font-semibold text-foreground">განცხადება</h2>
          <p className="text-sm text-foreground">
            {lookupEnumLabel(DEAL_TYPE_LABELS, listing.dealType) ?? listing.dealType} ·{" "}
            {lookupEnumLabel(PROPERTY_STATUS_LABELS, listing.status) ?? listing.status}
          </p>
          <p className="text-sm font-medium text-foreground">
            {listingPriceLabel ?? "—"}
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
      ) : isClientOnlyCollaboration ? null : (
        <section className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
          <h2 className="text-sm font-semibold text-foreground">განცხადება</h2>
          <p className="text-sm text-muted-foreground">{COLLABORATION_PROPERTY_DELETED_LABEL}</p>
        </section>
      )}

      <section className="space-y-2 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
        <h2 className="text-sm font-semibold text-foreground">{splitSectionTitle}</h2>
        <p className="text-lg font-semibold text-foreground">
          {COLLABORATION_SPLIT_SHORT_LABELS[collaboration.split]}
        </p>
        <p className="text-sm text-muted-foreground">
          {COLLABORATION_SPLIT_LABELS[collaboration.split]}
        </p>
        {collaboration.proposedAt ? (
          <p className="text-xs text-muted-foreground">
            შეთავაზების დრო: {formatDateTime(collaboration.proposedAt)}
          </p>
        ) : null}
        {proposalUpdatedHint ? (
          <p className="text-xs text-muted-foreground">{proposalUpdatedHint}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          ეს არის თანამშრომლობის გაყოფა და არა შესაბამისობის პროცენტი.
        </p>
      </section>

      {clientRecord ? (
        <CollaborationClientDecisionSection
          clientRecord={clientRecord}
          showClientLink={clientContactRevealed}
        />
      ) : null}

      {showNegotiationActions ? (
        <>
          {actionError ? (
            <p className="text-sm text-destructive" role="alert">
              {actionError}
            </p>
          ) : null}

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
            {!showCounterPanel ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowCounterPanel(true)}
                className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                სხვა პირობების შეთავაზება
              </button>
            ) : null}
          </div>

          {showCounterPanel && onCounter ? (
            <CollaborationCounterOfferPanel
              currentSplit={collaboration.split}
              participants={collaboration.participants}
              isSubmitting={isSubmitting}
              onCancel={() => setShowCounterPanel(false)}
              onSubmit={(split, additionalParticipantIds) => {
                setShowCounterPanel(false);
                onCounter(split, additionalParticipantIds);
              }}
            />
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
        </>
      ) : null}

      {!showNegotiationActions ? (
        <section className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
          <h2 className="text-sm font-semibold text-foreground">მონაწილეები</h2>
          <CollaborationParticipantsList
            participants={collaboration.participants}
            identitiesRevealed={identitiesRevealed}
          />
        </section>
      ) : null}

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

      {actionError && !showNegotiationActions ? (
        <p className="text-sm text-destructive" role="alert">
          {actionError}
        </p>
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

      {confirmReject && !showNegotiationActions ? (
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
