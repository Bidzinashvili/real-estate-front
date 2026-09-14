"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createCollaboration } from "@/features/collaboration/collaborationApi";
import type { CollaborationAgentOption } from "@/features/collaboration/collaborationApi.types";
import {
  additionalParticipantsNeeded,
  COLLABORATION_SPLITS,
  type CollaborationSplit,
} from "@/features/collaboration/collaborationEnums";
import { COLLABORATION_SPLIT_LABELS } from "@/features/collaboration/collaborationLabels";
import { useCollaborationAgentOptions } from "@/features/collaboration/useCollaborationAgentOptions";

type CreateCollaborationModalProps = {
  open: boolean;
  propertyId: string;
  clientId?: string;
  onClose: () => void;
};

export function CreateCollaborationModal({
  open,
  propertyId,
  clientId,
  onClose,
}: CreateCollaborationModalProps) {
  const router = useRouter();
  const [split, setSplit] = useState<CollaborationSplit>(50);
  const [search, setSearch] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<CollaborationAgentOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const neededCount = additionalParticipantsNeeded(split);
  const { agents, isLoading, error } = useCollaborationAgentOptions({
    enabled: open && neededCount > 0,
    search,
  });

  const availableAgents = useMemo(
    () =>
      agents.filter(
        (agentOption) =>
          !selectedAgents.some((selected) => selected.id === agentOption.id),
      ),
    [agents, selectedAgents],
  );

  if (!open) {
    return null;
  }

  function resetAndClose() {
    setSplit(50);
    setSearch("");
    setSelectedAgents([]);
    setSubmitError(null);
    onClose();
  }

  function handleSplitChange(nextSplit: CollaborationSplit) {
    setSplit(nextSplit);
    const nextNeeded = additionalParticipantsNeeded(nextSplit);
    setSelectedAgents((current) => current.slice(0, nextNeeded));
    setSubmitError(null);
  }

  async function handleSubmit() {
    if (selectedAgents.length !== neededCount) {
      setSubmitError(
        neededCount === 0
          ? null
          : `აირჩიეთ ზუსტად ${neededCount} დამატებითი აგენტი.`,
      );
      if (neededCount > 0) {
        return;
      }
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const created = await createCollaboration({
        propertyId,
        split,
        ...(clientId ? { clientId } : {}),
        ...(neededCount > 0
          ? { additionalParticipantIds: selectedAgents.map((agentOption) => agentOption.id) }
          : {}),
      });
      resetAndClose();
      router.push(`/collaborations/${created.id}`);
    } catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : "თანამშრომლობის მოთხოვნა ვერ გაიგზავნა.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-primary/40 px-4 py-8 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-collaboration-title"
        className="w-full max-w-lg rounded-2xl bg-card p-5 shadow-lg ring-1 ring-border"
      >
        <h2 id="create-collaboration-title" className="text-base font-semibold text-foreground">
          მინდა თანამშრომლობა
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          აირჩიეთ თანამშრომლობის წილი ამ განცხადებისთვის. ეს არ არის შესაბამისობის პროცენტი.
        </p>

        <fieldset className="mt-4 space-y-2">
          <legend className="text-xs font-medium text-muted-foreground">წილი</legend>
          {COLLABORATION_SPLITS.map((splitOption) => (
            <label
              key={splitOption}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2 text-sm ${
                split === splitOption
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border text-foreground hover:bg-muted"
              }`}
            >
              <input
                type="radio"
                name="collaboration-split"
                checked={split === splitOption}
                onChange={() => handleSplitChange(splitOption)}
                className="mt-1"
              />
              <span>{COLLABORATION_SPLIT_LABELS[splitOption]}</span>
            </label>
          ))}
        </fieldset>

        {neededCount > 0 ? (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              დამატებითი აგენტები ({selectedAgents.length}/{neededCount})
            </p>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="აგენტის ძიება…"
              className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            {selectedAgents.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {selectedAgents.map((agentOption) => (
                  <li key={agentOption.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAgents((current) =>
                          current.filter((item) => item.id !== agentOption.id),
                        )
                      }
                      className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      {agentOption.fullName} ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {isLoading ? <p className="text-xs text-muted-foreground">აგენტები იტვირთება…</p> : null}
            {error ? (
              <p className="text-xs text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            {!isLoading && !error ? (
              <ul className="max-h-40 overflow-y-auto rounded-xl border border-border">
                {availableAgents.length === 0 ? (
                  <li className="px-3 py-2 text-xs text-muted-foreground">აგენტები ვერ მოიძებნა.</li>
                ) : (
                  availableAgents.map((agentOption) => (
                    <li key={agentOption.id}>
                      <button
                        type="button"
                        disabled={selectedAgents.length >= neededCount}
                        onClick={() =>
                          setSelectedAgents((current) =>
                            current.some((item) => item.id === agentOption.id)
                              ? current
                              : [...current, agentOption],
                          )
                        }
                        className="flex w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {agentOption.fullName}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            ) : null}
          </div>
        ) : null}

        {submitError ? (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {submitError}
          </p>
        ) : null}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={resetAndClose}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted disabled:opacity-60"
          >
            გაუქმება
          </button>
          <button
            type="button"
            disabled={isSubmitting || selectedAgents.length !== neededCount}
            onClick={() => void handleSubmit()}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "იგზავნება…" : "მოთხოვნის გაგზავნა"}
          </button>
        </div>
      </div>
    </div>
  );
}
