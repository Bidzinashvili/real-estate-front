"use client";

import { useLookupClientProfiles } from "@/features/clientProfiles/useLookupClientProfiles";
import {
  formatClientProfileDealTypes,
  formatOccurrenceCount,
} from "@/features/clientProfiles/display";
import { IDENTITY_CONFLICT_MESSAGE } from "@/features/clientProfiles/identityConflict";
import { formatLifecycleDate } from "@/features/lifecycle/formatLifecycleDate";
import type { ClientProfileLookupResult } from "@/features/clientProfiles/types";

type ClientProfileLookupSignalsProps = {
  phones: string[];
};

function matchedProfileIds(results: ClientProfileLookupResult[]): string[] {
  const ids = new Set<string>();
  for (const result of results) {
    if (result.matched && result.profileId) {
      ids.add(result.profileId);
    }
  }
  return Array.from(ids);
}

function LookupCard({
  phones,
  result,
}: {
  phones: string[];
  result: ClientProfileLookupResult;
}) {
  if (!result.matched) {
    return null;
  }

  const canViewDetails = result.profile?.canViewDetails === true;
  const profileName = canViewDetails ? result.profile?.name?.trim() : "";
  const lastSeen = formatLifecycleDate(result.lastSeenAt);
  const dealTypesLabel = formatClientProfileDealTypes(result.dealTypes);
  const blacklistReason =
    canViewDetails && result.profile?.blacklistReason?.trim()
      ? result.profile.blacklistReason.trim()
      : null;
  const phoneLabel = phones.join(", ");

  return (
    <div
      className={`rounded-xl border p-3 ${
        result.blacklisted
          ? "border-destructive/40 bg-destructive/5"
          : "border-primary/30 bg-primary/5"
      }`}
    >
      {canViewDetails ? (
        <p className="text-sm font-semibold text-foreground">
          ეს კლიენტი უკვე არსებობს სისტემაში
        </p>
      ) : (
        <p className="text-sm font-semibold text-foreground">
          ეს ნომერი სისტემაში უკვე {formatOccurrenceCount(result.occurrenceCount)}{" "}
          გამოჩნდა
        </p>
      )}

      <p className="mt-1 text-xs text-muted-foreground">ნომერი: {phoneLabel}</p>

      {profileName ? (
        <p className="mt-2 text-sm text-foreground">{profileName}</p>
      ) : null}

      <div className="mt-2 space-y-0.5 text-sm text-foreground">
        {canViewDetails ? (
          <p>სისტემაში გამოჩნდა: {formatOccurrenceCount(result.occurrenceCount)}</p>
        ) : null}
        <p>ჩემთან: {formatOccurrenceCount(result.ownOccurrenceCount)}</p>
        {dealTypesLabel ? <p>გარიგებები: {dealTypesLabel}</p> : null}
        {lastSeen ? <p>ბოლოს გამოჩნდა: {lastSeen}</p> : null}
      </div>

      {result.blacklisted ? (
        <p className="mt-2 text-sm font-medium text-destructive">
          ყურადღება: ეს ნომერი შავ სიაშია.
        </p>
      ) : null}

      {blacklistReason ? (
        <p className="mt-1 text-sm text-foreground">მიზეზი: {blacklistReason}</p>
      ) : null}

      {canViewDetails ? (
        <p className="mt-2 text-xs text-muted-foreground">
          შენახვისას ეს მოთხოვნა არსებულ პროფილს დაუკავშირდება. ახალი პროფილი არ
          შეიქმნება.
        </p>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">
          სხვა აგენტის კლიენტის დეტალები დამალულია.
        </p>
      )}
    </div>
  );
}

export function ClientProfileLookupSignals({
  phones,
}: ClientProfileLookupSignalsProps) {
  const { entries, isLookingUp, error } = useLookupClientProfiles(phones);
  const matchedEntries = entries.filter((entry) => entry.result.matched);
  const conflictIds = matchedProfileIds(matchedEntries.map((entry) => entry.result));
  const grouped = new Map<
    string,
    { phones: string[]; result: ClientProfileLookupResult }
  >();
  for (const entry of matchedEntries) {
    const groupKey = entry.result.profileId ?? entry.phone;
    const existing = grouped.get(groupKey);
    if (existing) {
      existing.phones.push(entry.phone);
    } else {
      grouped.set(groupKey, {
        phones: [entry.phone],
        result: entry.result,
      });
    }
  }

  if (!isLookingUp && !error && matchedEntries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {isLookingUp ? (
        <p className="text-xs text-muted-foreground">ნომერი მოწმდება…</p>
      ) : null}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {conflictIds.length > 1 ? (
        <p className="text-sm text-destructive" role="alert">
          {IDENTITY_CONFLICT_MESSAGE}
        </p>
      ) : null}
      {Array.from(grouped.entries()).map(([groupKey, group]) => (
        <LookupCard
          key={groupKey}
          phones={group.phones}
          result={group.result}
        />
      ))}
    </div>
  );
}
