"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { updatePropertyOwner } from "@/features/propertyOwners/api";
import type { PropertyOwner } from "@/features/propertyOwners/types";
import { primaryContactFromList } from "@/features/propertyOwners/ownerContactDrafts";

type PropertyOwnerIdentityCardProps = {
  owner: PropertyOwner;
  onUpdated: (owner: PropertyOwner) => void;
};

export function PropertyOwnerIdentityCard({
  owner,
  onUpdated,
}: PropertyOwnerIdentityCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(owner.name);
  const [comment, setComment] = useState(owner.comment ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const primary = primaryContactFromList(owner.contacts);

  function startEditing() {
    setName(owner.name);
    setComment(owner.comment ?? "");
    setError(null);
    setIsEditing(true);
  }

  async function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("მესაკუთრის სახელი სავალდებულოა.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const updated = await updatePropertyOwner(owner.id, {
        name: trimmedName,
        comment: comment.trim() === "" ? null : comment.trim(),
      });
      onUpdated(updated);
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
            მეპატრონე
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
              {owner.name}
            </h1>
          )}
          {primary ? (
            <p className="text-sm text-muted-foreground">
              {primary.label} — {primary.phone}
            </p>
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

      <div className="mt-4 border-t border-border pt-4">
        <p className="text-xs font-medium text-muted-foreground">
          კომენტარი მეპატრონეზე
        </p>
        {isEditing ? (
          <textarea
            rows={4}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className="mt-2 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
        ) : owner.comment?.trim() ? (
          <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
            {owner.comment}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">კომენტარი არ არის.</p>
        )}
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
