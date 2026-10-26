"use client";

import { useState } from "react";
import { Pin, Pencil } from "lucide-react";
import {
  DASHBOARD_ANNOUNCEMENT_MAX_LENGTH,
  DASHBOARD_ANNOUNCEMENT_MAX_LENGTH_MESSAGE,
} from "@/features/dashboardAnnouncement/types";
import { useDashboardAnnouncement } from "@/features/dashboardAnnouncement/useDashboardAnnouncement";
import { showFeedbackSnackbar } from "@/features/recordUndo/undoSnackbarStore";
import { Button } from "@/shared/ui/Button";
import { ErrorState, LoadingState } from "@/shared/ui/PageState";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";

type DashboardAdminAnnouncementProps = {
  isAdmin: boolean;
};

export function DashboardAdminAnnouncement({ isAdmin }: DashboardAdminAnnouncementProps) {
  const {
    message,
    isLoading,
    hasLoaded,
    loadError,
    isSaving,
    saveError,
    saveMessage,
    reload,
  } = useDashboardAnnouncement(true);

  const [isEditing, setIsEditing] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const hasMessage = message.trim().length > 0;

  if (isLoading || !hasLoaded) {
    if (isAdmin) {
      return <LoadingState title="მნიშვნელოვანი ინფორმაცია იტვირთება…" />;
    }
    return null;
  }

  if (loadError) {
    if (!isAdmin) {
      return null;
    }
    return (
      <div className="space-y-3">
        <ErrorState
          title="შეტყობინების ჩატვირთვა ვერ მოხერხდა"
          description={loadError}
        />
        <Button type="button" variant="secondary" size="sm" onClick={() => reload()}>
          ხელახლა ცდა
        </Button>
      </div>
    );
  }

  if (!hasMessage && !isAdmin) {
    return null;
  }

  function startEditing() {
    setDraftMessage(message);
    setValidationError(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setDraftMessage("");
    setValidationError(null);
  }

  async function handleSave() {
    setValidationError(null);
    if (draftMessage.length > DASHBOARD_ANNOUNCEMENT_MAX_LENGTH) {
      setValidationError(DASHBOARD_ANNOUNCEMENT_MAX_LENGTH_MESSAGE);
      return;
    }

    const didSave = await saveMessage(draftMessage);
    if (didSave) {
      setIsEditing(false);
      setDraftMessage("");
      setValidationError(null);
      showFeedbackSnackbar({
        kind: "success",
        message: "შეტყობინება განახლდა.",
      });
    }
  }

  return (
    <SurfaceCard className="bg-primary/[0.03] ring-primary/15">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Pin className="h-4 w-4" aria-hidden />
            </span>
            <h2 className="text-base font-semibold text-foreground">
              მნიშვნელოვანი ინფორმაცია
            </h2>
          </div>

          {isEditing ? (
            <>
              <textarea
                value={draftMessage}
                onChange={(event) => {
                  setDraftMessage(event.target.value);
                  if (validationError) {
                    setValidationError(null);
                  }
                }}
                rows={4}
                maxLength={DASHBOARD_ANNOUNCEMENT_MAX_LENGTH}
                className="field-control min-h-[6rem] resize-y"
                placeholder="ადმინის შეტყობინება…"
              />
              <p className="text-xs text-muted-foreground">
                {draftMessage.length} / {DASHBOARD_ANNOUNCEMENT_MAX_LENGTH}
              </p>
            </>
          ) : hasMessage ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {message}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              ჯერ არ არის გამოქვეყნებული შეტყობინება.
            </p>
          )}

          {validationError ? (
            <p className="text-sm text-destructive" role="alert">
              {validationError}
            </p>
          ) : null}

          {saveError ? (
            <p className="text-sm text-destructive" role="alert">
              {saveError}
            </p>
          ) : null}
        </div>

        {isAdmin ? (
          <div className="flex shrink-0 flex-wrap gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isSaving}
                  onClick={() => void handleSave()}
                >
                  შენახვა
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isSaving}
                  onClick={cancelEditing}
                >
                  გაუქმება
                </Button>
              </>
            ) : (
              <Button variant="secondary" size="sm" onClick={startEditing}>
                <Pencil className="h-3.5 w-3.5" aria-hidden />
                რედაქტირება
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </SurfaceCard>
  );
}
