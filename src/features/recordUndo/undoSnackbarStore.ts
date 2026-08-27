"use client";

import { create } from "zustand";
import { UNDO_SNACKBAR_DURATION_MS } from "@/features/recordUndo/undoCopy";

export type UndoSnackbarItem = {
  id: string;
  message: string;
  durationMs: number;
  isUndoing: boolean;
  onUndo: () => Promise<void>;
};

export type FeedbackSnackbarItem = {
  id: string;
  kind: "success" | "error";
  message: string;
  durationMs: number;
};

type ShowUndoInput = {
  message: string;
  durationMs?: number;
  onUndo: () => Promise<void>;
};

type ShowFeedbackInput = {
  kind: "success" | "error";
  message: string;
  durationMs?: number;
};

type UndoSnackbarStore = {
  undoItems: UndoSnackbarItem[];
  feedbackItems: FeedbackSnackbarItem[];
  showUndo: (input: ShowUndoInput) => string;
  dismissUndo: (itemId: string) => void;
  runUndo: (itemId: string) => Promise<void>;
  showFeedback: (input: ShowFeedbackInput) => void;
  dismissFeedback: (itemId: string) => void;
  clearAll: () => void;
};

const pendingUndoTimers = new Map<string, number>();
const pendingFeedbackTimers = new Map<string, number>();

function createSnackbarId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `snackbar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function clearTimer(timers: Map<string, number>, itemId: string): void {
  const timerId = timers.get(itemId);
  if (timerId !== undefined) {
    window.clearTimeout(timerId);
    timers.delete(itemId);
  }
}

function scheduleDismiss(
  timers: Map<string, number>,
  itemId: string,
  durationMs: number,
  dismiss: (nextId: string) => void,
): void {
  if (typeof window === "undefined") {
    return;
  }
  clearTimer(timers, itemId);
  const timerId = window.setTimeout(() => {
    timers.delete(itemId);
    dismiss(itemId);
  }, durationMs);
  timers.set(itemId, timerId);
}

export const useUndoSnackbarStore = create<UndoSnackbarStore>((set, get) => ({
  undoItems: [],
  feedbackItems: [],

  showUndo: (input) => {
    const itemId = createSnackbarId();
    const durationMs = input.durationMs ?? UNDO_SNACKBAR_DURATION_MS;
    set((state) => ({
      undoItems: [
        ...state.undoItems,
        {
          id: itemId,
          message: input.message,
          durationMs,
          isUndoing: false,
          onUndo: input.onUndo,
        },
      ],
    }));
    scheduleDismiss(pendingUndoTimers, itemId, durationMs, (expiredId) => {
      const current = get().undoItems.find((item) => item.id === expiredId);
      if (current?.isUndoing) {
        return;
      }
      get().dismissUndo(expiredId);
    });
    return itemId;
  },

  dismissUndo: (itemId) => {
    clearTimer(pendingUndoTimers, itemId);
    set((state) => ({
      undoItems: state.undoItems.filter((item) => item.id !== itemId),
    }));
  },

  runUndo: async (itemId) => {
    const current = get().undoItems.find((item) => item.id === itemId);
    if (!current || current.isUndoing) {
      return;
    }
    clearTimer(pendingUndoTimers, itemId);
    set((state) => ({
      undoItems: state.undoItems.map((item) =>
        item.id === itemId ? { ...item, isUndoing: true } : item,
      ),
    }));
    try {
      await current.onUndo();
      get().dismissUndo(itemId);
    } catch {
      set((state) => ({
        undoItems: state.undoItems.map((item) =>
          item.id === itemId ? { ...item, isUndoing: false } : item,
        ),
      }));
      scheduleDismiss(
        pendingUndoTimers,
        itemId,
        current.durationMs,
        (expiredId) => {
          const remaining = get().undoItems.find((item) => item.id === expiredId);
          if (remaining?.isUndoing) {
            return;
          }
          get().dismissUndo(expiredId);
        },
      );
    }
  },

  showFeedback: (input) => {
    const itemId = createSnackbarId();
    const durationMs = input.durationMs ?? 3000;
    set((state) => ({
      feedbackItems: [
        ...state.feedbackItems,
        {
          id: itemId,
          kind: input.kind,
          message: input.message,
          durationMs,
        },
      ],
    }));
    scheduleDismiss(pendingFeedbackTimers, itemId, durationMs, (expiredId) => {
      get().dismissFeedback(expiredId);
    });
  },

  dismissFeedback: (itemId) => {
    clearTimer(pendingFeedbackTimers, itemId);
    set((state) => ({
      feedbackItems: state.feedbackItems.filter((item) => item.id !== itemId),
    }));
  },

  clearAll: () => {
    if (typeof window !== "undefined") {
      pendingUndoTimers.forEach((timerId) => window.clearTimeout(timerId));
      pendingFeedbackTimers.forEach((timerId) => window.clearTimeout(timerId));
    }
    pendingUndoTimers.clear();
    pendingFeedbackTimers.clear();
    set({ undoItems: [], feedbackItems: [] });
  },
}));

export function showUndoSnackbar(input: ShowUndoInput): string {
  return useUndoSnackbarStore.getState().showUndo(input);
}

export function showFeedbackSnackbar(input: ShowFeedbackInput): void {
  useUndoSnackbarStore.getState().showFeedback(input);
}
