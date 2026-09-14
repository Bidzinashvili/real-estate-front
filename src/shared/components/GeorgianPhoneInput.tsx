"use client";

import {
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import {
  GEORGIAN_PHONE_PREFIX,
  normalizeGeorgianPhone,
} from "@/shared/lib/normalizeGeorgianPhone";
import { cn } from "@/shared/lib/utils";

type GeorgianPhoneInputProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (nextValue: string) => void;
  onBlur?: () => void;
  className?: string;
  disabled?: boolean;
};

const PREFIX_LENGTH = GEORGIAN_PHONE_PREFIX.length;

const defaultInputClassName =
  "block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-primary";

function caretPositionForDigitCount(
  normalizedValue: string,
  digitCount: number,
): number {
  if (digitCount <= 0) {
    return PREFIX_LENGTH;
  }

  let seenDigits = 0;
  for (
    let characterIndex = 0;
    characterIndex < normalizedValue.length;
    characterIndex += 1
  ) {
    const character = normalizedValue[characterIndex];
    if (character !== undefined && character >= "0" && character <= "9") {
      seenDigits += 1;
      if (seenDigits >= digitCount) {
        return Math.max(PREFIX_LENGTH, characterIndex + 1);
      }
    }
  }

  return Math.max(PREFIX_LENGTH, normalizedValue.length);
}

function moveCaretOutsidePrefix(inputElement: HTMLInputElement) {
  const selectionStart = inputElement.selectionStart ?? 0;
  const selectionEnd = inputElement.selectionEnd ?? 0;
  if (selectionStart === selectionEnd && selectionStart < PREFIX_LENGTH) {
    inputElement.setSelectionRange(PREFIX_LENGTH, PREFIX_LENGTH);
  }
}

export function GeorgianPhoneInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  className,
  disabled,
}: GeorgianPhoneInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pendingCaretRef = useRef<number | null>(null);
  const displayValue = normalizeGeorgianPhone(value);

  useLayoutEffect(() => {
    const inputElement = inputRef.current;
    const pendingCaret = pendingCaretRef.current;
    if (!inputElement || pendingCaret === null) {
      return;
    }

    inputElement.setSelectionRange(pendingCaret, pendingCaret);
    pendingCaretRef.current = null;
  }, [displayValue]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value;
    const selectionStart = event.target.selectionStart ?? rawValue.length;
    const digitsBeforeCaret = rawValue.slice(0, selectionStart).replace(/\D/g, "").length;
    const nextValue = normalizeGeorgianPhone(rawValue);

    const wasAtEnd = selectionStart >= rawValue.length;
    pendingCaretRef.current = wasAtEnd
      ? nextValue.length
      : caretPositionForDigitCount(nextValue, digitsBeforeCaret);
    onChange(nextValue);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const selectionStart = event.currentTarget.selectionStart ?? 0;
    const selectionEnd = event.currentTarget.selectionEnd ?? 0;
    const isCollapsed = selectionStart === selectionEnd;

    if (
      event.key === "Backspace" &&
      isCollapsed &&
      selectionStart <= PREFIX_LENGTH
    ) {
      event.preventDefault();
      event.currentTarget.setSelectionRange(PREFIX_LENGTH, PREFIX_LENGTH);
      return;
    }

    if (event.key === "Delete" && isCollapsed && selectionStart < PREFIX_LENGTH) {
      event.preventDefault();
      event.currentTarget.setSelectionRange(PREFIX_LENGTH, PREFIX_LENGTH);
    }
  }

  function handleMouseUp(event: MouseEvent<HTMLInputElement>) {
    moveCaretOutsidePrefix(event.currentTarget);
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    moveCaretOutsidePrefix(event.currentTarget);
  }

  return (
    <input
      ref={inputRef}
      id={id}
      name={name}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      disabled={disabled}
      value={displayValue}
      onChange={handleChange}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      onMouseUp={handleMouseUp}
      onFocus={handleFocus}
      className={cn(defaultInputClassName, className)}
    />
  );
}
