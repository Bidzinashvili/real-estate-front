"use client";

import { useEffect } from "react";

type NoteOpenedKind = "property" | "client";

type UseMarkNoteOpenedArgs = {
  kind: NoteOpenedKind;
  recordId: string | null;
  canMark: boolean;
  markOpened: (recordId: string) => Promise<{ noteLastOpenedAt: string | null }>;
  onOpened: (openedAt: string | null) => void;
};

const SUCCESS_REUSE_MS = 750;

const inFlightMarks = new Map<
  string,
  Promise<{ noteLastOpenedAt: string | null }>
>();

function cacheKeyFor(kind: NoteOpenedKind, recordId: string): string {
  return `${kind}:${recordId}`;
}

function getOrStartOpenedMark(
  cacheKey: string,
  start: () => Promise<{ noteLastOpenedAt: string | null }>,
): Promise<{ noteLastOpenedAt: string | null }> {
  const existing = inFlightMarks.get(cacheKey);
  if (existing) {
    return existing;
  }

  const request = start()
    .then((result) => {
      window.setTimeout(() => {
        inFlightMarks.delete(cacheKey);
      }, SUCCESS_REUSE_MS);
      return result;
    })
    .catch((error: unknown) => {
      inFlightMarks.delete(cacheKey);
      throw error;
    });

  inFlightMarks.set(cacheKey, request);
  return request;
}

export function useMarkNoteOpened({
  kind,
  recordId,
  canMark,
  markOpened,
  onOpened,
}: UseMarkNoteOpenedArgs): void {
  useEffect(() => {
    if (!recordId || !canMark) {
      return;
    }

    const cacheKey = cacheKeyFor(kind, recordId);
    let cancelled = false;

    void getOrStartOpenedMark(cacheKey, () => markOpened(recordId))
      .then((result) => {
        if (cancelled) {
          return;
        }
        onOpened(result.noteLastOpenedAt);
      })
      .catch(() => {
        return;
      });

    return () => {
      cancelled = true;
    };
  }, [canMark, kind, markOpened, onOpened, recordId]);
}
