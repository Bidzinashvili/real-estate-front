"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import { resolveApiMediaUrl } from "@/features/properties/resolveApiMediaUrl";
import type { PropertyListingImage } from "@/features/properties/types";

type PreparedImage = {
  src: string;
  label: string;
};

type PropertyViewGalleryProps = {
  images: PropertyListingImage[];
  apiBaseUrl: string | null;
};

export function PropertyViewGallery({ images, apiBaseUrl }: PropertyViewGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleItems = useMemo(() => {
    const list: PreparedImage[] = [];
    for (const image of images) {
      const src = resolveApiMediaUrl(image.url, apiBaseUrl);
      if (!src) continue;
      const label = image.originalName?.trim() || "განცხადების ფოტო";
      list.push({ src, label });
    }
    return list;
  }, [images, apiBaseUrl]);

  useEffect(() => {
    setSelectedIndex(0);
    setLightboxIndex(null);
  }, [images]);

  useEffect(() => {
    if (visibleItems.length === 0) {
      setSelectedIndex(0);
      return;
    }
    if (selectedIndex >= visibleItems.length) {
      setSelectedIndex(visibleItems.length - 1);
    }
  }, [selectedIndex, visibleItems.length]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((index) => {
      if (index === null || visibleItems.length < 2) return index;
      return (index - 1 + visibleItems.length) % visibleItems.length;
    });
  }, [visibleItems.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((index) => {
      if (index === null || visibleItems.length < 2) return index;
      return (index + 1) % visibleItems.length;
    });
  }, [visibleItems.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    if (visibleItems.length === 0) {
      setLightboxIndex(null);
      return;
    }
    if (lightboxIndex >= visibleItems.length) {
      setLightboxIndex(visibleItems.length - 1);
    }
  }, [lightboxIndex, visibleItems.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        keyboardEvent.preventDefault();
        closeLightbox();
      } else if (keyboardEvent.key === "ArrowLeft") {
        keyboardEvent.preventDefault();
        goPrev();
      } else if (keyboardEvent.key === "ArrowRight") {
        keyboardEvent.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  if (visibleItems.length === 0) {
    return (
      <section className="space-y-3" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" className="sr-only">
          ფოტოები
        </h2>
        <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-2xl bg-muted ring-1 ring-border">
          <ImageOff className="h-10 w-10 text-muted-foreground" aria-hidden />
          <p className="text-sm font-medium text-muted-foreground">ფოტოები არ არის</p>
        </div>
      </section>
    );
  }

  const selectedItem = visibleItems[selectedIndex] ?? visibleItems[0];
  const lightboxItem = lightboxIndex !== null ? visibleItems[lightboxIndex] : null;
  const canNavigateLightbox = visibleItems.length > 1;

  return (
    <section className="min-w-0 space-y-3" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="sr-only">
        ფოტოები
      </h2>

      <button
        type="button"
        onClick={() => setLightboxIndex(selectedIndex)}
        className="relative flex aspect-[4/3] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl bg-muted ring-1 ring-border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`${selectedItem.label} სრულ ეკრანზე`}
      >
        <img
          src={selectedItem.src}
          alt={selectedItem.label}
          className="h-full w-full object-contain"
          draggable={false}
        />
        <span className="absolute bottom-3 right-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm ring-1 ring-border">
          {selectedIndex + 1} / {visibleItems.length}
        </span>
      </button>

      {visibleItems.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {visibleItems.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={`${item.src}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-20 sm:w-24 ${
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2"
                    : "ring-1 ring-border opacity-80 hover:opacity-100"
                }`}
                aria-label={`${item.label} (${index + 1})`}
                aria-current={isSelected ? "true" : undefined}
              >
                <img
                  src={item.src}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      ) : null}

      {lightboxItem &&
        createPortal(
          <div
            className="fixed inset-0 z-[100]"
            role="dialog"
            aria-modal="true"
            aria-label="ფოტოების ნახვა"
          >
            <button
              type="button"
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              aria-label="ფოტოების დახურვა"
              onClick={closeLightbox}
            />
            <button
              type="button"
              className="pointer-events-auto fixed right-4 top-4 z-[110] inline-flex h-11 w-11 items-center justify-center rounded-full bg-foreground/80 text-background shadow-lg transition hover:bg-foreground sm:right-6 sm:top-6"
              aria-label="დახურვა"
              onClick={closeLightbox}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>

            {canNavigateLightbox ? (
              <>
                <button
                  type="button"
                  className="pointer-events-auto fixed left-3 top-1/2 z-[110] inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/80 text-background shadow-lg transition hover:bg-foreground sm:left-5"
                  aria-label="წინა ფოტო"
                  onClick={(clickEvent) => {
                    clickEvent.stopPropagation();
                    goPrev();
                  }}
                >
                  <ChevronLeft className="h-7 w-7" aria-hidden />
                </button>
                <button
                  type="button"
                  className="pointer-events-auto fixed right-3 top-1/2 z-[110] inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/80 text-background shadow-lg transition hover:bg-foreground sm:right-5"
                  aria-label="შემდეგი ფოტო"
                  onClick={(clickEvent) => {
                    clickEvent.stopPropagation();
                    goNext();
                  }}
                >
                  <ChevronRight className="h-7 w-7" aria-hidden />
                </button>
              </>
            ) : null}

            <div className="pointer-events-none relative flex h-full items-center justify-center p-6 pt-16 sm:p-10 sm:pt-20">
              <div className="pointer-events-auto flex max-h-[min(90vh,900px)] w-full max-w-[min(calc(100vw-4rem),1200px)] items-center justify-center">
                <img
                  src={lightboxItem.src}
                  alt={lightboxItem.label}
                  className="max-h-[min(85vh,860px)] max-w-full rounded-lg object-contain shadow-2xl ring-1 ring-border"
                  draggable={false}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
