"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePropertyClientMatches } from "@/features/matching/usePropertyClientMatches";
import {
  PROPERTY_SOURCE_TEMPORARY_LOCK_KEYS,
  type MatchScope,
  type TemporaryLockKey,
} from "@/features/matching/matchingEnums";
import { MatchingScopeToggle } from "@/widgets/Matching/MatchingScopeToggle";
import { TemporaryLocksPanel } from "@/widgets/Matching/TemporaryLocksPanel";
import { ClientMatchCard } from "@/widgets/Matching/ClientMatchCard";

type PropertyClientMatchesViewProps = {
  propertyId: string;
};

export function PropertyClientMatchesView({ propertyId }: PropertyClientMatchesViewProps) {
  const [scope, setScope] = useState<MatchScope>("GLOBAL");
  const [page, setPage] = useState(1);
  const [temporaryLockedFields, setTemporaryLockedFields] = useState<TemporaryLockKey[]>([]);
  const { data, isLoading, error } = usePropertyClientMatches({
    propertyId,
    scope,
    temporaryLockedFields,
    page,
  });

  const totalPages = useMemo(() => {
    if (!data || data.limit <= 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(data.total / data.limit));
  }, [data]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/properties/${propertyId}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to listing
        </Link>
        <MatchingScopeToggle
          value={scope}
          globalLabel="All clients"
          mineLabel="My clients"
          onChange={(nextScope) => {
            setScope(nextScope);
            setPage(1);
          }}
        />
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Matching clients</h1>
        <p className="mt-1 text-sm text-slate-600">
          MINE uses your own clients, not the listing owner. Cards show public match fields only.
        </p>
      </div>

      <TemporaryLocksPanel
        availableKeys={PROPERTY_SOURCE_TEMPORARY_LOCK_KEYS}
        selectedKeys={temporaryLockedFields}
        onChange={(nextKeys) => {
          setTemporaryLockedFields(nextKeys);
          setPage(1);
        }}
      />

      {isLoading ? <p className="text-sm text-slate-600">Loading matches…</p> : null}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {!isLoading && !error && data && data.total === 0 ? (
        <p className="text-sm text-slate-600">No matching clients.</p>
      ) : null}
      {!isLoading && !error && data && data.clients.length > 0 ? (
        <>
          <p className="text-xs text-slate-500">
            Showing {data.clients.length} of {data.total}
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.clients.map((match) => (
              <ClientMatchCard key={match.id} match={match} />
            ))}
          </div>
          <div className="flex flex-col gap-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Page {data.page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => setPage(data.page - 1)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={data.page >= totalPages}
                onClick={() => setPage(data.page + 1)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
