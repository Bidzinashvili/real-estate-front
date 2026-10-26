"use client";

import { useMemo, useState } from "react";
import type {
  CollaborationAgentOption,
  CollaborationParticipant,
} from "@/features/collaboration/collaborationApi.types";
import {
  additionalParticipantsNeeded,
  COLLABORATION_SPLITS,
  type CollaborationSplit,
} from "@/features/collaboration/collaborationEnums";
import { COLLABORATION_SPLIT_SHORT_LABELS } from "@/features/collaboration/collaborationLabels";
import { useCollaborationAgentOptions } from "@/features/collaboration/useCollaborationAgentOptions";

type CollaborationCounterOfferPanelProps = {
  currentSplit: CollaborationSplit;
  participants: CollaborationParticipant[];
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (split: CollaborationSplit, additionalParticipantIds: string[]) => void;
};

function readExcludedParticipantUserIds(participants: CollaborationParticipant[]): Set<string> {
  const excludedIds = new Set<string>();
  for (const participant of participants) {
    if (participant.role !== "REQUESTER" && participant.role !== "RECIPIENT") {
      continue;
    }
    const userId = participant.user?.id;
    if (userId) {
      excludedIds.add(userId);
    }
  }
  return excludedIds;
}

export function CollaborationCounterOfferPanel({
  currentSplit,
  participants,
  isSubmitting,
  onCancel,
  onSubmit,
}: CollaborationCounterOfferPanelProps) {
  const counterSplitOptions = useMemo(
    () => COLLABORATION_SPLITS.filter((splitOption) => splitOption !== currentSplit),
    [currentSplit],
  );
  const [split, setSplit] = useState<CollaborationSplit>(
    counterSplitOptions[0] ?? 50,
  );
  const [search, setSearch] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<CollaborationAgentOption[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const neededCount = additionalParticipantsNeeded(split);
  const excludedUserIds = useMemo(
    () => readExcludedParticipantUserIds(participants),
    [participants],
  );
  const { agents, isLoading, error } = useCollaborationAgentOptions({
    enabled: neededCount > 0,
    search,
  });

  const availableAgents = useMemo(
    () =>
      agents.filter(
        (agentOption) =>
          !excludedUserIds.has(agentOption.id) &&
          !selectedAgents.some((selected) => selected.id === agentOption.id),
      ),
    [agents, excludedUserIds, selectedAgents],
  );

  function handleSplitChange(nextSplit: CollaborationSplit) {
    setSplit(nextSplit);
    const nextNeeded = additionalParticipantsNeeded(nextSplit);
    setSelectedAgents((current) => current.slice(0, nextNeeded));
    setSubmitError(null);
  }

  function handleSubmit() {
    if (split === currentSplit) {
      setSubmitError("აირჩიეთ მიმდინარე შეთავაზებისგან განსხვავებული წილი.");
      return;
    }
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
    setSubmitError(null);
    onSubmit(
      split,
      neededCount > 0 ? selectedAgents.map((agentOption) => agentOption.id) : [],
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">პროცენტის შეცვლა</h3>
        <p className="text-xs text-muted-foreground">
          აირჩიეთ სხვა დაშვებული წილი. მიმდინარე შეთავაზება ({currentSplit}%) ხელმისაწვდომი
          არ არის.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {counterSplitOptions.map((splitOption) => (
          <button
            key={splitOption}
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSplitChange(splitOption)}
            className={`inline-flex min-w-[4.5rem] items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
              split === splitOption
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            {COLLABORATION_SPLIT_SHORT_LABELS[splitOption]}
          </button>
        ))}
      </div>

      {neededCount > 0 ? (
        <div className="space-y-2">
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
                      disabled={selectedAgents.length >= neededCount || isSubmitting}
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
        <p className="text-sm text-destructive" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isSubmitting || selectedAgents.length !== neededCount}
          onClick={handleSubmit}
          className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "იგზავნება…" : "შეთავაზების გაგზავნა"}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
          className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted disabled:opacity-60"
        >
          გაუქმება
        </button>
      </div>
    </div>
  );
}
