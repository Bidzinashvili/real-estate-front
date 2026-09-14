"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useClientProfileDetails } from "@/features/clientProfiles/useClientProfileDetails";
import { CLIENT_PROFILES_LIST_HREF } from "@/features/clientProfiles/clientProfileRoutes";
import { formatClientProfileDealTypes } from "@/features/clientProfiles/display";
import { formatLifecycleDate } from "@/features/lifecycle/formatLifecycleDate";
import { useCurrentUser } from "@/shared/hooks";
import { ClientProfileIdentityCard } from "@/widgets/ClientProfileDetails/ClientProfileIdentityCard";
import { ClientProfilePhonesSection } from "@/widgets/ClientProfileDetails/ClientProfilePhonesSection";
import { ClientProfileCommentSection } from "@/widgets/ClientProfileDetails/ClientProfileCommentSection";
import { ClientProfileHistorySection } from "@/widgets/ClientProfileDetails/ClientProfileHistorySection";
import { ClientProfileBlacklistSection } from "@/widgets/ClientProfileDetails/ClientProfileBlacklistSection";
import { ClientProfileAuditSection } from "@/widgets/ClientProfileDetails/ClientProfileAuditSection";
import { ClientProfileMergeSection } from "@/widgets/ClientProfileDetails/ClientProfileMergeSection";
import { ClientProfileOccurrenceLines } from "@/widgets/ClientProfiles/ClientProfileOccurrenceLines";

type ClientProfileDetailsViewProps = {
  profileId: string;
};

export function ClientProfileDetailsView({
  profileId,
}: ClientProfileDetailsViewProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const isAdmin = user?.role === "ADMIN";
  const { profile, isLoading, error, statusCode, refetch } =
    useClientProfileDetails(profileId);

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">პროფილი იტვირთება…</p>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => router.push(CLIENT_PROFILES_LIST_HREF)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          ყველა პროფილი
        </button>
        <p className="text-sm text-destructive" role="alert">
          {statusCode === 403
            ? "ამ კლიენტის პროფილზე წვდომა არ გაქვთ."
            : statusCode === 404
              ? "კლიენტის პროფილი ვერ მოიძებნა."
              : (error ?? "კლიენტის პროფილი ვერ მოიძებნა.")}
        </p>
      </div>
    );
  }

  const firstSeen = formatLifecycleDate(profile.firstSeenAt);
  const lastSeen = formatLifecycleDate(profile.lastSeenAt);
  const dealTypesLabel = formatClientProfileDealTypes(profile.dealTypes);

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => router.push(CLIENT_PROFILES_LIST_HREF)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        ყველა პროფილი
      </button>

      {profile.canViewDetails ? (
        <>
          <ClientProfileIdentityCard
            profile={profile}
            onUpdated={() => void refetch()}
          />
          <ClientProfilePhonesSection
            profile={profile}
            onUpdated={() => void refetch()}
          />
          <ClientProfileCommentSection
            profile={profile}
            onUpdated={() => void refetch()}
          />
          <ClientProfileHistorySection notes={profile.clients} />
          <ClientProfileBlacklistSection
            profile={profile}
            onUpdated={() => void refetch()}
          />
          <ClientProfileAuditSection audits={profile.audits} />
          {isAdmin ? (
            <ClientProfileMergeSection
              profile={profile}
              onUpdated={() => void refetch()}
            />
          ) : null}
        </>
      ) : (
        <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            კლიენტის პროფილი
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            შეზღუდული ინფორმაცია
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            ამ პროფილის პირადი დეტალები დამალულია. ნაჩვენებია მხოლოდ სააგენტოს
            საერთო სიგნალი.
          </p>
          <div className="mt-4 space-y-3">
            <ClientProfileOccurrenceLines
              occurrenceCount={profile.occurrenceCount}
              ownOccurrenceCount={profile.ownOccurrenceCount}
            />
            {dealTypesLabel ? (
              <p className="text-sm text-foreground">გარიგებები: {dealTypesLabel}</p>
            ) : null}
            {firstSeen ? (
              <p className="text-sm text-muted-foreground">
                პირველად: {firstSeen}
              </p>
            ) : null}
            {lastSeen ? (
              <p className="text-sm text-muted-foreground">ბოლოს: {lastSeen}</p>
            ) : null}
            {profile.blacklisted ? (
              <p className="text-sm font-medium text-destructive">შავ სიაშია</p>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}
