"use client";

import { useEffect, useRef } from "react";
import { OwnerContactsEditor } from "@/widgets/PropertyOwners/OwnerContactsEditor";
import { useLookupPropertyOwner } from "@/features/propertyOwners/useLookupPropertyOwner";
import { lookupPhoneQueryValue } from "@/features/propertyOwners/phoneLike";
import type { PropertyOwnerAssignment } from "@/features/propertyOwners/types";

type PropertyOwnerPickerSectionProps = {
  assignment: PropertyOwnerAssignment;
  onChange: (next: PropertyOwnerAssignment) => void;
  error?: string;
  disabled?: boolean;
};

export function PropertyOwnerPickerSection({
  assignment,
  onChange,
  error,
  disabled = false,
}: PropertyOwnerPickerSectionProps) {
  const assignmentRef = useRef(assignment);
  assignmentRef.current = assignment;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const { result, isLookingUp, error: lookupError } = useLookupPropertyOwner(
    assignment.lookupPhone,
  );
  const canLookup = lookupPhoneQueryValue(assignment.lookupPhone) !== null;

  useEffect(() => {
    if (!canLookup || result === null) {
      return;
    }

    const current = assignmentRef.current;

    if (result.owner) {
      const matchedLabel = result.matchedContact?.label ?? "";
      const matchedPhone =
        result.matchedContact?.phone ?? current.lookupPhone;
      if (
        current.selectedOwnerId === result.owner.id &&
        current.matchedOwnerName === result.owner.name &&
        current.matchedContactLabel === matchedLabel &&
        current.matchedContactPhone === matchedPhone
      ) {
        return;
      }
      onChangeRef.current({
        ...current,
        selectedOwnerId: result.owner.id,
        matchedOwnerName: result.owner.name,
        matchedContactLabel: matchedLabel,
        matchedContactPhone: matchedPhone,
        name: result.owner.name,
      });
      return;
    }

    if (!current.selectedOwnerId && !current.matchedOwnerName) {
      return;
    }

    const nextContacts = current.contacts.map((contact, contactIndex) =>
      contactIndex === 0 ? { ...contact, phone: current.lookupPhone } : contact,
    );
    onChangeRef.current({
      ...current,
      selectedOwnerId: null,
      matchedOwnerName: "",
      matchedContactLabel: "",
      matchedContactPhone: "",
      contacts: nextContacts,
    });
  }, [canLookup, result]);

  const isReusingOwner = assignment.selectedOwnerId !== null;

  return (
    <section className="space-y-3 sm:col-span-2">
      <div>
        <h2 className="text-sm font-semibold text-foreground">მეპატრონე</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          შეიყვანეთ ტელეფონი არსებული პროფილის მოსაძებნად. თუ არ მოიძებნა, შექმენით ახალი.
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ownerLookupPhone" className="block text-sm font-medium text-foreground">
          ტელეფონით ძებნა <span className="text-red-500">*</span>
        </label>
        <input
          id="ownerLookupPhone"
          type="tel"
          value={assignment.lookupPhone}
          disabled={disabled}
          placeholder="555555555 ან +995 555 55 55 55"
          onChange={(event) => {
            const lookupPhone = event.target.value;
            const nextContacts = assignment.selectedOwnerId
              ? assignment.contacts
              : assignment.contacts.map((contact, contactIndex) =>
                  contactIndex === 0 ? { ...contact, phone: lookupPhone } : contact,
                );
            onChange({ ...assignment, lookupPhone, contacts: nextContacts });
          }}
          className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:border-primary disabled:opacity-60"
        />
        {isLookingUp ? (
          <p className="text-xs text-muted-foreground">მეპატრონე იძებნება…</p>
        ) : null}
        {lookupError ? (
          <p className="text-xs text-destructive" role="alert">
            {lookupError}
          </p>
        ) : null}
      </div>

      {isReusingOwner ? (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-foreground">
            {assignment.matchedContactPhone
              ? `ნაპოვნია მეპატრონე: ${assignment.matchedOwnerName}`
              : `მეპატრონე: ${assignment.matchedOwnerName}`}
          </p>
          {assignment.matchedContactLabel || assignment.matchedContactPhone ? (
            <p className="mt-1 text-sm text-muted-foreground">
              დამთხვევა:{" "}
              {[assignment.matchedContactLabel, assignment.matchedContactPhone]
                .filter((part) => part.trim() !== "")
                .join(" — ")}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">
            {assignment.matchedContactPhone
              ? "განცხადება დაუკავშირდება ამ პროფილს. ახალი მეპატრონე არ შეიქმნება."
              : "შეიყვანეთ სხვა ნომერი მეპატრონის შესაცვლელად."}
          </p>
        </div>
      ) : (
        <div className="space-y-3 rounded-xl border border-border bg-card p-4">
          {canLookup && result && result.owner === null && !isLookingUp ? (
            <p className="text-xs text-muted-foreground">
              ამ ნომრით მეპატრონე ვერ მოიძებნა. შეავსეთ ახალი პროფილი.
            </p>
          ) : null}

          <div className="space-y-1.5">
            <label htmlFor="ownerName" className="block text-sm font-medium text-foreground">
              მესაკუთრის სახელი <span className="text-red-500">*</span>
            </label>
            <input
              id="ownerName"
              type="text"
              value={assignment.name}
              disabled={disabled}
              onChange={(event) =>
                onChange({ ...assignment, name: event.target.value })
              }
              className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:border-primary disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="ownerComment" className="block text-sm font-medium text-foreground">
              კომენტარი მეპატრონეზე
            </label>
            <textarea
              id="ownerComment"
              rows={3}
              value={assignment.comment}
              disabled={disabled}
              onChange={(event) =>
                onChange({ ...assignment, comment: event.target.value })
              }
              className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:border-primary disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">საკონტაქტო ნომრები</p>
            <OwnerContactsEditor
              contacts={assignment.contacts}
              disabled={disabled}
              onChange={(contacts) => onChange({ ...assignment, contacts })}
            />
          </div>
        </div>
      )}

      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
