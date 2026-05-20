"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchDistricts } from "@/features/districts/districtsApi";
import type { DistrictsResponse } from "@/features/districts/districtTypes";

let cachedDistricts: DistrictsResponse | null = null;
let districtsRequest: Promise<DistrictsResponse> | null = null;

function ensureDistricts(): Promise<DistrictsResponse> {
  if (cachedDistricts !== null) {
    return Promise.resolve(cachedDistricts);
  }

  if (districtsRequest === null) {
    districtsRequest = fetchDistricts()
      .then((nextDistricts) => {
        cachedDistricts = nextDistricts;
        return nextDistricts;
      })
      .finally(() => {
        districtsRequest = null;
      });
  }

  return districtsRequest;
}

export function useDistricts() {
  const mountedRef = useRef(true);
  const [districts, setDistricts] = useState<DistrictsResponse | null>(
    cachedDistricts,
  );
  const [isLoading, setIsLoading] = useState(cachedDistricts === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadDistricts = useCallback(async () => {
    if (cachedDistricts !== null) {
      setDistricts(cachedDistricts);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextDistricts = await ensureDistricts();
      if (!mountedRef.current) return;
      setDistricts(nextDistricts);
    } catch (requestError: unknown) {
      if (!mountedRef.current) return;
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load districts.",
      );
    } finally {
      if (!mountedRef.current) return;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cachedDistricts !== null) {
      return;
    }

    void loadDistricts();
  }, [loadDistricts]);

  const retry = useCallback(() => {
    void loadDistricts();
  }, [loadDistricts]);

  return {
    districts,
    isLoading,
    error,
    retry,
  };
}
