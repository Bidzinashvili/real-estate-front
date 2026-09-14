"use client";

import { useState } from "react";
import {
  blacklistClientProfile,
  unblacklistClientProfile,
} from "@/features/clientProfiles/api";
import type { ClientProfile } from "@/features/clientProfiles/types";
import { formatLifecycleDateTime } from "@/features/lifecycle/formatLifecycleDate";
import { ConfirmDialog } from "@/widgets/ConfirmDialog/ConfirmDialog";

type ClientProfileBlacklistSectionProps = {
  profile: ClientProfile;
  onUpdated: () => void;
};

export function ClientProfileBlacklistSection({
  profile,
  onUpdated,
}: ClientProfileBlacklistSectionProps) {
  const [reason, setReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);

  async function handleBlacklist() {
    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setError("მიზეზი სავალდებულოა.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await blacklistClientProfile(profile.id, { reason: trimmedReason });
      setReason("");
      onUpdated();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "შავ სიაში დამატება ვერ მოხერხდა.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUnblacklist() {
    setIsSaving(true);
    setError(null);
    try {
      await unblacklistClientProfile(profile.id);
      setConfirmRemove(false);
      onUpdated();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "შავი სიიდან ამოღება ვერ მოხერხდა.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const blacklistedAt = formatLifecycleDateTime(profile.blacklistedAt);

  return (
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h2 className="text-base font-semibold text-foreground">შავი სია</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        შავი სია ხელით ემატება. მაღალი გამოჩენის რაოდენობა თავისთავად შავ სიას არ
        ნიშნავს.
      </p>

      {profile.blacklisted ? (
        <div className="mt-4 space-y-2">
          <span className="inline-flex rounded-full bg-destructive/15 px-2.5 py-0.5 text-xs font-semibold text-destructive">
            შავ სიაშია
          </span>
          {profile.blacklistReason?.trim() ? (
            <p className="text-sm text-foreground">
              მიზეზი: {profile.blacklistReason.trim()}
            </p>
          ) : null}
          {blacklistedAt ? (
            <p className="text-xs text-muted-foreground">
              დამატებულია: {blacklistedAt}
            </p>
          ) : null}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => setConfirmRemove(true)}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted disabled:opacity-60"
          >
            შავი სიიდან ამოღება
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          <label htmlFor="blacklistReason" className="block text-sm font-medium">
            მიზეზი
          </label>
          <textarea
            id="blacklistReason"
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="მაგ. განმეორებით ჩნდება კლიენტად, მაგრამ შესაძლოა გარე ბროკერი იყოს."
            className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
          <button
            type="button"
            disabled={isSaving}
            onClick={() => void handleBlacklist()}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
          >
            შავ სიაში დამატება
          </button>
        </div>
      )}

      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <ConfirmDialog
        open={confirmRemove}
        title="შავი სიიდან ამოღება"
        description="გსურთ ამ პროფილის შავი სიიდან ამოღება?"
        confirmLabel="ამოღება"
        cancelLabel="გაუქმება"
        tone="primary"
        isProcessing={isSaving}
        error={error}
        onConfirm={() => void handleUnblacklist()}
        onCancel={() => setConfirmRemove(false)}
      />
    </section>
  );
}
