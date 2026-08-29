"use client";

import { useCallback, useRef, useState } from "react";
import { generatePropertyPublicText } from "@/features/properties/api";
import { GENERATE_PUBLIC_TEXT_COPY } from "@/features/properties/generatePublicTextCopy";
import type { GeneratePublicTextDraft } from "@/features/properties/propertyApiTypes";

type UseGeneratePublicTextResult = {
  isGenerating: boolean;
  error: string | null;
  generateFromDraft: (draft: GeneratePublicTextDraft) => Promise<string | null>;
};

export function useGeneratePublicText(): UseGeneratePublicTextResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRequestInFlightRef = useRef(false);

  const runGeneration = useCallback(
    async (request: () => Promise<{ text: string }>): Promise<string | null> => {
      if (isRequestInFlightRef.current) {
        return null;
      }

      isRequestInFlightRef.current = true;
      setIsGenerating(true);
      setError(null);

      try {
        const response = await request();
        return response.text;
      } catch (caught) {
        const message =
          caught instanceof Error
            ? caught.message
            : GENERATE_PUBLIC_TEXT_COPY.generateError;
        setError(message);
        return null;
      } finally {
        isRequestInFlightRef.current = false;
        setIsGenerating(false);
      }
    },
    [],
  );

  const generateFromDraft = useCallback(
    (draft: GeneratePublicTextDraft) => {
      return runGeneration(() => generatePropertyPublicText(draft));
    },
    [runGeneration],
  );

  return {
    isGenerating,
    error,
    generateFromDraft,
  };
}
