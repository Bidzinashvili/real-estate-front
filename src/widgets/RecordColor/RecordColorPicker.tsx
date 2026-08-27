"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Palette } from "lucide-react";
import { RECORD_COLOR_LABELS, type RecordColor } from "@/features/recordColor/recordColor";
import { cn } from "@/shared/lib/utils";
import { RecordColorSwatches } from "@/widgets/RecordColor/RecordColorSwatches";

const POPOVER_WIDTH_PX = 196;
const VIEWPORT_PADDING_PX = 8;

type RecordColorPickerProps = {
  value: RecordColor;
  disabled?: boolean;
  align?: "left" | "right";
  triggerClassName?: string;
  onSelect: (color: RecordColor) => void;
};

type PopoverPosition = {
  top: number;
  left: number;
};

function resolvePopoverPosition(
  triggerRect: DOMRect,
  align: "left" | "right",
): PopoverPosition {
  const estimatedHeight = 88;
  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const openUpward = spaceBelow < estimatedHeight + VIEWPORT_PADDING_PX;
  const top = openUpward
    ? Math.max(VIEWPORT_PADDING_PX, triggerRect.top - estimatedHeight - 4)
    : triggerRect.bottom + 4;

  const preferredLeft =
    align === "right" ? triggerRect.right - POPOVER_WIDTH_PX : triggerRect.left;
  const maxLeft = window.innerWidth - POPOVER_WIDTH_PX - VIEWPORT_PADDING_PX;
  const left = Math.min(
    Math.max(VIEWPORT_PADDING_PX, preferredLeft),
    Math.max(VIEWPORT_PADDING_PX, maxLeft),
  );

  return { top, left };
}

export function RecordColorPicker({
  value,
  disabled = false,
  align = "right",
  triggerClassName,
  onSelect,
}: RecordColorPickerProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const selectedLabel = RECORD_COLOR_LABELS[value];

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) {
      return;
    }

    function updatePosition() {
      const triggerNode = triggerRef.current;
      if (!triggerNode) {
        return;
      }
      setPosition(resolvePopoverPosition(triggerNode.getBoundingClientRect(), align));
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [align, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const targetNode = event.target as Node;
      if (triggerRef.current?.contains(targetNode)) {
        return;
      }
      if (popoverRef.current?.contains(targetNode)) {
        return;
      }
      setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  function stopOverlayEvent(event: React.SyntheticEvent) {
    event.stopPropagation();
  }

  return (
    <div
      className="relative"
      onClick={stopOverlayEvent}
      onMouseDown={stopOverlayEvent}
      onPointerDown={stopOverlayEvent}
    >
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`ფერი: ${selectedLabel}`}
        title={`ფერი: ${selectedLabel}`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (disabled) {
            return;
          }
          setIsOpen((previousOpen) => !previousOpen);
        }}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60",
          triggerClassName,
        )}
      >
        <Palette className="h-3.5 w-3.5" aria-hidden />
      </button>
      {isOpen && position && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={popoverRef}
              className="fixed z-[80] rounded-xl border border-border bg-card p-2 shadow-lg ring-1 ring-border/60"
              style={{ top: position.top, left: position.left }}
              onClick={stopOverlayEvent}
              onMouseDown={stopOverlayEvent}
            >
              <RecordColorSwatches
                value={value}
                disabled={disabled}
                onSelect={(color) => {
                  setIsOpen(false);
                  onSelect(color);
                }}
              />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
