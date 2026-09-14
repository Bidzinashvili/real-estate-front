"use client";

import { useEffect } from "react";
import { recordsChangedEventName } from "@/features/lifecycle/recordsChangedEvent";

export function useRecordsChangedListener(
  onChanged: () => void | Promise<void>,
): void {
  useEffect(() => {
    const handleRecordsChanged = () => {
      onChanged();
    };
    window.addEventListener(recordsChangedEventName, handleRecordsChanged);
    return () => {
      window.removeEventListener(recordsChangedEventName, handleRecordsChanged);
    };
  }, [onChanged]);
}
