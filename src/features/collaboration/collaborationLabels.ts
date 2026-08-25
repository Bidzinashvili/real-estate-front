import type {
  CollaborationParticipantRole,
  CollaborationSplit,
  CollaborationStatus,
  CollaborationStatusGroup,
  MonitoringState,
} from "@/features/collaboration/collaborationEnums";

export const COLLABORATION_STATUS_LABELS: Record<CollaborationStatus, string> = {
  PENDING_RECIPIENT: "პასუხს ელოდება",
  PENDING_ADMIN: "ადმინის დასტურს ელოდება",
  APPROVED: "დამტკიცებულია",
  REJECTED_BY_RECIPIENT: "უარყოფილია",
  REJECTED_BY_ADMIN: "უარყოფილია ადმინის მიერ",
};

export const COLLABORATION_STATUS_GROUP_LABELS: Record<
  CollaborationStatusGroup,
  string
> = {
  PENDING: "მოთხოვნები",
  WAITING_ADMIN: "ადმინის დასტურს ელოდება",
  APPROVED: "დამტკიცებულია",
  REJECTED: "უარყოფილია",
};

export const COLLABORATION_SPLIT_LABELS: Record<CollaborationSplit, string> = {
  50: "50% — ორმხრივი გაყოფა",
  33: "33% — სამმხრივი გაყოფა",
  25: "25% — ოთხმხრივი გაყოფა",
};

export const COLLABORATION_SPLIT_SHORT_LABELS: Record<CollaborationSplit, string> = {
  50: "50%",
  33: "33%",
  25: "25%",
};

export const COLLABORATION_PARTICIPANT_ROLE_LABELS: Record<
  CollaborationParticipantRole,
  string
> = {
  REQUESTER: "მომთხოვნი",
  RECIPIENT: "განცხადების აგენტი",
  ADDITIONAL: "დამატებითი აგენტი",
};

export const MONITORING_STATE_LABELS: Record<MonitoringState, string> = {
  WATCHING: "კონტროლდება",
  CLOSED: "დასრულებულია",
};

const BACKEND_MESSAGE_LABELS: Record<string, string> = {
  "Split 33% requires exactly 1 additional participant(s)":
    "33% გაყოფისთვის საჭიროა ზუსტად 1 დამატებითი აგენტი.",
  "Split 25% requires exactly 2 additional participant(s)":
    "25% გაყოფისთვის საჭიროა ზუსტად 2 დამატებითი აგენტი.",
  "You cannot request collaboration on your own property":
    "საკუთარ განცხადებაზე თანამშრომლობის მოთხოვნა შეუძლებელია.",
  "Additional participants cannot include the requester or listing agent":
    "დამატებითი აგენტები არ უნდა იყვნენ მომთხოვნი ან განცხადების აგენტი.",
  "An active collaboration request already exists for this property":
    "ამ განცხადებაზე უკვე არსებობს აქტიური თანამშრომლობის მოთხოვნა.",
  "Only the listing agent can accept or reject this request":
    "მხოლოდ განცხადების აგენტს შეუძლია მიღება ან უარყოფა.",
  "Collaboration request is not waiting for a recipient decision":
    "მოთხოვნა აღარ ელოდება განცხადების აგენტის გადაწყვეტილებას.",
  "Collaboration request is not waiting for admin approval":
    "მოთხოვნა აღარ ელოდება ადმინის დასტურს.",
  "Property is no longer available": "განცხადება აღარ არის ხელმისაწვდომი.",
  "You do not have access to this collaboration request":
    "ამ თანამშრომლობის მოთხოვნაზე წვდომა არ გაქვთ.",
};

export function formatCollaborationApiMessage(message: string): string {
  return BACKEND_MESSAGE_LABELS[message] ?? message;
}
