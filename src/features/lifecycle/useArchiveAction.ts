"use client";

import { useState } from "react";
import type { ArchiveConfirmKind } from "@/widgets/Lifecycle/ArchiveConfirmDialog";

type UseArchiveActionOptions = {
  canManage: boolean;
  isArchived: boolean;
  canRestore: boolean;
  onArchive: () => Promise<unknown>;
  onRestore: () => Promise<unknown>;
  onSuccess: () => void;
};

export function useArchiveAction({
  canManage,
  isArchived,
  canRestore,
  onArchive,
  onRestore,
  onSuccess,
}: UseArchiveActionOptions) {
  const [confirmKind, setConfirmKind] = useState<ArchiveConfirmKind | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canShowArchive = canManage && !isArchived;
  const canShowRestore = canManage && canRestore;

  function requestArchive() {
    setError(null);
    setConfirmKind("archive");
  }

  function requestRestore() {
    setError(null);
    setConfirmKind("restore");
  }

  function cancel() {
    if (isPending) {
      return;
    }
    setConfirmKind(null);
    setError(null);
  }

  async function confirm() {
    if (confirmKind === null) {
      return;
    }
    setIsPending(true);
    setError(null);
    try {
      if (confirmKind === "archive") {
        await onArchive();
      } else {
        await onRestore();
      }
      setConfirmKind(null);
      onSuccess();
    } catch (actionError) {
      const message =
        actionError instanceof Error
          ? actionError.message
          : "მოქმედება ვერ შესრულდა.";
      setError(message);
    } finally {
      setIsPending(false);
    }
  }

  return {
    confirmKind,
    isPending,
    error,
    canShowArchive,
    canShowRestore,
    requestArchive,
    requestRestore,
    cancel,
    confirm,
  };
}
