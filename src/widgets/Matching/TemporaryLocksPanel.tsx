"use client";

import type { TemporaryLockKey } from "@/features/matching/matchingEnums";
import { TEMPORARY_LOCK_LABELS } from "@/features/matching/criterionLabels";

type TemporaryLocksPanelProps = {
  availableKeys: readonly TemporaryLockKey[];
  selectedKeys: TemporaryLockKey[];
  onChange: (nextKeys: TemporaryLockKey[]) => void;
};

export function TemporaryLocksPanel({
  availableKeys,
  selectedKeys,
  onChange,
}: TemporaryLocksPanelProps) {
  function toggleKey(lockKey: TemporaryLockKey) {
    if (selectedKeys.includes(lockKey)) {
      onChange(selectedKeys.filter((currentKey) => currentKey !== lockKey));
      return;
    }
    onChange([...selectedKeys, lockKey]);
  }

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-sm font-semibold text-slate-800">Temporary hard locks</h2>
      <p className="mt-1 text-xs text-slate-500">
        Session-only. These are not saved on the client or property.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {availableKeys.map((lockKey) => {
          const isSelected = selectedKeys.includes(lockKey);
          return (
            <label
              key={lockKey}
              className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleKey(lockKey)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900"
              />
              <span>{TEMPORARY_LOCK_LABELS[lockKey]}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
