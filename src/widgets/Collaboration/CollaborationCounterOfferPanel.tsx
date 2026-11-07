"use client";

import { useMemo, useState } from "react";
import type {
  CollaborationAgentOption,
  CollaborationParticipant,
} from "@/features/collaboration/collaborationApi.types";
import type { CollaborationSplit } from "@/features/collaboration/collaborationEnums";
import { useCollaborationAgentOptions } from "@/features/collaboration/useCollaborationAgentOptions";

type CollaborationCounterOfferPanelProps = {
  currentSplit: CollaborationSplit;
  participants: CollaborationParticipant[];
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (split: CollaborationSplit, additionalParticipantIds: string[]) => void;
};

const MIN_SPLIT = 1;
const MAX_SPLIT = 100;
const MAX_EXTRA_AGENTS = 2;

/** Requester and recipient cannot be picked again as extra agents. */
function readPartyUserIds(participants: CollaborationParticipant[]): Set<string> {
  const ids = new Set<string>();
  for (const participant of participants) {
    if (participant.role === "REQUESTER" || participant.role === "RECIPIENT") {
      if (participant.user?.id) ids.add(participant.user.id);
    }
  }
  return ids;
}

/** Current extra agents, pre-selected so they stay unless the user removes them. */
function readCurrentExtras(participants: CollaborationParticipant[]): CollaborationAgentOption[] {
  return participants
    .filter((participant) => participant.role === "ADDITIONAL" && participant.user)
    .map((participant) => ({
      id: participant.user!.id,
      fullName: participant.user!.fullName,
    }));
}

export function CollaborationCounterOfferPanel({
  currentSplit,
  participants,
  isSubmitting,
  onCancel,
  onSubmit,
}: CollaborationCounterOfferPanelProps) {
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<CollaborationAgentOption[]>(() =>
    readCurrentExtras(participants),
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const excludedIds = useMemo(() => readPartyUserIds(participants), [participants]);
  const { agents, isLoading, error } = useCollaborationAgentOptions({
    enabled: true,
    search,
  });
  const availableAgents = useMemo(
    () =>
      agents.filter(
        (agentOption) =>
          !excludedIds.has(agentOption.id) &&
          !selectedAgents.some((selected) => selected.id === agentOption.id),
      ),
    [agents, excludedIds, selectedAgents],
  );

  function handleSubmit() {
    const trimmed = value.trim();
    const split = Number(trimmed);
    if (trimmed === "" || !Number.isInteger(split) || split < MIN_SPLIT || split > MAX_SPLIT) {
      setSubmitError(`შეიყვანეთ მთელი პროცენტი ${MIN_SPLIT}-დან ${MAX_SPLIT}-მდე.`);
      return;
    }
    if (split === currentSplit) {
      setSubmitError(`მიმდინარე შეთავაზება (${currentSplit}%) უკვე დაყენებულია.`);
      return;
    }
    setSubmitError(null);
    onSubmit(
      split,
      selectedAgents.map((agentOption) => agentOption.id),
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">პროცენტის შეცვლა</h3>
        <p className="text-xs text-muted-foreground">
          ჩაწერეთ თქვენი შეთავაზებული პროცენტი ({MIN_SPLIT}-{MAX_SPLIT}%). მიმდინარე შეთავაზება:{" "}
          {currentSplit}%.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={MIN_SPLIT}
          max={MAX_SPLIT}
          step={1}
          value={value}
          disabled={isSubmitting}
          onChange={(event) => {
            setValue(event.target.value);
            setSubmitError(null);
          }}
          placeholder="მაგ. 40"
          aria-label="შეთავაზებული პროცენტი"
          className="h-9 w-28 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary"
        />
        <span className="text-sm text-foreground">%</span>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          დამატებითი აგენტები — არასავალდებულო (მაქს. {MAX_EXTRA_AGENTS}): {selectedAgents.length}/
          {MAX_EXTRA_AGENTS}
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
                    disabled={selectedAgents.length >= MAX_EXTRA_AGENTS || isSubmitting}
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

      {submitError ? (
        <p className="text-sm text-destructive" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isSubmitting || value.trim() === ""}
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
