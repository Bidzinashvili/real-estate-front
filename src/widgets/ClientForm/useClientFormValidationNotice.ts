"use client";

import { useCallback, useState } from "react";

export const CLIENT_FORM_REQUIRED_FIELDS_SUMMARY =
  "გთხოვთ შეავსოთ სავალდებულო ველები.";

export function useClientFormValidationNotice() {
  const [showRequiredFieldsSummary, setShowRequiredFieldsSummary] = useState(false);

  const onInvalidSubmit = useCallback(() => {
    setShowRequiredFieldsSummary(true);
  }, []);

  const clearValidationNotice = useCallback(() => {
    setShowRequiredFieldsSummary(false);
  }, []);

  return {
    showRequiredFieldsSummary,
    onInvalidSubmit,
    clearValidationNotice,
  };
}
