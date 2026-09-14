"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import {
  appendHistoryDateEntry,
  applyEmptyHistoryDatePrefix,
} from "@/shared/lib/historyDatePrefix";
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
  const [shouldMoveCursorToEnd, setShouldMoveCursorToEnd] = useState(false);

  useLayoutEffect(() => {
    if (!shouldMoveCursorToEnd) {
      return;
    }
    const textarea = textareaRef.current;
    setShouldMoveCursorToEnd(false);
    if (!textarea) {
      return;
    }
    textarea.focus();
    const cursorPosition = textarea.value.length;
    textarea.setSelectionRange(cursorPosition, cursorPosition);
  }, [shouldMoveCursorToEnd, value]);

  function handleChange(rawValue: string) {
    onChange(applyEmptyHistoryDatePrefix(value, rawValue));
  }

  function handleNewEntry() {
    onChange(appendHistoryDateEntry(value));
    setShouldMoveCursorToEnd(true);
  }

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
          {required ? <span className="text-red-500"> *</span> : null}
        </label>
        <button
          type="button"
          onClick={handleNewEntry}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary transition hover:text-primary/80"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          ახალი ჩანაწერი
        </button>
      </div>
      <textarea
        ref={textareaRef}
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => handleChange(event.target.value)}
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
