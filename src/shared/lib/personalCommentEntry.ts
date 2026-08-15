import { formatNoteDate } from "@/shared/lib/formatDate";

type ApplyDatedPersonalCommentEntryArgs = {
  previousValue: string;
  rawValue: string;
  isEntryActive: boolean;
  currentDate?: Date;
};

type DatedPersonalCommentEntryResult = {
  nextValue: string;
  isEntryActive: boolean;
};

export function applyDatedPersonalCommentEntry({
  previousValue,
  rawValue,
  isEntryActive,
  currentDate = new Date(),
}: ApplyDatedPersonalCommentEntryArgs): DatedPersonalCommentEntryResult {
  const isAppendingText =
    rawValue.length > previousValue.length && rawValue.startsWith(previousValue);

  if (isEntryActive) {
    if (rawValue.trim() === "") {
      return { nextValue: rawValue, isEntryActive: false };
    }

    if (isAppendingText) {
      const appendedText = rawValue.slice(previousValue.length);
      if (appendedText.startsWith("\n")) {
        const datePrefix = `${formatNoteDate(currentDate)} - `;
        const entryText = appendedText.replace(/^\n+/, "");
        const separator = previousValue.endsWith("\n") ? "" : "\n";

        return {
          nextValue: `${previousValue}${separator}${datePrefix}${entryText}`,
          isEntryActive: true,
        };
      }
    }

    return { nextValue: rawValue, isEntryActive: true };
  }

  if (!isAppendingText) {
    return { nextValue: rawValue, isEntryActive: false };
  }

  const datePrefix = `${formatNoteDate(currentDate)} - `;
  const appendedText = rawValue.slice(previousValue.length);

  if (previousValue.trim() === "") {
    return {
      nextValue: `${datePrefix}${rawValue.trimStart()}`,
      isEntryActive: true,
    };
  }

  const entryText = appendedText.replace(/^\n+/, "");
  const separator = previousValue.endsWith("\n") ? "" : "\n";

  return {
    nextValue: `${previousValue}${separator}${datePrefix}${entryText}`,
    isEntryActive: true,
  };
}
