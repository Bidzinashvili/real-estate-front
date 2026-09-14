import type { CollaborationParticipant } from "@/features/collaboration/collaborationApi.types";
import { COLLABORATION_PARTICIPANT_ROLE_LABELS } from "@/features/collaboration/collaborationLabels";

type CollaborationParticipantsListProps = {
  participants: CollaborationParticipant[];
  identitiesRevealed: boolean;
};

export function CollaborationParticipantsList({
  participants,
  identitiesRevealed,
}: CollaborationParticipantsListProps) {
  if (participants.length === 0) {
    return <p className="text-sm text-muted-foreground">მონაწილეები არ არის.</p>;
  }

  return (
    <ul className="space-y-2">
      {participants.map((participant, participantIndex) => {
        const participantKey = `${participant.role}-${participant.user?.id ?? participantIndex}`;
        return (
          <li
            key={participantKey}
            className="rounded-xl border border-border bg-muted/40 px-3 py-2"
          >
            <p className="text-xs font-medium text-muted-foreground">
              {COLLABORATION_PARTICIPANT_ROLE_LABELS[participant.role]}
            </p>
            {participant.user ? (
              <div className="mt-1 space-y-0.5">
                <p className="text-sm font-medium text-foreground">{participant.user.fullName}</p>
                <p className="text-xs text-muted-foreground">{participant.user.email}</p>
                {participant.user.phone ? (
                  <p className="text-xs text-muted-foreground">{participant.user.phone}</p>
                ) : null}
              </div>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                {identitiesRevealed
                  ? "ვინაობა ხელმისაწვდომი არ არის."
                  : "ვინაობა გამოჩნდება ადმინის დამტკიცების შემდეგ."}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
