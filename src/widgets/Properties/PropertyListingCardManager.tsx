"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import type { Property } from "@/features/properties/types";
import { PropertyListingChangeStatusModal } from "@/widgets/Properties/PropertyListingChangeStatusModal";
import { PropertyListingRemindersModal } from "@/widgets/Properties/PropertyListingRemindersModal";

type PropertyListingCardManagerProps = {
  property: Property;
  onListingChanged: () => void;
  canChangeStatus?: boolean;
  canSetReminders?: boolean;
};

export function PropertyListingCardManager({
  property,
  onListingChanged,
  canChangeStatus = false,
  canSetReminders = false,
}: PropertyListingCardManagerProps) {
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);

  useEffect(() => {
    if (!isActionMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const node = menuContainerRef.current;
      if (!node) return;
      if (node.contains(event.target as Node)) return;
      setIsActionMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isActionMenuOpen]);

  return (
    <>
      <div ref={menuContainerRef} className="absolute right-3 top-3 z-20">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setIsActionMenuOpen((previous) => !previous);
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white shadow-sm backdrop-blur-[2px] transition hover:bg-black/60"
          aria-expanded={isActionMenuOpen}
          aria-haspopup="menu"
          aria-label="Listing actions"
        >
          <MoreVertical className="h-4 w-4" aria-hidden />
        </button>

        {isActionMenuOpen ? (
          <div
            role="menu"
            className="absolute right-0 top-full mt-1 min-w-[11rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-lg ring-1 ring-slate-200/60"
          >
            {canChangeStatus ? (
              <button
                type="button"
                role="menuitem"
                className="flex w-full px-3 py-2 text-left text-slate-800 transition hover:bg-slate-50"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsActionMenuOpen(false);
                  setIsChangeStatusOpen(true);
                }}
              >
                Change status
              </button>
            ) : null}
            {canSetReminders ? (
              <button
                type="button"
                role="menuitem"
                className="flex w-full px-3 py-2 text-left text-slate-800 transition hover:bg-slate-50"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsActionMenuOpen(false);
                  setIsRemindersOpen(true);
                }}
              >
                Set reminders
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {canChangeStatus ? (
        <PropertyListingChangeStatusModal
          open={isChangeStatusOpen}
          property={property}
          onClose={() => setIsChangeStatusOpen(false)}
          onSaved={onListingChanged}
        />
      ) : null}

      {canSetReminders ? (
        <PropertyListingRemindersModal
          open={isRemindersOpen}
          property={property}
          onClose={() => setIsRemindersOpen(false)}
          onScheduled={onListingChanged}
        />
      ) : null}
    </>
  );
}
