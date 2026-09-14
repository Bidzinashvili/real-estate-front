"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createPropertyOwner, lookupPropertyOwnerByPhone } from "@/features/propertyOwners/api";
import {
  buildOwnerWritePayload,
  emptyOwnerAssignment,
} from "@/features/propertyOwners/ownerContactDrafts";
import {
  PROPERTY_OWNERS_LIST_HREF,
  propertyOwnerHref,
} from "@/features/propertyOwners/propertyOwnerRoutes";
import type { PropertyOwnerAssignment } from "@/features/propertyOwners/types";
import { PropertyOwnerPickerSection } from "@/widgets/PropertyOwners/PropertyOwnerPickerSection";
import { ApiError } from "@/shared/lib/apiError";

export function CreatePropertyOwnerView() {
  const router = useRouter();
  const [assignment, setAssignment] = useState<PropertyOwnerAssignment>(
    emptyOwnerAssignment,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [existingOwnerId, setExistingOwnerId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setExistingOwnerId(null);

    if (assignment.selectedOwnerId) {
      router.push(propertyOwnerHref(assignment.selectedOwnerId));
      return;
    }

    const { payload, error } = buildOwnerWritePayload(assignment);
    if (!payload || !("owner" in payload) || error) {
      setFormError(error ?? "შეავსეთ მეპატრონის სახელი და ნომერი.");
      return;
    }

    setIsSaving(true);
    try {
      const created = await createPropertyOwner(payload.owner);
      router.push(propertyOwnerHref(created.id));
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "მეპატრონის შექმნა ვერ მოხერხდა.";
      setFormError(message);

      if (saveError instanceof ApiError && saveError.statusCode === 409) {
        const lookupPhone = assignment.lookupPhone.trim() || assignment.contacts[0]?.phone.trim();
        if (lookupPhone) {
          try {
            const lookup = await lookupPropertyOwnerByPhone(lookupPhone);
            if (lookup.owner) {
              setExistingOwnerId(lookup.owner.id);
            }
          } catch {
            setExistingOwnerId(null);
          }
        }
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => router.push(PROPERTY_OWNERS_LIST_HREF)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        ყველა მეპატრონე
      </button>

      <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
        <h1 className="text-2xl font-semibold tracking-tight">მეპატრონის დამატება</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ჯერ შეამოწმეთ ნომერი. თუ პროფილი უკვე არსებობს, გახსენით ის; თუ არა — შექმენით ახალი.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <PropertyOwnerPickerSection
            assignment={assignment}
            onChange={setAssignment}
            error={formError ?? undefined}
            disabled={isSaving}
          />

          {existingOwnerId ? (
            <div className="rounded-xl border border-warning/40 bg-warning-muted/40 p-3 text-sm">
              <p className="text-foreground">ამ ნომრით მეპატრონის პროფილი უკვე არსებობს</p>
              <button
                type="button"
                onClick={() => router.push(propertyOwnerHref(existingOwnerId))}
                className="mt-2 text-sm font-medium text-primary underline-offset-2 hover:underline"
              >
                არსებული პროფილის გახსნა
              </button>
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => router.push(PROPERTY_OWNERS_LIST_HREF)}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
            >
              გაუქმება
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
            >
              {isSaving ? "ინახება…" : assignment.selectedOwnerId ? "პროფილის გახსნა" : "შენახვა"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
