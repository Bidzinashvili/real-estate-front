"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Camera, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { resolveApiMediaUrl } from "@/features/properties/resolveApiMediaUrl";

const SWIPE_THRESHOLD_PX = 40;

type ImageItem = { url: string; originalName: string };

type PropertyCardImageCarouselProps = {
  propertyId: string;
  images: ImageItem[];
  apiBaseUrl: string | null;
  alt: string;
};

export function PropertyCardImageCarousel({
  propertyId,
  images,
  apiBaseUrl,
  alt,
}: PropertyCardImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const pointerStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const imageSignature = images.map((image) => image.url).join("|");

  useEffect(() => {
    setIndex(0);
  }, [propertyId, imageSignature]);

  const resolved =
    images.length > 0
      ? images
          .map((image) => resolveApiMediaUrl(image.url, apiBaseUrl))
          .filter((imageUrl) => imageUrl !== "")
      : [];

  const activeIndex =
    resolved.length > 0
      ? ((index % resolved.length) + resolved.length) % resolved.length
      : 0;
  const src = resolved.length > 0 ? resolved[activeIndex]! : "";
  const canNavigate = resolved.length > 1;
  const photoCountLabel =
    resolved.length > 0 ? `${activeIndex + 1} / ${resolved.length}` : null;

  function goToOffset(offset: number) {
    if (!canNavigate) return;
    setIndex((currentIndex) => (currentIndex + offset + resolved.length) % resolved.length);
  }

  function stopCardOpen(event: { stopPropagation: () => void; preventDefault: () => void }) {
    event.stopPropagation();
    event.preventDefault();
  }

  const goPrev = (event: { stopPropagation: () => void; preventDefault: () => void }) => {
    stopCardOpen(event);
    goToOffset(-1);
  };

  const goNext = (event: { stopPropagation: () => void; preventDefault: () => void }) => {
    stopCardOpen(event);
    goToOffset(1);
  };

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!canNavigate) return;
    const eventTarget = event.target;
    if (eventTarget instanceof HTMLElement && eventTarget.closest("button")) {
      pointerStartX.current = null;
      return;
    }
    pointerStartX.current = event.clientX;
    didSwipe.current = false;
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!canNavigate || pointerStartX.current === null) {
      pointerStartX.current = null;
      return;
    }
    const deltaX = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) {
      return;
    }
    didSwipe.current = true;
    stopCardOpen(event);
    if (deltaX > 0) {
      goToOffset(-1);
    } else {
      goToOffset(1);
    }
  }

  function handleClick(event: { stopPropagation: () => void; preventDefault: () => void }) {
    if (!didSwipe.current) {
      return;
    }
    stopCardOpen(event);
    didSwipe.current = false;
  }

  return (
    <div
      className="relative h-full w-full"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" draggable={false} />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-muted text-muted-foreground">
          <ImageOff className="h-7 w-7" aria-hidden />
          <span className="text-xs font-medium">ფოტო არ არის</span>
        </div>
      )}

      {photoCountLabel ? (
        <span className="pointer-events-none absolute bottom-2 right-2 z-10 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-[2px]">
          <Camera className="h-3 w-3" aria-hidden />
          {photoCountLabel}
        </span>
      ) : null}

      {canNavigate && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-sm backdrop-blur-[2px] transition hover:bg-black/55"
            aria-label="წინა ფოტო"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-sm backdrop-blur-[2px] transition hover:bg-black/55"
            aria-label="შემდეგი ფოტო"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
          <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            {resolved.map((imageUrl, dotIndex) => (
              <button
                key={`${propertyId}-${imageUrl}-${dotIndex}`}
                type="button"
                aria-label={`ფოტო ${dotIndex + 1}`}
                aria-current={dotIndex === activeIndex}
                onClick={(event) => {
                  stopCardOpen(event);
                  setIndex(dotIndex);
                }}
                className={`h-1.5 rounded-full transition ${
                  dotIndex === activeIndex ? "w-3 bg-card" : "w-1.5 bg-card/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
