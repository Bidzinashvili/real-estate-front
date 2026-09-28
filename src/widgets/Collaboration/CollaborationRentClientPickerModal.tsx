"use client";

import { useState } from "react";
import { useCollaborationMineClients } from "@/features/collaboration/useCollaborationMineClients";
import { formatSharedClientHeadline } from "@/features/clients/formatSharedClientCriteria";
import { AddClientForm } from "@/widgets/AddClient/AddClientForm";
import type { Client } from "@/features/clients/types";

type CollaborationRentClientPickerModalProps = {
  open: boolean;
  onClose: () => void;
  onClientSelected: (clientId: string) => void;
};

export function CollaborationRentClientPickerModal({
  open,
  onClose,
  onClientSelected,
}: CollaborationRentClientPickerModalProps) {
  const [search, setSearch] = useState("");
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const { clients, isLoading, error } = useCollaborationMineClients({
    enabled: open && !isCreatingClient,
    search,
  });

  if (!open) {
    return null;
  }

  function resetAndClose() {
    setSearch("");
    setIsCreatingClient(false);
    onClose();
  }

  function handleClientCreated(created: Client) {
    setIsCreatingClient(false);
    onClientSelected(created.id);
  }

  return (
    <div className="fixed inset-0 z-[85] flex items-start justify-center overflow-y-auto bg-primary/40 px-4 py-8 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="collaboration-client-picker-title"
        className="w-full max-w-lg rounded-2xl bg-card p-5 shadow-lg ring-1 ring-border"
      >
        {isCreatingClient ? (
          <div className="max-h-[min(80vh,40rem)] overflow-y-auto">
            <AddClientForm
              embedded
              onClientCreated={handleClientCreated}
              onCancelEmbedded={() => setIsCreatingClient(false)}
            />
          </div>
        ) : (
          <>
            <h2
              id="collaboration-client-picker-title"
              className="text-base font-semibold text-foreground"
            >
              რომელი კლიენტისთვის გინდა თანამშრომლობა?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              აირჩიეთ თქვენი კლიენტი ან დაამატეთ ახალი.
            </p>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="კლიენტის ძიება…"
              className="mt-4 h-9 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />

            {isLoading ? (
              <p className="mt-3 text-xs text-muted-foreground">კლიენტები იტვირთება…</p>
            ) : null}
            {error ? (
              <p className="mt-3 text-xs text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            {!isLoading && !error ? (
              <ul className="mt-3 max-h-52 overflow-y-auto rounded-xl border border-border">
                {clients.length === 0 ? (
                  <li className="px-3 py-2 text-xs text-muted-foreground">
                    კლიენტები ვერ მოიძებნა.
                  </li>
                ) : (
                  clients.map((clientRecord) => (
                    <li key={clientRecord.id}>
                      <button
                        type="button"
                        onClick={() => onClientSelected(clientRecord.id)}
                        className="flex w-full flex-col px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                      >
                        <span className="font-medium">
                          {clientRecord.name.trim() || formatSharedClientHeadline(clientRecord)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {(clientRecord.districts ?? []).slice(0, 3).join(", ") || "—"}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            ) : null}

            <button
              type="button"
              onClick={() => setIsCreatingClient(true)}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-dashed border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              + ახალი კლიენტის დამატება
            </button>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={resetAndClose}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
              >
                გაუქმება
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
