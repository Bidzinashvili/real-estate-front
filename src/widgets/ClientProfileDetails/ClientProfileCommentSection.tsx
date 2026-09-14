"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { updateClientProfile } from "@/features/clientProfiles/api";
import type { ClientProfile } from "@/features/clientProfiles/types";

type ClientProfileCommentSectionProps = {
  profile: ClientProfile;
  onUpdated: () => void;
};

export function ClientProfileCommentSection({
  profile,
  onUpdated,
}: ClientProfileCommentSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState(profile.comment ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEditing() {
    setComment(profile.comment ?? "");
    setError(null);
    setIsEditing(true);
  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    try {
      await updateClientProfile(profile.id, {
        comment: comment.trim() === "" ? null : comment.trim(),
      });
      onUpdated();
      setIsEditing(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "კომენტარის შენახვა ვერ მოხერხდა.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">
          კომენტარი კლიენტზე
        </h2>
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
      <p className="mb-3 text-xs text-muted-foreground">
        ეს კომენტარი ეკუთვნის პიროვნების პროფილს და არა ცალკეულ მოთხოვნას.
      </p>

      {isEditing ? (
        <textarea
          rows={4}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
      ) : profile.comment?.trim() ? (
        <p className="whitespace-pre-wrap text-sm text-foreground">
          {profile.comment}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">კომენტარი არ არის.</p>
      )}

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
