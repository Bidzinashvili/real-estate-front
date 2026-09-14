"use client";

import { useEffect, useState } from "react";
import { lookupPropertyOwnerByPhone } from "@/features/propertyOwners/api";
import { lookupPhoneQueryValue } from "@/features/propertyOwners/phoneLike";
import { PROPERTY_OWNERS_SEARCH_DEBOUNCE_MS } from "@/features/propertyOwners/getPropertyOwnersQuery";
import type { PropertyOwnerLookupResult } from "@/features/propertyOwners/types";

type UseLookupPropertyOwnerResult = {
  result: PropertyOwnerLookupResult | null;
  isLookingUp: boolean;
  error: string | null;
};

export function useLookupPropertyOwner(
  phone: string,
): UseLookupPropertyOwnerResult {
  const [debouncedPhone, setDebouncedPhone] = useState(phone);
  const [result, setResult] = useState<PropertyOwnerLookupResult | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedPhone(phone);
    }, PROPERTY_OWNERS_SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [phone]);

  useEffect(() => {
    const queryPhone = lookupPhoneQueryValue(debouncedPhone);
    if (!queryPhone) {
      setResult(null);
      setIsLookingUp(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const runLookup = async () => {
      setIsLookingUp(true);
      setError(null);
      try {
        const lookupResult = await lookupPropertyOwnerByPhone(queryPhone, {
          signal: controller.signal,
        });
        if (!cancelled) {
          setResult(lookupResult);
        }
      } catch (lookupError) {
        if (cancelled) {
          return;
        }
        const message =
          lookupError instanceof Error
            ? lookupError.message
            : "მეპატრონის ძებნა ვერ მოხერხდა.";
        setError(message);
        setResult(null);
      } finally {
        if (!cancelled) {
          setIsLookingUp(false);
        }
      }
    };

    void runLookup();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [debouncedPhone]);

  return { result, isLookingUp, error };
}
