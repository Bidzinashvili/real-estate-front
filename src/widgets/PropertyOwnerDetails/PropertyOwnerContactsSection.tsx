"use client";

import { useState } from "react";
import { Pencil, Phone, Plus, Trash2 } from "lucide-react";
import {
  addPropertyOwnerContact,
  deletePropertyOwnerContact,
  updatePropertyOwnerContact,
} from "@/features/propertyOwners/api";
import { isPhoneLike } from "@/features/propertyOwners/phoneLike";
import type {
  PropertyOwner,
  PropertyOwnerContact,
} from "@/features/propertyOwners/types";
import { ConfirmDialog } from "@/widgets/ConfirmDialog/ConfirmDialog";

type PropertyOwnerContactsSectionProps = {
  owner: PropertyOwner;
  onUpdated: (owner: PropertyOwner) => void;
};

type ContactDraft = {
  label: string;
  phone: string;
  isPrimary: boolean;
};

const emptyDraft: ContactDraft = {
  label: "",
  phone: "",
  isPrimary: false,
};

function formatPhoneHref(raw: string): string {
  return raw.replace(/\s+/g, "");
}

export function PropertyOwnerContactsSection({
  owner,
  onUpdated,
}: PropertyOwnerContactsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [addDraft, setAddDraft] = useState<ContactDraft>(emptyDraft);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ContactDraft>(emptyDraft);
  const [contactToDelete, setContactToDelete] = useState<PropertyOwnerContact | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDeleteContact = owner.contacts.length > 1;

  function validateDraft(draft: ContactDraft): string | null {
    if (!draft.phone.trim()) {
      return "ტელეფონის ნომერი სავალდებულოა.";
    }
    if (!isPhoneLike(draft.phone)) {
      return "ტელეფონის ნომერი არასწორია.";
    }
    return null;
  }

  async function handleAdd() {
    const validationError = validateDraft(addDraft);
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const updated = await addPropertyOwnerContact(owner.id, {
        label: addDraft.label.trim(),
        phone: addDraft.phone.trim(),
        isPrimary: addDraft.isPrimary,
      });
      onUpdated(updated);
      setAddDraft(emptyDraft);
      setIsAdding(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "კონტაქტის დამატება ვერ მოხერხდა.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveEdit(contactId: string) {
    const validationError = validateDraft(editDraft);
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const updated = await updatePropertyOwnerContact(owner.id, contactId, {
        label: editDraft.label.trim(),
        phone: editDraft.phone.trim(),
        isPrimary: editDraft.isPrimary,
      });
      onUpdated(updated);
      setEditingContactId(null);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "კონტაქტის განახლება ვერ მოხერხდა.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMarkPrimary(contact: PropertyOwnerContact) {
    if (contact.isPrimary) {
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const updated = await updatePropertyOwnerContact(owner.id, contact.id, {
        isPrimary: true,
      });
      onUpdated(updated);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "მთავარი ნომრის შეცვლა ვერ მოხერხდა.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!contactToDelete) {
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const updated = await deletePropertyOwnerContact(owner.id, contactToDelete.id);
      onUpdated(updated);
      setContactToDelete(null);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "კონტაქტის წაშლა ვერ მოხერხდა.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function startEdit(contact: PropertyOwnerContact) {
    setEditingContactId(contact.id);
    setEditDraft({
      label: contact.label,
      phone: contact.phone,
      isPrimary: contact.isPrimary,
    });
    setError(null);
  }

  return (
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">კონტაქტები</h2>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => {
            setIsAdding(true);
            setAddDraft(emptyDraft);
            setError(null);
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          ნომრის დამატება
        </button>
      </div>

      {owner.contacts.length === 0 ? (
        <p className="text-sm text-muted-foreground">კონტაქტები არ არის.</p>
      ) : (
        <ul className="space-y-2">
          {owner.contacts.map((contact) => (
            <li
              key={contact.id}
              className="rounded-lg border border-border bg-muted/40 px-4 py-3"
            >
              {editingContactId === contact.id ? (
                <div className="space-y-2">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      type="text"
                      value={editDraft.label}
                      onChange={(event) =>
                        setEditDraft((previous) => ({
                          ...previous,
                          label: event.target.value,
                        }))
                      }
                      placeholder="ეტიკეტი"
                      className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm outline-none focus:border-primary"
                    />
                    <input
                      type="tel"
                      value={editDraft.phone}
                      onChange={(event) =>
                        setEditDraft((previous) => ({
                          ...previous,
                          phone: event.target.value,
                        }))
                      }
                      placeholder="ტელეფონი"
                      className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <label className="inline-flex items-center gap-1.5 text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={editDraft.isPrimary}
                      onChange={(event) =>
                        setEditDraft((previous) => ({
                          ...previous,
                          isPrimary: event.target.checked,
                        }))
                      }
                    />
                    მთავარი
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => void handleSaveEdit(contact.id)}
                      className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                    >
                      შენახვა
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingContactId(null)}
                      className="rounded-full border border-border px-3 py-1 text-xs font-medium"
                    >
                      გაუქმება
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {contact.label.trim() || "კონტაქტი"} — {contact.phone}
                      </p>
                      {contact.isPrimary ? (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          მთავარი
                        </span>
                      ) : null}
                    </div>
                    <a
                      href={`tel:${formatPhoneHref(contact.phone)}`}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Phone className="h-3 w-3" aria-hidden="true" />
                      დარეკვა
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {!contact.isPrimary ? (
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => void handleMarkPrimary(contact)}
                        className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground transition hover:bg-muted"
                      >
                        მთავარი
                      </button>
                    ) : null}
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => startEdit(contact)}
                      className="text-muted-foreground transition hover:text-foreground"
                      aria-label="კონტაქტის რედაქტირება"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      disabled={isSaving || !canDeleteContact}
                      onClick={() => setContactToDelete(contact)}
                      className="text-muted-foreground transition hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="კონტაქტის წაშლა"
                      title={
                        canDeleteContact
                          ? "წაშლა"
                          : "ბოლო კონტაქტის წაშლა შეუძლებელია"
                      }
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {isAdding ? (
        <div className="mt-4 space-y-2 rounded-lg border border-dashed border-border p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              type="text"
              value={addDraft.label}
              onChange={(event) =>
                setAddDraft((previous) => ({ ...previous, label: event.target.value }))
              }
              placeholder="ეტიკეტი, მაგ. ქმარი გიორგი"
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm outline-none focus:border-primary"
            />
            <input
              type="tel"
              value={addDraft.phone}
              onChange={(event) =>
                setAddDraft((previous) => ({ ...previous, phone: event.target.value }))
              }
              placeholder="ტელეფონი"
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <label className="inline-flex items-center gap-1.5 text-xs font-medium">
            <input
              type="checkbox"
              checked={addDraft.isPrimary}
              onChange={(event) =>
                setAddDraft((previous) => ({
                  ...previous,
                  isPrimary: event.target.checked,
                }))
              }
            />
            მთავარი
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => void handleAdd()}
              className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
            >
              დამატება
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium"
            >
              გაუქმება
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <ConfirmDialog
        open={contactToDelete !== null}
        title="კონტაქტის წაშლა"
        description={
          contactToDelete
            ? `გსურთ წაშალოთ ${contactToDelete.label || "ეს ნომერი"} — ${contactToDelete.phone}?`
            : ""
        }
        confirmLabel="წაშლა"
        cancelLabel="გაუქმება"
        isProcessing={isSaving}
        error={error}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setContactToDelete(null)}
      />
    </section>
  );
}
