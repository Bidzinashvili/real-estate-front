"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { hasActiveAdminPrivileges } from "@/features/adminMode/effectiveAccessViewer";
import { useAdminModeStore } from "@/features/adminMode/adminModeStore";
import { getClientById } from "@/features/clients/api";
import type { ClientDetail } from "@/features/clients/types";
import {
  readClientDetailFailure,
  remembersArchiveDetailAccess,
} from "@/features/lifecycle/archiveDetailAccess";
import { isOpenedFromArchiveLocation } from "@/features/lifecycle/archiveNavigation";
import { useUserStore } from "@/shared/stores/userStore";

type UseClientDetailsResult = {
  client: ClientDetail | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  applyNoteLastOpenedAt: (openedAt: string | null) => void;
};

type ClientDetailResult =
  | {
      status: "ready";
      clientId: string;
      client: ClientDetail;
      archiveContext: boolean;
    }
  | {
      status: "failed";
      clientId: string;
      message: string;
      hideRecord: boolean;
      archiveContext: boolean;
    };

export function useClientDetails(clientId: string): UseClientDetailsResult {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);
  const isAdminMode = useAdminModeStore((state) => state.isAdminMode);
  const requestAdminMode = hasActiveAdminPrivileges(user, isAdminMode);
  const [trackedAdminMode, setTrackedAdminMode] = useState(requestAdminMode);
  const archiveAccessRef = useRef(false);
  const loadedRecordIdRef = useRef<string | null>(null);
  const applyGenerationRef = useRef(0);

  if (trackedAdminMode !== requestAdminMode) {
    setTrackedAdminMode(requestAdminMode);
    if (remembersArchiveDetailAccess(client) || archiveAccessRef.current) {
      archiveAccessRef.current = true;
      setClient(null);
      setError(null);
      setIsLoading(true);
    }
  }

  const applyNoteLastOpenedAt = useCallback((openedAt: string | null) => {
    setClient((previous) => {
      if (!previous || previous.noteLastOpenedAt === undefined) {
        return previous;
      }
      return { ...previous, noteLastOpenedAt: openedAt };
    });
  }, []);

  const applyClientResult = useCallback((result: ClientDetailResult) => {
    loadedRecordIdRef.current = result.clientId;
    if (result.status === "ready") {
      archiveAccessRef.current = result.archiveContext;
      setClient(result.client);
      setError(null);
      return;
    }
    archiveAccessRef.current = result.hideRecord ? true : result.archiveContext;
    if (result.hideRecord) {
      setClient(null);
    }
    setError(result.message);
  }, []);

  const requestClient = useCallback(async (): Promise<ClientDetailResult> => {
    const recordChanged = loadedRecordIdRef.current !== clientId;
    const archiveContext = recordChanged
      ? isOpenedFromArchiveLocation()
      : archiveAccessRef.current || isOpenedFromArchiveLocation();

    try {
      const result = await getClientById(clientId, {
        adminMode: requestAdminMode,
      });
      return {
        status: "ready",
        clientId,
        client: result,
        archiveContext: remembersArchiveDetailAccess(result),
      };
    } catch (error) {
      const failure = readClientDetailFailure(error, archiveContext);
      return {
        status: "failed",
        clientId,
        message: failure.message,
        hideRecord: failure.hideRecord,
        archiveContext,
      };
    }
  }, [clientId, requestAdminMode]);

  const refetch = useCallback(async () => {
    if (!clientId) return;
    const generation = applyGenerationRef.current + 1;
    applyGenerationRef.current = generation;
    const result = await requestClient();
    if (applyGenerationRef.current !== generation) {
      return;
    }
    applyClientResult(result);
  }, [applyClientResult, clientId, requestClient]);

  useEffect(() => {
    if (!clientId) return;

    const generation = applyGenerationRef.current + 1;
    applyGenerationRef.current = generation;
    let cancelled = false;

    const runLoad = async () => {
      setIsLoading(true);
      setError(null);
      const result = await requestClient();
      if (cancelled || applyGenerationRef.current !== generation) {
        return;
      }
      applyClientResult(result);
      setIsLoading(false);
    };

    void runLoad();

    return () => {
      cancelled = true;
    };
  }, [applyClientResult, clientId, requestClient]);

  return { client, isLoading, error, refetch, applyNoteLastOpenedAt };
}
