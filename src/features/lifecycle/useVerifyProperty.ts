"use client";

import { useEffect, useState } from "react";
import { PROPERTY_VERIFICATION_COPY } from "@/features/lifecycle/propertyVerification";
import { verifyProperty } from "@/features/properties/api";

const VERIFY_SUCCESS_VISIBLE_MS = 4000;

type UseVerifyPropertyResult = {
  isVerifying: boolean;
  error: string | null;
  successMessage: string | null;
  verifyListing: (propertyId: string) => Promise<boolean>;
};

export function useVerifyProperty(): UseVerifyPropertyResult {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!successMessage) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setSuccessMessage(null);
    }, VERIFY_SUCCESS_VISIBLE_MS);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [successMessage]);

  async function verifyListing(propertyId: string): Promise<boolean> {
    setIsVerifying(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await verifyProperty(propertyId);
      setSuccessMessage(PROPERTY_VERIFICATION_COPY.verifySuccess);
      return true;
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : PROPERTY_VERIFICATION_COPY.verifyError;
      setError(message);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }

  return { isVerifying, error, successMessage, verifyListing };
}
