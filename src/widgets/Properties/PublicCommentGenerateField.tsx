"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { GENERATE_PUBLIC_TEXT_COPY } from "@/features/properties/generatePublicTextCopy";
import type { GeneratePublicTextDraft } from "@/features/properties/propertyApiTypes";
import { useGeneratePublicText } from "@/features/properties/useGeneratePublicText";
import { ConfirmDialog } from "@/widgets/ConfirmDialog/ConfirmDialog";

type PublicCommentGenerateFieldProps = {
  id: string;
  value: string;
  onChange: (nextValue: string) => void;
  buildDraft: () => GeneratePublicTextDraft;
  textareaClassName: string;
  disabled?: boolean;
  rows?: number;
};

export function PublicCommentGenerateField({
  id,
  value,
  onChange,
  buildDraft,
  textareaClassName,
  disabled = false,
  rows = 8,
}: PublicCommentGenerateFieldProps) {
  const { generateFromDraft, isGenerating, error } = useGeneratePublicText();
  const [isReplaceConfirmOpen, setIsReplaceConfirmOpen] = useState(false);

  async function applyGeneratedText() {
    const generatedText = await generateFromDraft(buildDraft());
    if (generatedText === null) {
      return;
    }
    onChange(generatedText);
  }

  function handleGenerateClick() {
    if (disabled || isGenerating) {
      return;
    }

    if (value.trim() !== "") {
      setIsReplaceConfirmOpen(true);
      return;
    }

    void applyGeneratedText();
  }

  function handleConfirmReplace() {
    setIsReplaceConfirmOpen(false);
    void applyGeneratedText();
  }

  const generateLabel = isGenerating
    ? GENERATE_PUBLIC_TEXT_COPY.generating
    : GENERATE_PUBLIC_TEXT_COPY.generateAction;

  return (
    <div className="space-y-1.5 sm:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          კომენტარი
        </label>
        <button
          type="button"
          onClick={handleGenerateClick}
          disabled={disabled || isGenerating}
          aria-busy={isGenerating}
          aria-label={generateLabel}
          className="inline-flex min-h-11 touch-manipulation items-center justify-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          {generateLabel}
        </button>
      </div>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={`${textareaClassName} min-h-[10rem] resize-y`}
      />
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <ConfirmDialog
        open={isReplaceConfirmOpen}
        title={GENERATE_PUBLIC_TEXT_COPY.confirmTitle}
        description={GENERATE_PUBLIC_TEXT_COPY.confirmDescription}
        confirmLabel={GENERATE_PUBLIC_TEXT_COPY.replaceLabel}
        cancelLabel={GENERATE_PUBLIC_TEXT_COPY.cancelLabel}
        tone="primary"
        isProcessing={isGenerating}
        onConfirm={handleConfirmReplace}
        onCancel={() => setIsReplaceConfirmOpen(false)}
      />
    </div>
  );
}
