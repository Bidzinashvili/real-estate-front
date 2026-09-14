"use client";

import { useEffect } from "react";

export const CLIENT_HIDDEN_PROPERTIES_CHANGED_EVENT = "client-hidden-properties:changed";

export type ClientHiddenPropertiesChangedDetail = {
  clientId: string;
};

export function emitClientHiddenPropertiesChanged(clientId: string): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(
    new CustomEvent<ClientHiddenPropertiesChangedDetail>(CLIENT_HIDDEN_PROPERTIES_CHANGED_EVENT, {
      detail: { clientId },
    }),
  );
}

export function useClientHiddenPropertiesChangedListener(
  clientId: string,
  onChanged: () => void,
): void {
  useEffect(() => {
    const handleChanged = (event: Event) => {
      const customEvent = event as CustomEvent<ClientHiddenPropertiesChangedDetail>;
      if (customEvent.detail?.clientId !== clientId) {
        return;
      }
      onChanged();
    };
    window.addEventListener(CLIENT_HIDDEN_PROPERTIES_CHANGED_EVENT, handleChanged);
    return () => {
      window.removeEventListener(CLIENT_HIDDEN_PROPERTIES_CHANGED_EVENT, handleChanged);
    };
  }, [clientId, onChanged]);
}
