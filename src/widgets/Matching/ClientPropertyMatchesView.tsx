"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useHideClientProperty } from "@/features/clientHiddenProperties/useHideClientProperty";
import { useClientPropertyMatches } from "@/features/matching/useClientPropertyMatches";
import { type MatchScope } from "@/features/matching/matchingEnums";
import { peekTemporaryLockSession } from "@/features/matching/temporaryLockSession";
import { clientMatchesHref } from "@/features/matching/matchingRoutes";
import { sortScoredMatchesByPercentageDesc } from "@/features/matching/sortScoredMatches";
import { ui } from "@/shared/i18n/ui";
import { MatchingScopeToggle } from "@/widgets/Matching/MatchingScopeToggle";
import { AppliedTemporaryLocksNotice } from "@/widgets/Matching/AppliedTemporaryLocksNotice";
import { PropertyMatchCard } from "@/widgets/Matching/PropertyMatchCard";
import { useClientDetails } from "@/features/clients/useClientDetails";
import { useCurrentUser } from "@/shared/hooks";
import { viewerCanManageRecord } from "@/features/databaseList/viewerOwnership";
import {
  canSharePropertyToClient,
  collectClientSharePhones,
} from "@/features/propertyShare/clientPropertyShare";

type ClientPropertyMatchesViewProps = {
  clientId: string;
  scope: MatchScope;
};

export function ClientPropertyMatchesView({
  clientId,
  scope,
}: ClientPropertyMatchesViewProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { client } = useClientDetails(clientId);
  const canShareToClient = client ? canSharePropertyToClient(user, client) : false;
  const canHideProperty = client ? viewerCanManageRecord(client, user) : false;
  const sharePhones = client ? collectClientSharePhones(client) : [];
  const { hideProperty, isPropertyPending } = useHideClientProperty(clientId);
  const [locallyHiddenIds, setLocallyHiddenIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [appliedScope, setAppliedScope] = useState(scope);
  const [temporaryLockedFields] = useState(() =>
    peekTemporaryLockSession("client", clientId),
  );

  const requestPage = appliedScope !== scope ? 1 : page;
  if (appliedScope !== scope) {
    setAppliedScope(scope);
    setPage(1);
  }

  useEffect(() => {
    setLocallyHiddenIds([]);
  }, [clientId]);

  const { data, isLoading, error } = useClientPropertyMatches({
    clientId,
    scope,
    temporaryLockedFields,
    page: requestPage,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    const presentIds = new Set(data.properties.map((match) => match.property.id));
    setLocallyHiddenIds((currentIds) =>
      currentIds.filter((propertyId) => presentIds.has(propertyId)),
    );
  }, [data]);

  const totalPages = useMemo(() => {
    if (!data || data.limit <= 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(data.total / data.limit));
  }, [data]);

  const sortedProperties = useMemo(
    () => (data ? sortScoredMatchesByPercentageDesc(data.properties) : []),
    [data],
  );
  const visibleProperties = useMemo(
    () =>
      sortedProperties.filter((match) => !locallyHiddenIds.includes(match.property.id)),
    [sortedProperties, locallyHiddenIds],
  );

  async function handleHideProperty(propertyId: string) {
    setLocallyHiddenIds((currentIds) =>
      currentIds.includes(propertyId) ? currentIds : [...currentIds, propertyId],
    );
    const didHide = await hideProperty(propertyId);
    if (didHide) {
      return;
    }
    setLocallyHiddenIds((currentIds) =>
      currentIds.filter((hiddenId) => hiddenId !== propertyId),
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/clients/${clientId}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          კლიენტზე დაბრუნება
        </Link>
        <MatchingScopeToggle
          value={scope}
          globalLabel={ui.allListings}
          mineLabel={ui.myListings}
          onChange={(nextScope) => {
            router.replace(clientMatchesHref(clientId, nextScope));
          }}
        />
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">შესაბამისი განცხადებები</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          შედეგები იყენებს სერვერის შესაბამისობის პროცენტს და ნაჩვენებია კლებადობით.
        </p>
      </div>

      <AppliedTemporaryLocksNotice selectedKeys={temporaryLockedFields} />

      {isLoading ? <p className="text-sm text-muted-foreground">შესაბამისობები იტვირთება…</p> : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {!isLoading && !error && data && visibleProperties.length === 0 ? (
        <p className="text-sm text-muted-foreground">შესაბამისი განცხადებები ვერ მოიძებნა.</p>
      ) : null}
      {!isLoading && !error && data && visibleProperties.length > 0 ? (
        <>
          <p className="text-xs text-muted-foreground">
            ნაჩვენებია {visibleProperties.length} / {Math.max(0, data.total - locallyHiddenIds.length)}
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {visibleProperties.map((match) => (
              <PropertyMatchCard
                key={match.id}
                match={match}
                clientId={clientId}
                canShareToClient={canShareToClient}
                sharePhones={sharePhones}
                canHideProperty={canHideProperty}
                isHidePending={isPropertyPending(match.property.id)}
                onHideProperty={(propertyId) => {
                  void handleHideProperty(propertyId);
                }}
                canRequestCollaboration={client !== null && !client.hideFromOthers}
              />
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
