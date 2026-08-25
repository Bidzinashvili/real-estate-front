"use client";

import { useEffect, useState } from "react";
import { lookupClientProfileByPhone } from "@/features/clientProfiles/api";
import { CLIENT_PROFILES_SEARCH_DEBOUNCE_MS } from "@/features/clientProfiles/getClientProfilesQuery";
import { lookupPhoneQueryValue } from "@/features/clientProfiles/phoneLike";
import type { ClientProfileLookupResult } from "@/features/clientProfiles/types";

export type ClientProfilePhoneLookupEntry = {
  phone: string;
  result: ClientProfileLookupResult;
};

type UseLookupClientProfilesResult = {
  entries: ClientProfilePhoneLookupEntry[];
  isLookingUp: boolean;
  error: string | null;
};

function uniqueLookupPhones(phones: string[]): string[] {
  const seen = new Set<string>();
  const uniquePhones: string[] = [];
  for (const phone of phones) {
    const queryPhone = lookupPhoneQueryValue(phone);
    if (!queryPhone || seen.has(queryPhone)) {
      continue;
    }
    seen.add(queryPhone);
    uniquePhones.push(queryPhone);
  }
  return uniquePhones;
}

export function useLookupClientProfiles(
  phones: string[],
): UseLookupClientProfilesResult {
  const queryKey = uniqueLookupPhones(phones).join("|");
  const [debouncedKey, setDebouncedKey] = useState(queryKey);
  const [entries, setEntries] = useState<ClientProfilePhoneLookupEntry[]>([]);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedKey(queryKey);
    }, CLIENT_PROFILES_SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [queryKey]);

  useEffect(() => {
    const phonesToLookup = debouncedKey
      ? debouncedKey.split("|").filter((phone) => phone !== "")
      : [];

    if (phonesToLookup.length === 0) {
      setEntries([]);
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
        const results = await Promise.all(
          phonesToLookup.map(async (phone) => {
            const result = await lookupClientProfileByPhone(phone, {
              signal: controller.signal,
            });
            return { phone, result };
          }),
        );
        if (!cancelled) {
          setEntries(results);
        }
      } catch (lookupError) {
        if (cancelled) {
          return;
        }
        const message =
          lookupError instanceof Error
            ? lookupError.message
            : "კლიენტის პროფილის ძებნა ვერ მოხერხდა.";
        setError(message);
        setEntries([]);
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
  }, [debouncedKey]);

  return { entries, isLookingUp, error };
}
