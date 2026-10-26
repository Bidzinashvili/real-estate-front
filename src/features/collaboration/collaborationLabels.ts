import type {
  CollaborationNegotiationRole,
  CollaborationParticipantRole,
  CollaborationSplit,
  CollaborationStatus,
  CollaborationStatusGroup,
  CollaborationViewerRole,
  MonitoringState,
} from "@/features/collaboration/collaborationEnums";

export const COLLABORATION_STATUS_LABELS: Record<CollaborationStatus, string> = {
  PENDING_RECIPIENT: "ადრესატის პასუხს ელოდება",
  PENDING_REQUESTER: "შემოთავაზების ავტორის პასუხს ელოდება",
  PENDING_ADMIN: "ადმინისტრატორის დადასტურებას ელოდება",
  APPROVED: "დადასტურებულია",
  REJECTED_BY_RECIPIENT: "უარყოფილია",
  REJECTED_BY_REQUESTER: "უარყოფილია",
  REJECTED_BY_ADMIN: "უარყოფილია",
};

export function formatCollaborationStatusLabel(
  status: CollaborationStatus,
  viewerRole: CollaborationViewerRole | null,
  awaitingRole: CollaborationNegotiationRole | null,
): string {
  if (status === "APPROVED") {
    return COLLABORATION_STATUS_LABELS.APPROVED;
  }
  if (
    status === "REJECTED_BY_RECIPIENT" ||
    status === "REJECTED_BY_REQUESTER" ||
    status === "REJECTED_BY_ADMIN"
  ) {
    return COLLABORATION_STATUS_LABELS[status];
  }
  if (status === "PENDING_ADMIN") {
    return COLLABORATION_STATUS_LABELS.PENDING_ADMIN;
  }
  if (status === "PENDING_RECIPIENT") {
    if (viewerRole === "RECIPIENT" && awaitingRole === "RECIPIENT") {
      return "თქვენი პასუხი ელოდება";
    }
    return COLLABORATION_STATUS_LABELS.PENDING_RECIPIENT;
  }
  if (status === "PENDING_REQUESTER") {
    if (viewerRole === "REQUESTER" && awaitingRole === "REQUESTER") {
      return "თქვენი პასუხი ელოდება";
    }
    return COLLABORATION_STATUS_LABELS.PENDING_REQUESTER;
  }
  return COLLABORATION_STATUS_LABELS[status];
}

export function formatCollaborationProposalUpdatedHint(
  proposedByRole: CollaborationNegotiationRole | null,
  viewerRole: CollaborationViewerRole | null,
): string | null {
  if (!proposedByRole || !viewerRole) {
    return null;
  }
  if (viewerRole !== "REQUESTER" && viewerRole !== "RECIPIENT") {
    return null;
  }
  if (proposedByRole === viewerRole) {
    return null;
  }
  return "მიმდინარე შეთავაზება მეორე მხარემ განაახლა";
}

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
  "This property is private and is not available for collaboration":
    "ეს განცხადება პირადია და თანამშრომლობისთვის ხელმისაწვდომი არ არის.",
  "Additional participants cannot include the requester or listing agent":
    "დამატებითი აგენტები არ უნდა იყვნენ მომთხოვნი ან განცხადების აგენტი.",
  "An active collaboration request already exists for this property":
    "ამ ჩანაწერზე აქტიური თანამშრომლობის მოთხოვნა უკვე არსებობს.",
  "An active collaboration request already exists for this target":
    "ამ ჩანაწერზე აქტიური თანამშრომლობის მოთხოვნა უკვე არსებობს.",
  "Rental collaboration requires a client.":
    "ქირის განცხადებაზე თანამშრომლობისთვის კლიენტის არჩევა აუცილებელია.",
  "You cannot request collaboration on your own record":
    "საკუთარ ჩანაწერზე თანამშრომლობის მოთხოვნას ვერ გააგზავნით.",
  "You cannot request collaboration on your own property":
    "საკუთარ ჩანაწერზე თანამშრომლობის მოთხოვნას ვერ გააგზავნით.",
  "You do not have access to the selected client":
    "არჩეულ კლიენტზე წვდომა არ გაქვთ.",
  "This client is not available for collaboration":
    "ამ კლიენტზე თანამშრომლობის მოთხოვნა შეუძლებელია.",
  "Only the listing agent can accept or reject this request":
    "მხოლოდ განცხადების აგენტს შეუძლია მიღება ან უარყოფა.",
  "Collaboration request is not waiting for a recipient decision":
    "მოთხოვნა აღარ ელოდება განცხადების აგენტის გადაწყვეტილებას.",
  "Collaboration request is not waiting for your decision":
    "ამ მოთხოვნაზე თქვენი გადაწყვეტილება აღარ ელოდება.",
  "Collaboration request is not open for negotiation":
    "ამ მოთხოვნაზე შეთავაზების შეცვლა აღარ შეიძლება.",
  "Counter-offer must propose a different split than the current proposal":
    "აირჩიეთ მიმდინარე შეთავაზებისგან განსხვავებული წილი.",
  "Invalid collaboration split":
    "არჩეული წილი არასწორია. დაშვებულია მხოლოდ 50%, 33% ან 25%.",
  "Split must match one of the allowed collaboration splits":
    "არჩეული წილი არასწორია. დაშვებულია მხოლოდ 50%, 33% ან 25%.",
  "Collaboration request is not waiting for admin approval":
    "მოთხოვნა აღარ ელოდება ადმინის დასტურს.",
  "Property is no longer available": "განცხადება აღარ არის ხელმისაწვდომი.",
  "You do not have access to this collaboration request":
    "ამ თანამშრომლობის მოთხოვნაზე წვდომა არ გაქვთ.",
};

export const COLLABORATION_GENERIC_SEND_ERROR =
  "თანამშრომლობის მოთხოვნის გაგზავნა ვერ მოხერხდა.";

export function formatCollaborationApiMessage(message: string): string {
  const mapped = BACKEND_MESSAGE_LABELS[message];
  if (mapped) {
    return mapped;
  }
  const trimmed = message.trim();
  if (trimmed.length > 0 && /^[\x00-\x7F]+$/.test(trimmed)) {
    return COLLABORATION_GENERIC_SEND_ERROR;
  }
  return message;
}
