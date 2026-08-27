"use client";

import { useEffect, useMemo, useState } from "react";
import { isPrivacySafeSharedClient } from "@/features/databaseList/viewerOwnership";
import { HIDDEN_PROPERTY_COPY } from "@/features/clientHiddenProperties/hiddenPropertyCopy";
import { useClientHiddenProperties } from "@/features/clientHiddenProperties/useClientHiddenProperties";
import { useUnhideClientProperty } from "@/features/clientHiddenProperties/useUnhideClientProperty";
import { HiddenPropertyCard } from "@/widgets/ClientHiddenProperties/HiddenPropertyCard";

type HiddenSectionClient = {
  id: string;
  ownedByViewer: boolean | null;
  name: string;
};

type ClientHiddenPropertiesSectionProps = {
  client: HiddenSectionClient;
  canManage: boolean;
};

export function ClientHiddenPropertiesSection({
  client,
  canManage,
}: ClientHiddenPropertiesSectionProps) {
  const isPrivacySafe = isPrivacySafeSharedClient(client);
  const { hiddenProperties, isLoading, error } = useClientHiddenProperties({
    clientId: client.id,
    enabled: !isPrivacySafe,
  });
  const { unhideProperty, isPropertyPending } = useUnhideClientProperty(client.id);
  const [locallyRestoredIds, setLocallyRestoredIds] = useState<string[]>([]);

  useEffect(() => {
    setLocallyRestoredIds([]);
  }, [client.id]);

  useEffect(() => {
    const presentIds = new Set(hiddenProperties.map((item) => item.id));
    setLocallyRestoredIds((currentIds) =>
      currentIds.filter((propertyId) => presentIds.has(propertyId)),
    );
  }, [hiddenProperties]);

  const visibleHiddenProperties = useMemo(
    () => hiddenProperties.filter((item) => !locallyRestoredIds.includes(item.id)),
    [hiddenProperties, locallyRestoredIds],
  );

  async function handleRestore(propertyId: string) {
    setLocallyRestoredIds((currentIds) =>
      currentIds.includes(propertyId) ? currentIds : [...currentIds, propertyId],
    );
    const didRestore = await unhideProperty(propertyId);
    if (didRestore) {
      return;
    }
    setLocallyRestoredIds((currentIds) =>
      currentIds.filter((restoredId) => restoredId !== propertyId),
    );
  }

  if (isPrivacySafe) {
    return null;
  }

  return (
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h2 className="mb-4 text-base font-semibold text-foreground">
        {HIDDEN_PROPERTY_COPY.sectionTitle}
      </h2>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">{HIDDEN_PROPERTY_COPY.loadingList}</p>
      ) : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {!isLoading && !error && visibleHiddenProperties.length === 0 ? (
        <p className="text-sm text-muted-foreground">{HIDDEN_PROPERTY_COPY.emptyState}</p>
      ) : null}
      {!isLoading && visibleHiddenProperties.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {visibleHiddenProperties.map((item) => (
            <HiddenPropertyCard
              key={item.id}
              item={item}
              canRestore={canManage}
              isRestorePending={isPropertyPending(item.id)}
              onRestore={() => {
                void handleRestore(item.id);
              }}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
