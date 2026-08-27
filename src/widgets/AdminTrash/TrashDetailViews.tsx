"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCurrentUser } from "@/shared/hooks";
import { formatLifecycleDateTime } from "@/features/lifecycle/formatLifecycleDate";
import { isRecordArchived } from "@/features/lifecycle/isRecordArchived";
import { PROPERTY_STATUS_LABELS } from "@/features/properties/propertyStatus";
import { CLIENT_STATUS_LABELS } from "@/features/clients/clientEnums";
import { TRASH_COPY } from "@/features/adminTrash/trashCopy";
import {
  useTrashClientDetail,
  useTrashPropertyDetail,
} from "@/features/adminTrash/useTrashDetail";
import { TrashRecordActions } from "@/widgets/AdminTrash/TrashRecordActions";

type TrashPropertyDetailViewProps = {
  recordId: string;
};

export function TrashPropertyDetailView({ recordId }: TrashPropertyDetailViewProps) {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const isAdmin = user?.role === "ADMIN";
  const { record, isLoading, error, statusCode } = useTrashPropertyDetail(
    recordId,
    isAdmin,
  );
  const router = useRouter();

  return (
    <TrashDetailFrame
      isUserLoading={isUserLoading}
      isAdmin={isAdmin}
      isLoading={isLoading}
      error={error}
      statusCode={statusCode}
      title={record?.address || record?.district || record?.city || "განცხადება"}
    >
      {record ? (
        <>
          <TrashDetailFields
            deletedAt={record.deletedAt}
            archivedAt={record.archivedAt}
            status={
              PROPERTY_STATUS_LABELS[
                record.status as keyof typeof PROPERTY_STATUS_LABELS
              ] ?? record.status
            }
            agentName={record.agent?.fullName || record.agent?.email}
            extraRows={[
              { label: "მისამართი", value: record.address },
              { label: "უბანი", value: record.district },
              { label: "ქალაქი", value: record.city },
            ]}
          />
          <TrashRecordActions
            kind="property"
            recordId={record.id}
            archivedAt={record.archivedAt}
            onCompleted={() => {
              router.push("/admin/trash");
            }}
          />
        </>
      ) : null}
    </TrashDetailFrame>
  );
}

type TrashClientDetailViewProps = {
  recordId: string;
};

export function TrashClientDetailView({ recordId }: TrashClientDetailViewProps) {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const isAdmin = user?.role === "ADMIN";
  const { record, isLoading, error, statusCode } = useTrashClientDetail(
    recordId,
    isAdmin,
  );
  const router = useRouter();

  return (
    <TrashDetailFrame
      isUserLoading={isUserLoading}
      isAdmin={isAdmin}
      isLoading={isLoading}
      error={error}
      statusCode={statusCode}
      title={record?.name || "კლიენტი"}
    >
      {record ? (
        <>
          <TrashDetailFields
            deletedAt={record.deletedAt}
            archivedAt={record.archivedAt}
            status={
              CLIENT_STATUS_LABELS[
                record.status as keyof typeof CLIENT_STATUS_LABELS
              ] ?? record.status
            }
            agentName={record.agent?.fullName || record.agent?.email}
            extraRows={[
              { label: "სახელი", value: record.name },
              {
                label: "ტელეფონი",
                value: record.phones.length > 0 ? record.phones.join(", ") : null,
              },
            ]}
          />
          <TrashRecordActions
            kind="client"
            recordId={record.id}
            archivedAt={record.archivedAt}
            onCompleted={() => {
              router.push("/admin/trash?tab=clients");
            }}
          />
        </>
      ) : null}
    </TrashDetailFrame>
  );
}

type TrashDetailFrameProps = {
  isUserLoading: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  title: string;
  children: ReactNode;
};

function TrashDetailFrame({
  isUserLoading,
  isAdmin,
  isLoading,
  error,
  statusCode,
  title,
  children,
}: TrashDetailFrameProps) {
  if (!isUserLoading && !isAdmin) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {TRASH_COPY.forbidden}
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href="/admin/trash"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {TRASH_COPY.backToTrash}
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">იტვირთება…</p>
      ) : null}
      {statusCode === 403 ? (
        <p className="text-sm text-destructive" role="alert">
          {TRASH_COPY.forbidden}
        </p>
      ) : error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {children}
    </div>
  );
}

type TrashDetailFieldsProps = {
  deletedAt: string;
  archivedAt: string | null;
  status: string;
  agentName?: string | null;
  extraRows: { label: string; value: string | null }[];
};

function TrashDetailFields({
  deletedAt,
  archivedAt,
  status,
  agentName,
  extraRows,
}: TrashDetailFieldsProps) {
  return (
    <section className="space-y-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-destructive/20">
      <p className="text-sm font-medium text-destructive">
        {TRASH_COPY.deletedAtLabel}: {formatLifecycleDateTime(deletedAt) ?? "—"}
      </p>
      {isRecordArchived({ archivedAt }) ? (
        <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {TRASH_COPY.deletedFromArchive}
        </span>
      ) : null}
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">{TRASH_COPY.statusLabel}</dt>
          <dd className="text-foreground">{status || "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{TRASH_COPY.agentLabel}</dt>
          <dd className="text-foreground">{agentName || "—"}</dd>
        </div>
        {extraRows.map((row) => (
          <div key={row.label}>
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="text-foreground">{row.value || "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
