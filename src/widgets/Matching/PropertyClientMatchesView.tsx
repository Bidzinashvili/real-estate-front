"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { usePropertyClientMatches } from "@/features/matching/usePropertyClientMatches";
import {
  PROPERTY_SOURCE_TEMPORARY_LOCK_KEYS,
  type MatchScope,
  type TemporaryLockKey,
} from "@/features/matching/matchingEnums";
import { propertyMatchesHref } from "@/features/matching/matchingRoutes";
import { sortScoredMatchesByPercentageDesc } from "@/features/matching/sortScoredMatches";
import { ui } from "@/shared/i18n/ui";
import { MatchingScopeToggle } from "@/widgets/Matching/MatchingScopeToggle";
import { TemporaryLocksPanel } from "@/widgets/Matching/TemporaryLocksPanel";
import { ClientMatchCard } from "@/widgets/Matching/ClientMatchCard";

type PropertyClientMatchesViewProps = {
  propertyId: string;
  scope: MatchScope;
};

export function PropertyClientMatchesView({
  propertyId,
  scope,
}: PropertyClientMatchesViewProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [appliedScope, setAppliedScope] = useState(scope);
  const [temporaryLockedFields, setTemporaryLockedFields] = useState<TemporaryLockKey[]>([]);

  const requestPage = appliedScope !== scope ? 1 : page;
  if (appliedScope !== scope) {
    setAppliedScope(scope);
    setPage(1);
  }

  const { data, isLoading, error } = usePropertyClientMatches({
    propertyId,
    scope,
    temporaryLockedFields,
    page: requestPage,
  });

  const totalPages = useMemo(() => {
    if (!data || data.limit <= 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(data.total / data.limit));
  }, [data]);

  const sortedClients = useMemo(
    () => (data ? sortScoredMatchesByPercentageDesc(data.clients) : []),
    [data],
  );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/properties/${propertyId}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          განცხადებაზე დაბრუნება
        </Link>
        <MatchingScopeToggle
          value={scope}
          globalLabel={ui.allClients}
          mineLabel={ui.myClients}
          onChange={(nextScope) => {
            router.replace(propertyMatchesHref(propertyId, nextScope));
          }}
        />
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">შესაბამისი კლიენტები</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ჩემი კლიენტები ნიშნავს თქვენს კლიენტებს და არა განცხადების მფლობელისას. ბარათებში მხოლოდ საჯარო ველები ჩანს.
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

      {isLoading ? <p className="text-sm text-muted-foreground">შესაბამისობები იტვირთება…</p> : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {!isLoading && !error && data && data.total === 0 ? (
        <p className="text-sm text-muted-foreground">შესაბამისი კლიენტები ვერ მოიძებნა.</p>
      ) : null}
      {!isLoading && !error && data && sortedClients.length > 0 ? (
        <>
          <p className="text-xs text-muted-foreground">
            ნაჩვენებია {sortedClients.length} / {data.total}
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {sortedClients.map((match) => (
              <ClientMatchCard key={match.id} match={match} propertyId={propertyId} />
            ))}
          </div>
          <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              გვერდი {data.page} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => setPage(data.page - 1)}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                წინა
              </button>
              <button
                type="button"
                disabled={data.page >= totalPages}
                onClick={() => setPage(data.page + 1)}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                შემდეგი
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
