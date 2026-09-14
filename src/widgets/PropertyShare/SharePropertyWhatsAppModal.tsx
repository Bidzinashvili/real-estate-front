"use client";

import { useEffect, useId, useState } from "react";
import {
  INACTIVE_SHARE_WARNING,
  INVALID_PHONE_MESSAGE,
} from "@/features/propertyShare/clientPropertyShare";
import {
  buildPropertyWhatsAppMessage,
  extractWhatsAppDigits,
  getBrowserOrigin,
  getPublicPropertyShareUrl,
  openPropertyWhatsAppShare,
} from "@/features/propertyShare/propertyWhatsAppShare";

type SharePropertyWhatsAppModalProps = {
  open: boolean;
  propertyId: string;
  title: string;
  isInactive: boolean;
  mode: "manual" | "select";
  phoneOptions?: string[];
  onClose: () => void;
};

export function SharePropertyWhatsAppModal({
  open,
  propertyId,
  title,
  isInactive,
  mode,
  phoneOptions = [],
  onClose,
}: SharePropertyWhatsAppModalProps) {
  const phoneFieldId = useId();
  const [manualPhone, setManualPhone] = useState("");
  const [selectedPhone, setSelectedPhone] = useState(phoneOptions[0] ?? "");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const firstPhoneOption = phoneOptions[0] ?? "";
  const phoneOptionsKey = phoneOptions.join("|");

  useEffect(() => {
    if (!open) {
      return;
    }
    setManualPhone("");
    setSelectedPhone(firstPhoneOption);
    setFieldError(null);
  }, [open, firstPhoneOption, phoneOptionsKey]);

  if (!open) {
    return null;
  }

  const origin = getBrowserOrigin();
  const shareUrl = origin ? getPublicPropertyShareUrl(propertyId, origin) : "";
  const messagePreview = buildPropertyWhatsAppMessage({
    title,
    shareUrl,
  });

  function handleOpenWhatsApp() {
    const rawPhone = mode === "manual" ? manualPhone : selectedPhone;
    if (!extractWhatsAppDigits(rawPhone)) {
      setFieldError(INVALID_PHONE_MESSAGE);
      return;
    }
    setFieldError(null);
    const didOpen = openPropertyWhatsAppShare({
      rawPhone,
      propertyId,
      title,
    });
    if (!didOpen) {
      setFieldError(INVALID_PHONE_MESSAGE);
      return;
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-primary/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${phoneFieldId}-title`}
        className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-lg ring-1 ring-border"
      >
        <h2
          id={`${phoneFieldId}-title`}
          className="text-base font-semibold text-foreground"
        >
          WhatsApp-ში გაზიარება
        </h2>

        {isInactive ? (
          <p
            className="mt-3 rounded-xl bg-warning-muted px-3 py-2 text-sm font-medium text-warning-foreground"
            role="status"
          >
            {INACTIVE_SHARE_WARNING}
          </p>
        ) : null}

        {mode === "manual" ? (
          <div className="mt-4 space-y-1.5">
            <label
              htmlFor={phoneFieldId}
              className="block text-sm font-medium text-foreground"
            >
              ტელეფონის ნომერი
            </label>
            <input
              id={phoneFieldId}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={manualPhone}
              onChange={(event) => {
                setManualPhone(event.target.value);
                setFieldError(null);
              }}
              placeholder="555555555 ან +995555555555"
              className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
        ) : (
          <fieldset className="mt-4 space-y-2">
            <legend className="text-sm font-medium text-foreground">
              აირჩიეთ ნომერი
            </legend>
            {phoneOptions.map((phoneOption) => (
              <label
                key={phoneOption}
                className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-foreground hover:bg-muted"
              >
                <input
                  type="radio"
                  name={`${phoneFieldId}-recipient`}
                  value={phoneOption}
                  checked={selectedPhone === phoneOption}
                  onChange={() => {
                    setSelectedPhone(phoneOption);
                    setFieldError(null);
                  }}
                  className="accent-primary"
                />
                <span>{phoneOption}</span>
              </label>
            ))}
          </fieldset>
        )}

        {fieldError ? (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {fieldError}
          </p>
        ) : null}

        {shareUrl ? (
          <p className="mt-3 whitespace-pre-wrap rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
            {messagePreview}
          </p>
        ) : null}

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            გაუქმება
          </button>
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#1ebe57]"
          >
            WhatsApp-ში გახსნა
          </button>
        </div>
      </div>
    </div>
  );
}
