"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { updateClientProfile } from "@/features/clientProfiles/api";
import { formatClientProfileDealTypes } from "@/features/clientProfiles/display";
import type { ClientProfile } from "@/features/clientProfiles/types";
import { formatLifecycleDate } from "@/features/lifecycle/formatLifecycleDate";
import { ClientProfileOccurrenceLines } from "@/widgets/ClientProfiles/ClientProfileOccurrenceLines";

type ClientProfileIdentityCardProps = {
  profile: ClientProfile;
  onUpdated: () => void;
};

export function ClientProfileIdentityCard({
  profile,
  onUpdated,
}: ClientProfileIdentityCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstSeen = formatLifecycleDate(profile.firstSeenAt);
  const lastSeen = formatLifecycleDate(profile.lastSeenAt);
  const dealTypesLabel = formatClientProfileDealTypes(profile.dealTypes);

  function startEditing() {
    setName(profile.name ?? "");
    setError(null);
    setIsEditing(true);
  }

  async function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("სახელი სავალდებულოა.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await updateClientProfile(profile.id, { name: trimmedName });
      onUpdated();
      setIsEditing(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "ცვლილებების შენახვა ვერ მოხერხდა.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            კლიენტის პროფილი
          </p>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="block w-full max-w-md rounded-lg border border-border bg-background px-3 py-2 text-lg font-semibold text-foreground outline-none focus:border-primary"
            />
          ) : (
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {profile.name?.trim() || "უსახელო პროფილი"}
            </h1>
          )}
          {profile.blacklisted ? (
            <span className="inline-flex rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold text-destructive">
              შავ სიაშია
            </span>
          ) : null}
        </div>
        {isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            გაუქმება
          </button>
        ) : (
          <button
            type="button"
            onClick={startEditing}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            რედაქტირება
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted-foreground">გამოჩენა</p>
          <div className="mt-1">
            <ClientProfileOccurrenceLines
              occurrenceCount={profile.occurrenceCount}
              ownOccurrenceCount={profile.ownOccurrenceCount}
            />
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">გარიგებები</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {dealTypesLabel || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">პირველად გამოჩნდა</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {firstSeen ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">ბოლოს გამოჩნდა</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {lastSeen ?? "—"}
          </p>
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {isEditing ? (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => void handleSave()}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
          >
            {isSaving ? "ინახება…" : "შენახვა"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
