"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCurrentUser } from "@/shared/hooks";
import { useAdminMonitorDetails } from "@/features/collaboration/useAdminMonitors";
import {
  COLLABORATION_SPLIT_LABELS,
  MONITORING_STATE_LABELS,
} from "@/features/collaboration/collaborationLabels";
import {
  PROPERTY_STATUS_LABELS,
  lookupEnumLabel,
} from "@/shared/i18n/enumLabels";
import { CollaborationParticipantsList } from "@/widgets/Collaboration/CollaborationParticipantsList";
import { CollaborationStatusBadge } from "@/widgets/Collaboration/CollaborationStatusBadge";

type CollaborationMonitorDetailsViewProps = {
  monitorId: string;
};

export function CollaborationMonitorDetailsView({
  monitorId,
}: CollaborationMonitorDetailsViewProps) {
  const { user } = useCurrentUser();
  const { monitor, isLoading, error } = useAdminMonitorDetails(monitorId);

  if (user && user.role !== "ADMIN") {
    return (
      <p className="text-sm text-destructive" role="alert">
        ამ გვერდზე წვდომა მხოლოდ ადმინს აქვს.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href="/collaborations"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        თანამშრომლობაზე დაბრუნება
      </Link>

      {isLoading ? <p className="text-sm text-muted-foreground">ჩანაწერი იტვირთება…</p> : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {!isLoading && !error && monitor ? (
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">მონიტორინგის ჩანაწერი</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              ეს აგენტები გააცნეს ერთმანეთს ამ განცხადებაზე თანამშრომლობისთვის. განცხადება უნდა
              კონტროლდებოდეს, გაიყიდება თუ გაიქირავება.
            </p>
          </div>

          <section className="space-y-2 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
            <h2 className="text-sm font-semibold text-foreground">განცხადება</h2>
            <p className="text-sm font-medium text-foreground">
              {monitor.property.address}
              {monitor.property.city ? `, ${monitor.property.city}` : ""}
            </p>
            <p className="text-xs text-muted-foreground">{monitor.property.district}</p>
            <p className="text-sm text-foreground">
              სტატუსი:{" "}
              {lookupEnumLabel(PROPERTY_STATUS_LABELS, monitor.propertyStatus) ??
                monitor.propertyStatus}
            </p>
            <p className="text-sm text-foreground">
              მონიტორინგი: {MONITORING_STATE_LABELS[monitor.monitoringState]}
            </p>
            <Link
              href={`/properties/${monitor.property.id}`}
              className="inline-flex text-sm font-medium text-foreground underline-offset-2 hover:underline"
            >
              განცხადების გახსნა
            </Link>
          </section>

          <section className="space-y-2 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
            <h2 className="text-sm font-semibold text-foreground">თანამშრომლობა</h2>
            <p className="text-sm text-foreground">{COLLABORATION_SPLIT_LABELS[monitor.split]}</p>
            <CollaborationStatusBadge status={monitor.collaboration.status} />
            <p className="text-xs text-muted-foreground">
              მოთხოვნის ID: {monitor.collaborationRequestId}
            </p>
            <p className="text-xs text-muted-foreground">
              დამტკიცება: {new Date(monitor.approvedAt).toLocaleString("ka-GE")}
            </p>
            <Link
              href={`/collaborations/${monitor.collaborationRequestId}`}
              className="inline-flex text-sm font-medium text-foreground underline-offset-2 hover:underline"
            >
              მოთხოვნის გახსნა
            </Link>
          </section>

          <section className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
            <h2 className="text-sm font-semibold text-foreground">აგენტები</h2>
            <CollaborationParticipantsList
              participants={monitor.collaboration.participants}
              identitiesRevealed
            />
          </section>
        </div>
      ) : null}
    </div>
  );
}
