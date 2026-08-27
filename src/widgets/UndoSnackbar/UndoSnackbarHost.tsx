"use client";

import { useUndoSnackbarStore } from "@/features/recordUndo/undoSnackbarStore";
import { UNDO_COPY } from "@/features/recordUndo/undoCopy";

export function UndoSnackbarHost() {
  const undoItems = useUndoSnackbarStore((state) => state.undoItems);
  const feedbackItems = useUndoSnackbarStore((state) => state.feedbackItems);
  const runUndo = useUndoSnackbarStore((state) => state.runUndo);
  const dismissFeedback = useUndoSnackbarStore((state) => state.dismissFeedback);

  if (undoItems.length === 0 && feedbackItems.length === 0) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 lg:pl-64"
      role="region"
      aria-live="polite"
    >
      {feedbackItems.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto flex w-full max-w-lg items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm shadow-lg ring-1 ${
            item.kind === "error"
              ? "bg-destructive text-white ring-destructive/30"
              : "bg-foreground text-background ring-border"
          }`}
        >
          <p className="min-w-0 flex-1 font-medium">{item.message}</p>
          <button
            type="button"
            onClick={() => dismissFeedback(item.id)}
            className="shrink-0 rounded-full px-2 py-1 text-xs font-semibold opacity-80 transition hover:opacity-100"
            aria-label="დახურვა"
          >
            ×
          </button>
        </div>
      ))}
      {undoItems.map((item) => (
        <div
          key={item.id}
          className="pointer-events-auto flex w-full max-w-lg items-center justify-between gap-3 rounded-2xl bg-foreground px-4 py-3 text-sm text-background shadow-lg ring-1 ring-border"
        >
          <p className="min-w-0 flex-1 font-medium">{item.message}</p>
          <button
            type="button"
            disabled={item.isUndoing}
            onClick={() => {
              void runUndo(item.id);
            }}
            className="shrink-0 rounded-full bg-background px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            {item.isUndoing ? "..." : UNDO_COPY.undoAction}
          </button>
        </div>
      ))}
    </div>
  );
}
