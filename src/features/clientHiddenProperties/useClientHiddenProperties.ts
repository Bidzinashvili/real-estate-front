"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getClientHiddenProperties } from "@/features/clientHiddenProperties/api";
import { HIDDEN_PROPERTY_COPY } from "@/features/clientHiddenProperties/hiddenPropertyCopy";
import { useClientHiddenPropertiesChangedListener } from "@/features/clientHiddenProperties/hiddenPropertyEvents";
import type { HiddenPropertyItem } from "@/features/clientHiddenProperties/types";
import { useRecordsChangedListener } from "@/features/lifecycle/useRecordsChangedListener";

type UseClientHiddenPropertiesResult = {
  hiddenProperties: HiddenPropertyItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

type UseClientHiddenPropertiesArgs = {
  clientId: string;
  enabled?: boolean;
};

export function useClientHiddenProperties({
  clientId,
  enabled = true,
}: UseClientHiddenPropertiesArgs): UseClientHiddenPropertiesResult {
  const [hiddenProperties, setHiddenProperties] = useState<HiddenPropertyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTick, setRefetchTick] = useState(0);
  const loadedClientIdRef = useRef<string | null>(null);

  const refetch = useCallback(() => {
    setRefetchTick((previousTick) => previousTick + 1);
  }, []);

  useClientHiddenPropertiesChangedListener(clientId, refetch);
  useRecordsChangedListener(refetch);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const isClientChanged = loadedClientIdRef.current !== clientId;

    const loadHiddenProperties = async () => {
      if (isClientChanged) {
        setIsLoading(true);
        setHiddenProperties([]);
      }
      setError(null);
      try {
        const result = await getClientHiddenProperties(clientId, {
          signal: controller.signal,
        });
        if (!cancelled) {
          loadedClientIdRef.current = clientId;
          setHiddenProperties(result.hiddenProperties);
        }
      } catch (loadError) {
        if (cancelled) {
          return;
        }
        const message =
          loadError instanceof Error ? loadError.message : HIDDEN_PROPERTY_COPY.loadError;
        setError(message);
        if (isClientChanged) {
          setHiddenProperties([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadHiddenProperties();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [clientId, enabled, refetchTick]);

  return { hiddenProperties, isLoading, error, refetch };
}
