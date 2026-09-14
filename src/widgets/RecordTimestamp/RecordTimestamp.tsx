"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  formatTbilisiCompactDate,
  formatTbilisiDateTime,
} from "@/shared/lib/formatDate";
import { cn } from "@/shared/lib/utils";

const POPOVER_WIDTH_PX = 240;
const VIEWPORT_PADDING_PX = 8;

type RecordTimestampProps = {
  createdAt: string | null | undefined;
  updatedAt: string | null | undefined;
  className?: string;
};

type PopoverPosition = {
  top: number;
  left: number;
};

function resolvePopoverPosition(triggerRect: DOMRect): PopoverPosition {
  const estimatedHeight = 88;
  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const openUpward = spaceBelow < estimatedHeight + VIEWPORT_PADDING_PX;
  const top = openUpward
    ? Math.max(VIEWPORT_PADDING_PX, triggerRect.top - estimatedHeight - 4)
    : triggerRect.bottom + 4;
  const maxLeft = window.innerWidth - POPOVER_WIDTH_PX - VIEWPORT_PADDING_PX;
  const left = Math.min(
    Math.max(VIEWPORT_PADDING_PX, triggerRect.left),
    Math.max(VIEWPORT_PADDING_PX, maxLeft),
  );
  return { top, left };
}

export function RecordTimestamp({
  createdAt,
  updatedAt,
  className,
}: RecordTimestampProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<PopoverPosition | null>(null);

  const compactUpdated = updatedAt ? formatTbilisiCompactDate(updatedAt) : null;
  const expandedUpdated = updatedAt ? formatTbilisiDateTime(updatedAt) : null;
  const expandedCreated = createdAt ? formatTbilisiDateTime(createdAt) : null;

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) {
      return;
    }

    function updatePosition() {
      const triggerNode = triggerRef.current;
      if (!triggerNode) {
        return;
      }
      setPosition(resolvePopoverPosition(triggerNode.getBoundingClientRect()));
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const targetNode = event.target as Node;
      if (triggerRef.current?.contains(targetNode)) {
        return;
      }
      if (popoverRef.current?.contains(targetNode)) {
        return;
      }
      setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!compactUpdated) {
    return null;
  }

  function stopOverlayEvent(event: React.SyntheticEvent) {
    event.stopPropagation();
  }

  const lastEditedLabel = `ბოლო რედაქტირება: ${compactUpdated}`;

  return (
    <div
      className={cn("relative", className)}
      onClick={stopOverlayEvent}
      onMouseDown={stopOverlayEvent}
      onPointerDown={stopOverlayEvent}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`${lastEditedLabel}. შექმნის თარიღის სანახავად დააჭირეთ.`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsOpen((previousOpen) => !previousOpen);
        }}
        className="touch-manipulation max-w-full text-left text-xs text-muted-foreground underline-offset-2 transition hover:text-foreground hover:underline"
      >
        {lastEditedLabel}
      </button>
      {isOpen && position && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={popoverRef}
              role="dialog"
              aria-label="ჩანაწერის თარიღები"
              className="fixed z-[80] w-[240px] rounded-xl border border-border bg-card px-3 py-2.5 text-xs shadow-lg ring-1 ring-border/60"
              style={{ top: position.top, left: position.left }}
              onClick={stopOverlayEvent}
              onMouseDown={stopOverlayEvent}
              onPointerDown={stopOverlayEvent}
            >
              <p className="text-foreground">
                ბოლო რედაქტირება: {expandedUpdated ?? compactUpdated}
              </p>
              {expandedCreated ? (
                <p className="mt-1.5 text-muted-foreground">
                  შექმნილია: {expandedCreated}
                </p>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
