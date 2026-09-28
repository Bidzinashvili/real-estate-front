export const CLIENT_LABELS_FIELD_TITLE = "დამატებითი მოთხოვნები";

export const CLIENT_LABELS_HELPER_TEXT =
  "აირჩიეთ თქვენთვის მნიშვნელოვანი დამატებითი პირობები ან დაამატეთ საკუთარი.";

export const CLIENT_LABEL_SUGGESTIONS = [
  "მეტროსთან ახლოს",
  "მშვიდი ადგილი",
  "კარგი ხედი",
  "ცენტრალური ადგილი",
  "პარკთან ახლოს",
  "სკოლასთან ახლოს",
  "ეზო",
] as const;

export type ClientLabelSuggestion = (typeof CLIENT_LABEL_SUGGESTIONS)[number];

const clientLabelSuggestionKeys = new Set<string>(
  CLIENT_LABEL_SUGGESTIONS.map((suggestion) => suggestion.toLocaleLowerCase()),
);

export function isClientLabelSuggestion(labelName: string): labelName is ClientLabelSuggestion {
  return clientLabelSuggestionKeys.has(labelName.toLocaleLowerCase());
}

export function findClientLabelSuggestionMatch(labelName: string): ClientLabelSuggestion | null {
  const normalizedKey = labelName.toLocaleLowerCase();
  for (const suggestion of CLIENT_LABEL_SUGGESTIONS) {
    if (suggestion.toLocaleLowerCase() === normalizedKey) {
      return suggestion;
    }
  }
  return null;
}
