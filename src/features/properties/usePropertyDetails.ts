"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { hasActiveAdminPrivileges } from "@/features/adminMode/effectiveAccessViewer";
import { useAdminModeStore } from "@/features/adminMode/adminModeStore";
import {
  archivedDetailAccessMessage,
  remembersArchiveDetailAccess,
} from "@/features/lifecycle/archiveDetailAccess";
import { isOpenedFromArchiveLocation } from "@/features/lifecycle/archiveNavigation";
import { getPropertyById } from "@/features/properties/api";
import type { Property } from "@/features/properties/types";
import { ApiError } from "@/shared/lib/apiError";
import { useUserStore } from "@/shared/stores/userStore";

type UsePropertyDetailsResult = {
  property: Property | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<Property | null>;
  applyNoteLastOpenedAt: (openedAt: string | null) => void;
};

type PropertyDetailResult =
  | { status: "empty" }
  | {
      status: "ready";
      propertyId: string;
      property: Property | null;
      message: string | null;
      archiveContext: boolean;
    };

export function usePropertyDetails(
  propertyId: string | null | undefined,
): UsePropertyDetailsResult {
  const [property, setProperty] = useState<Property | null>(null);
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
    if (remembersArchiveDetailAccess(property) || archiveAccessRef.current) {
      archiveAccessRef.current = true;
      setProperty(null);
      setError(null);
      setIsLoading(true);
    }
  }

  const applyNoteLastOpenedAt = useCallback((openedAt: string | null) => {
    setProperty((previous) => {
      if (!previous || previous.noteLastOpenedAt === undefined) {
        return previous;
      }
      return { ...previous, noteLastOpenedAt: openedAt };
    });
  }, []);

  const applyPropertyResult = useCallback((result: PropertyDetailResult): Property | null => {
    if (result.status === "empty") {
      setProperty(null);
      setError(null);
      archiveAccessRef.current = false;
      loadedRecordIdRef.current = null;
      return null;
    }

    loadedRecordIdRef.current = result.propertyId;
    archiveAccessRef.current = result.archiveContext;
    setProperty(result.property);
    setError(result.message);
    return result.property;
  }, []);

  const requestProperty = useCallback(async (): Promise<PropertyDetailResult> => {
    if (!propertyId) {
      return { status: "empty" };
    }

    const recordChanged = loadedRecordIdRef.current !== propertyId;
    const archiveContext = recordChanged
      ? isOpenedFromArchiveLocation()
      : archiveAccessRef.current || isOpenedFromArchiveLocation();

    try {
      const nextProperty = await getPropertyById(propertyId, {
        adminMode: requestAdminMode,
      });
      if (!nextProperty) {
        return {
          status: "ready",
          propertyId,
          property: null,
          message: archivedDetailAccessMessage(
            404,
            archiveContext,
            "განცხადება ვერ მოიძებნა.",
          ),
          archiveContext,
        };
      }
      return {
        status: "ready",
        propertyId,
        property: nextProperty,
        message: null,
        archiveContext: remembersArchiveDetailAccess(nextProperty),
      };
    } catch (error) {
      const statusCode = error instanceof ApiError ? error.statusCode : 0;
      const fallbackMessage =
        error instanceof Error
          ? error.message
          : "განცხადების დეტალების ჩატვირთვა ვერ მოხერხდა.";
      const hideRecord = statusCode === 404 && archiveContext;
      return {
        status: "ready",
        propertyId,
        property: null,
        message: archivedDetailAccessMessage(statusCode, archiveContext, fallbackMessage),
        archiveContext: hideRecord ? true : archiveContext,
      };
    }
  }, [propertyId, requestAdminMode]);

  const refetch = useCallback(async (): Promise<Property | null> => {
    const generation = applyGenerationRef.current + 1;
    applyGenerationRef.current = generation;
    const result = await requestProperty();
    if (applyGenerationRef.current !== generation) {
      return null;
    }
    return applyPropertyResult(result);
  }, [applyPropertyResult, requestProperty]);

  useEffect(() => {
    const generation = applyGenerationRef.current + 1;
    applyGenerationRef.current = generation;
    let cancelled = false;

    const runLoad = async () => {
      setIsLoading(true);
      setError(null);
      const result = await requestProperty();
      if (cancelled || applyGenerationRef.current !== generation) {
        return;
      }
      applyPropertyResult(result);
      setIsLoading(false);
    };

    void runLoad();

    return () => {
      cancelled = true;
    };
  }, [applyPropertyResult, requestProperty]);

  return { property, isLoading, error, refetch, applyNoteLastOpenedAt };
}
