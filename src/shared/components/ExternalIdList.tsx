"use client";

import { ChevronDown, Plus, X } from "lucide-react";
import { useState } from "react";
import type {
  ExternalIdFormRow,
  ExternalIdPlatform,
} from "@/features/properties/addPropertyFormState";
import {
  addPropertyInputClassName,
  addPropertySelectClassName,
} from "@/widgets/AddProperty/addPropertyFormFields";
import { NativeSelectSurface } from "@/shared/ui/NativeSelectSurface";

type ExternalIdListProps = {
  ids: ExternalIdFormRow[];
  onChange: (nextIds: ExternalIdFormRow[]) => void;
};

const platformOptions: Array<{ value: ExternalIdPlatform; label: string }> = [
  { value: "MYHOME", label: "MyHome" },
  { value: "SSGE", label: "SS.ge" },
];

function newLocalId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function todayIsoDate(): string {
  return new Date().toISOString();
}

function displayDate(value: string): string {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }
  return parsedDate.toLocaleDateString("en-GB");
}

export function ExternalIdList({ ids, onChange }: ExternalIdListProps) {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const activeIds = ids.filter((externalId) => externalId.archivedAt === null);
  const archivedIds = ids.filter((externalId) => externalId.archivedAt !== null);

  function handleAddId(platform: ExternalIdPlatform) {
    onChange([
      ...ids,
      {
        localId: newLocalId(),
        platform,
        value: "",
        enteredAt: todayIsoDate(),
        archivedAt: null,
      },
    ]);
  }

  function handleUpdateId(localId: string, patch: Partial<ExternalIdFormRow>) {
    onChange(
      ids.map((externalId) =>
        externalId.localId === localId ? { ...externalId, ...patch } : externalId,
      ),
    );
  }

  function handleArchiveId(localId: string) {
    handleUpdateId(localId, { archivedAt: todayIsoDate() });
  }

  function handleRemoveId(localId: string) {
    onChange(ids.filter((externalId) => externalId.localId !== localId));
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">External IDs</h3>
          <p className="text-xs text-slate-500">MyHome and SS.ge IDs with upload dates.</p>
        </div>
        <div className="flex gap-2">
          {platformOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleAddId(option.value)}
              className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {activeIds.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-xs text-slate-500">
            No external IDs added yet.
          </p>
        ) : (
          activeIds.map((externalId) => (
            <div key={externalId.localId} className="grid gap-2 sm:grid-cols-[9rem_1fr_7rem_2rem]">
              <NativeSelectSurface>
                <select
                  value={externalId.platform}
                  onChange={(event) =>
                    handleUpdateId(externalId.localId, {
                      platform: event.target.value as ExternalIdPlatform,
                    })
                  }
                  className={addPropertySelectClassName()}
                >
                  {platformOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </NativeSelectSurface>
              <input
                value={externalId.value}
                onChange={(event) =>
                  handleUpdateId(externalId.localId, { value: event.target.value })
                }
                className={addPropertyInputClassName()}
                placeholder="ID number"
              />
              <input
                value={displayDate(externalId.enteredAt)}
                readOnly
                className={`${addPropertyInputClassName()} cursor-default bg-white text-xs text-slate-500`}
              />
              <button
                type="button"
                onClick={() => handleArchiveId(externalId.localId)}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:text-red-600"
                aria-label="Archive external ID"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))
        )}
      </div>

      {archivedIds.length > 0 ? (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setIsArchiveOpen((isOpen) => !isOpen)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600"
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition ${isArchiveOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
            Old IDs
          </button>
          {isArchiveOpen ? (
            <div className="space-y-2">
              {archivedIds.map((externalId) => (
                <div
                  key={externalId.localId}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
                >
                  <span>
                    {externalId.platform}: {externalId.value} ({displayDate(externalId.enteredAt)})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveId(externalId.localId)}
                    className="font-semibold text-slate-400 transition hover:text-red-600"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
