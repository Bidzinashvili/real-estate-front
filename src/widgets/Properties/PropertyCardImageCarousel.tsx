"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveApiMediaUrl } from "@/features/properties/resolveApiMediaUrl";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

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

  useEffect(() => {
    setIndex(0);
  }, [propertyId]);

  const resolved =
    images.length > 0
      ? images.map((img) => resolveApiMediaUrl(img.url, apiBaseUrl)).filter(Boolean)
      : [];

  const activeIndex =
    resolved.length > 0
      ? ((index % resolved.length) + resolved.length) % resolved.length
      : 0;
  const src = resolved.length > 0 ? resolved[activeIndex]! : PLACEHOLDER_IMAGE;
  const canNavigate = resolved.length > 1;

  const goPrev = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!canNavigate) return;
    setIndex((i) => (i - 1 + resolved.length) % resolved.length);
  };

  const goNext = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!canNavigate) return;
    setIndex((i) => (i + 1) % resolved.length);
  };

  return (
    <div className="relative h-full w-full">
      <img src={src} alt={alt} className="h-full w-full object-cover" />

      {canNavigate && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-sm backdrop-blur-[2px] transition hover:bg-black/55"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-sm backdrop-blur-[2px] transition hover:bg-black/55"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            {resolved.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  dotIndex === activeIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
