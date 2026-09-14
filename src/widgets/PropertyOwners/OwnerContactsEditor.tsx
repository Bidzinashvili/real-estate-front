"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  createOwnerContactDraft,
  ensureOnePrimaryContact,
  withSinglePrimaryContact,
} from "@/features/propertyOwners/ownerContactDrafts";
import type { OwnerContactDraft } from "@/features/propertyOwners/types";

type OwnerContactsEditorProps = {
  contacts: OwnerContactDraft[];
  onChange: (contacts: OwnerContactDraft[]) => void;
  disabled?: boolean;
};

export function OwnerContactsEditor({
  contacts,
  onChange,
  disabled = false,
}: OwnerContactsEditorProps) {
  function handleFieldChange(
    localId: string,
    field: "label" | "phone",
    value: string,
  ) {
    onChange(
      contacts.map((contact) =>
        contact.localId === localId ? { ...contact, [field]: value } : contact,
      ),
    );
  }

  function handleAddContact() {
    onChange([...contacts, createOwnerContactDraft("", "", false)]);
  }

  function handleRemoveContact(localId: string) {
    if (contacts.length <= 1) {
      return;
    }
    onChange(
      ensureOnePrimaryContact(
        contacts.filter((contact) => contact.localId !== localId),
      ),
    );
  }

  function handlePrimaryChange(localId: string) {
    onChange(withSinglePrimaryContact(contacts, localId));
  }

  return (
    <div className="space-y-2">
      {contacts.map((contact, contactIndex) => (
        <div
          key={contact.localId}
          className="rounded-lg border border-border bg-muted/40 p-3"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 space-y-1">
              <label
                htmlFor={`owner-contact-label-${contact.localId}`}
                className="block text-xs font-medium text-foreground"
              >
                ეტიკეტი
              </label>
              <input
                id={`owner-contact-label-${contact.localId}`}
                type="text"
                value={contact.label}
                disabled={disabled}
                placeholder={contactIndex === 0 ? "მთავარი ნომერი" : "მაგ. ქმარი გიორგი"}
                onChange={(event) =>
                  handleFieldChange(contact.localId, "label", event.target.value)
                }
                className="block w-full rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary disabled:opacity-60"
              />
            </div>
            <div className="min-w-0 flex-[1.2] space-y-1">
              <label
                htmlFor={`owner-contact-phone-${contact.localId}`}
                className="block text-xs font-medium text-foreground"
              >
                ტელეფონი
              </label>
              <input
                id={`owner-contact-phone-${contact.localId}`}
                type="tel"
                value={contact.phone}
                disabled={disabled}
                placeholder="555555555 ან +77777777777"
                onChange={(event) =>
                  handleFieldChange(contact.localId, "phone", event.target.value)
                }
                className="block w-full rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary disabled:opacity-60"
              />
            </div>
            <div className="flex items-center gap-2 pb-0.5">
              <label className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
                <input
                  type="radio"
                  name="owner-contact-primary"
                  checked={contact.isPrimary}
                  disabled={disabled}
                  onChange={() => handlePrimaryChange(contact.localId)}
                />
                მთავარი
              </label>
              {contacts.length > 1 ? (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => handleRemoveContact(contact.localId)}
                  className="text-muted-foreground transition hover:text-destructive disabled:opacity-60"
                  aria-label="ნომრის წაშლა"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        disabled={disabled}
        onClick={handleAddContact}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-60"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        ნომრის დამატება
      </button>
    </div>
  );
}
