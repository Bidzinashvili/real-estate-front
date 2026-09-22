"use client";

import { useLayoutEffect, useRef } from "react";
import { applyHistoryNoteTextChange } from "@/shared/lib/historyDatePrefix";
import { cn } from "@/shared/lib/utils";

type HistoryNoteFieldProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  rows?: number;
  textareaClassName?: string;
  required?: boolean;
  error?: string;
  hint?: string;
};

export function HistoryNoteField({
  id,
  label,
  value,
  onChange,
  rows = 4,
  textareaClassName,
  required = false,
  error,
  hint,
}: HistoryNoteFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const caretStartRef = useRef(0);
  const caretEndRef = useRef(0);
  const pendingCursorPositionRef = useRef<number | null>(null);
  const hasRefreshedLeadingDateRef = useRef(false);

  function rememberCaret() {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    caretStartRef.current = textarea.selectionStart;
    caretEndRef.current = textarea.selectionEnd;
  }

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    const cursorPosition = pendingCursorPositionRef.current;
    if (!textarea || cursorPosition === null) {
      return;
    }
    pendingCursorPositionRef.current = null;
    const boundedPosition = Math.min(
      Math.max(cursorPosition, 0),
      textarea.value.length,
    );
    textarea.focus();
    textarea.setSelectionRange(boundedPosition, boundedPosition);
  }, [value]);

  function handleChange(rawValue: string, nativeSelectionStart: number) {
    const shouldRefreshLeadingDate = !hasRefreshedLeadingDateRef.current;
    const nextValue = applyHistoryNoteTextChange({
      previousValue: value,
      rawValue,
      caretStart: caretStartRef.current,
      caretEnd: caretEndRef.current,
      shouldRefreshLeadingDate,
    });
    const hasMeaningfulEdit =
      nextValue !== rawValue || value.trim() !== rawValue.trim();
    if (hasMeaningfulEdit) {
      hasRefreshedLeadingDateRef.current = true;
    }
    const cursorOffset = nextValue.length - rawValue.length;
    const nextCursor = nativeSelectionStart + cursorOffset;
    if (nextValue !== rawValue) {
      pendingCursorPositionRef.current = nextCursor;
    }
    caretStartRef.current = nextCursor;
    caretEndRef.current = nextCursor;
    onChange(nextValue);
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <textarea
        ref={textareaRef}
        id={id}
        rows={rows}
        value={value}
        onFocus={rememberCaret}
        onSelect={rememberCaret}
        onKeyDown={rememberCaret}
        onKeyUp={rememberCaret}
        onClick={rememberCaret}
        onChange={(event) =>
          handleChange(event.target.value, event.target.selectionStart)
        }
        className={cn(textareaClassName)}
      />
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
