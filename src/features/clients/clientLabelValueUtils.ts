import {
  CLIENT_LABEL_SUGGESTIONS,
  findClientLabelSuggestionMatch,
  type ClientLabelSuggestion,
} from "@/features/clients/clientLabelSuggestions";

export function normalizeClientLabelName(rawValue: string): string {
  return rawValue.trim().replace(/\s+/g, " ");
}

export function clientLabelsIncludeName(labels: string[], candidateName: string): boolean {
  const candidateKey = candidateName.toLocaleLowerCase();
  return labels.some((labelName) => labelName.toLocaleLowerCase() === candidateKey);
}

export function resolveClientLabelName(rawValue: string): string {
  const normalizedName = normalizeClientLabelName(rawValue);
  if (normalizedName === "") {
    return "";
  }
  const matchedSuggestion = findClientLabelSuggestionMatch(normalizedName);
  return matchedSuggestion ?? normalizedName;
}

export function sanitizeClientLabelList(rawLabels: string[] | undefined): string[] {
  const seenKeys = new Set<string>();
  const sanitizedLabels: string[] = [];

  for (const rawLabel of rawLabels ?? []) {
    const resolvedName = resolveClientLabelName(rawLabel);
    if (resolvedName === "") {
      continue;
    }
    const dedupeKey = resolvedName.toLocaleLowerCase();
    if (seenKeys.has(dedupeKey)) {
      continue;
    }
    seenKeys.add(dedupeKey);
    sanitizedLabels.push(resolvedName);
  }

  return sanitizedLabels;
}

export function partitionClientLabelsBySuggestion(labels: string[]): {
  customLabels: string[];
  selectedSuggestions: ClientLabelSuggestion[];
} {
  const customLabels: string[] = [];
  const selectedSuggestions: ClientLabelSuggestion[] = [];

  for (const labelName of labels) {
    const matchedSuggestion = findClientLabelSuggestionMatch(labelName);
    if (matchedSuggestion) {
      if (!selectedSuggestions.includes(matchedSuggestion)) {
        selectedSuggestions.push(matchedSuggestion);
      }
      continue;
    }
    customLabels.push(labelName);
  }

  return { customLabels, selectedSuggestions };
}

export function mergeClientLabels(args: {
  customLabels: string[];
  selectedSuggestions: ClientLabelSuggestion[];
}): string[] {
  const orderedSuggestions = CLIENT_LABEL_SUGGESTIONS.filter((suggestion) =>
    args.selectedSuggestions.includes(suggestion),
  );
  return sanitizeClientLabelList([...args.customLabels, ...orderedSuggestions]);
}

export function removeClientLabelName(labels: string[], labelToRemove: string): string[] {
  const removeKey = labelToRemove.toLocaleLowerCase();
  return labels.filter((labelName) => labelName.toLocaleLowerCase() !== removeKey);
}
