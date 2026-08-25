"use client";

import { useCallback, useEffect, useState } from "react";
import { getClientProfileById } from "@/features/clientProfiles/api";
import type { ClientProfile } from "@/features/clientProfiles/types";
import { ApiError } from "@/shared/lib/apiError";

type UseClientProfileDetailsResult = {
  profile: ClientProfile | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  refetch: () => Promise<void>;
};

export function useClientProfileDetails(
  profileId: string,
): UseClientProfileDetailsResult {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const refetch = useCallback(async () => {
    if (!profileId) {
      return;
    }
    try {
      const result = await getClientProfileById(profileId);
      setProfile(result);
      setError(null);
      setStatusCode(null);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "კლიენტის პროფილის ჩატვირთვა ვერ მოხერხდა.";
      setError(message);
      setStatusCode(loadError instanceof ApiError ? loadError.statusCode : 500);
      setProfile(null);
    }
  }, [profileId]);

  useEffect(() => {
    if (!profileId) {
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      setStatusCode(null);

      try {
        const result = await getClientProfileById(profileId);
        if (!cancelled) {
          setProfile(result);
        }
      } catch (loadError) {
        if (!cancelled) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : "კლიენტის პროფილის ჩატვირთვა ვერ მოხერხდა.";
          setError(message);
          setStatusCode(
            loadError instanceof ApiError ? loadError.statusCode : 500,
          );
          setProfile(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [profileId]);

  return { profile, isLoading, error, statusCode, refetch };
}
