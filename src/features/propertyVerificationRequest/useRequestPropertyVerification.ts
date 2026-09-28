"use client";

import { useCallback, useEffect, useState } from "react";
import { requestPropertyVerification } from "@/features/propertyVerificationRequest/propertyVerificationRequestApi";
import { PROPERTY_VERIFICATION_REQUEST_COPY } from "@/features/propertyVerificationRequest/propertyVerificationRequestCopy";
import { PROPERTY_VERIFICATION_REQUEST_ERROR } from "@/features/propertyVerificationRequest/propertyVerificationRequestErrorMessages";
import { showFeedbackSnackbar } from "@/features/recordUndo/undoSnackbarStore";
import { ApiError } from "@/shared/lib/apiError";

type UseRequestPropertyVerificationArgs = {
  propertyId: string;
  serverPending: boolean;
  onAfterRequest?: () => Promise<void>;
};

type UseRequestPropertyVerificationResult = {
  isPending: boolean;
  isSubmitting: boolean;
  error: string | null;
  requestVerification: () => Promise<void>;
};

export function useRequestPropertyVerification({
  propertyId,
  serverPending,
  onAfterRequest,
}: UseRequestPropertyVerificationArgs): UseRequestPropertyVerificationResult {
  const [optimisticPending, setOptimisticPending] = useState(false);
  const [hadServerPending, setHadServerPending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOptimisticPending(false);
    setHadServerPending(false);
    setError(null);
  }, [propertyId]);

  useEffect(() => {
    if (serverPending) {
      setHadServerPending(true);
      setOptimisticPending(false);
    } else if (hadServerPending) {
      setOptimisticPending(false);
    }
  }, [serverPending, hadServerPending]);

  const isPending = serverPending || optimisticPending;

  const requestVerification = useCallback(async () => {
    if (isPending || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await requestPropertyVerification(propertyId);
      setOptimisticPending(true);
      showFeedbackSnackbar({
        kind: "success",
        message: PROPERTY_VERIFICATION_REQUEST_COPY.requestSuccess,
      });
      if (onAfterRequest) {
        await onAfterRequest();
      }
    } catch (caught) {
      if (caught instanceof ApiError && caught.statusCode === 409) {
        setOptimisticPending(true);
        setError(PROPERTY_VERIFICATION_REQUEST_ERROR.duplicate);
        return;
      }
      const message =
        caught instanceof Error
          ? caught.message
          : PROPERTY_VERIFICATION_REQUEST_ERROR.generic;
      setError(message);
      showFeedbackSnackbar({ kind: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  }, [isPending, isSubmitting, onAfterRequest, propertyId]);

  return {
    isPending,
    isSubmitting,
    error,
    requestVerification,
  };
}
