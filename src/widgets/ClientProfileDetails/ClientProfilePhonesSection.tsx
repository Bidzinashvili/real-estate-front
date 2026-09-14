"use client";

import { useState } from "react";
import { Pencil, Phone, Plus, Trash2 } from "lucide-react";
import {
  addClientProfilePhone,
  deleteClientProfilePhone,
  updateClientProfilePhone,
} from "@/features/clientProfiles/api";
import { isPhoneLike } from "@/features/clientProfiles/phoneLike";
import type {
  ClientProfile,
  ClientProfilePhone,
} from "@/features/clientProfiles/types";
import { ConfirmDialog } from "@/widgets/ConfirmDialog/ConfirmDialog";

type ClientProfilePhonesSectionProps = {
  profile: ClientProfile;
  onUpdated: () => void;
};

type PhoneDraft = {
  label: string;
  phone: string;
  isPrimary: boolean;
};

const emptyDraft: PhoneDraft = {
  label: "",
  phone: "",
  isPrimary: false,
};

function formatPhoneHref(raw: string): string {
  return raw.replace(/\s+/g, "");
}

export function ClientProfilePhonesSection({
  profile,
  onUpdated,
}: ClientProfilePhonesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [addDraft, setAddDraft] = useState<PhoneDraft>(emptyDraft);
  const [editingPhoneId, setEditingPhoneId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<PhoneDraft>(emptyDraft);
  const [phoneToDelete, setPhoneToDelete] = useState<ClientProfilePhone | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDeletePhone = profile.phones.length > 1;

  function validateDraft(draft: PhoneDraft): string | null {
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
      await addClientProfilePhone(profile.id, {
        label: addDraft.label.trim(),
        phone: addDraft.phone.trim(),
        isPrimary: addDraft.isPrimary,
      });
      onUpdated();
      setAddDraft(emptyDraft);
      setIsAdding(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "ნომრის დამატება ვერ მოხერხდა.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveEdit(phoneId: string) {
    const validationError = validateDraft(editDraft);
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await updateClientProfilePhone(profile.id, phoneId, {
        label: editDraft.label.trim(),
        phone: editDraft.phone.trim(),
        isPrimary: editDraft.isPrimary,
      });
      onUpdated();
      setEditingPhoneId(null);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "ნომრის განახლება ვერ მოხერხდა.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMarkPrimary(phoneItem: ClientProfilePhone) {
    if (phoneItem.isPrimary) {
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await updateClientProfilePhone(profile.id, phoneItem.id, {
        isPrimary: true,
      });
      onUpdated();
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
    if (!phoneToDelete) {
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await deleteClientProfilePhone(profile.id, phoneToDelete.id);
      onUpdated();
      setPhoneToDelete(null);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "ნომრის წაშლა ვერ მოხერხდა.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function startEdit(phoneItem: ClientProfilePhone) {
    setEditingPhoneId(phoneItem.id);
    setEditDraft({
      label: phoneItem.label,
      phone: phoneItem.phone,
      isPrimary: phoneItem.isPrimary,
    });
    setError(null);
  }

  return (
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">ნომრები</h2>
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

      {profile.phones.length === 0 ? (
        <p className="text-sm text-muted-foreground">ნომრები არ არის.</p>
      ) : (
        <ul className="space-y-2">
          {profile.phones.map((phoneItem) => (
            <li
              key={phoneItem.id}
              className="rounded-lg border border-border bg-muted/40 px-4 py-3"
            >
              {editingPhoneId === phoneItem.id ? (
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
                      placeholder="555555555 ან +77777777777"
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
                      onClick={() => void handleSaveEdit(phoneItem.id)}
                      className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                    >
                      შენახვა
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingPhoneId(null)}
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
                        {phoneItem.label.trim() || "ნომერი"} — {phoneItem.phone}
                      </p>
                      {phoneItem.isPrimary ? (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          მთავარი
                        </span>
                      ) : null}
                    </div>
                    <a
                      href={`tel:${formatPhoneHref(phoneItem.phone)}`}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Phone className="h-3 w-3" aria-hidden="true" />
                      დარეკვა
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {!phoneItem.isPrimary ? (
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => void handleMarkPrimary(phoneItem)}
                        className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground transition hover:bg-muted"
                      >
                        მთავარი
                      </button>
                    ) : null}
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => startEdit(phoneItem)}
                      className="text-muted-foreground transition hover:text-foreground"
                      aria-label="ნომრის რედაქტირება"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      disabled={isSaving || !canDeletePhone}
                      onClick={() => setPhoneToDelete(phoneItem)}
                      className="text-muted-foreground transition hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="ნომრის წაშლა"
                      title={
                        canDeletePhone
                          ? "წაშლა"
                          : "ბოლო ნომრის წაშლა შეუძლებელია"
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
                setAddDraft((previous) => ({
                  ...previous,
                  label: event.target.value,
                }))
              }
              placeholder="ეტიკეტი"
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm outline-none focus:border-primary"
            />
            <input
              type="tel"
              value={addDraft.phone}
              onChange={(event) =>
                setAddDraft((previous) => ({
                  ...previous,
                  phone: event.target.value,
                }))
              }
              placeholder="555555555 ან +77777777777"
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

      {error && phoneToDelete === null ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <ConfirmDialog
        open={phoneToDelete !== null}
        title="ნომრის წაშლა"
        description={
          phoneToDelete
            ? `გსურთ წაშალოთ ${phoneToDelete.label || "ეს ნომერი"} — ${phoneToDelete.phone}?`
            : ""
        }
        confirmLabel="წაშლა"
        cancelLabel="გაუქმება"
        isProcessing={isSaving}
        error={error}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => {
          setPhoneToDelete(null);
          setError(null);
        }}
      />
    </section>
  );
}
