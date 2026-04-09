"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { deletePropertyImage } from "@/features/properties/api";
import { resolveApiMediaUrl } from "@/features/properties/resolveApiMediaUrl";

type PreparedItem = {
  img: PropertyImageRow;
  src: string;
  label: string;
  deleteId: string;
};

type PropertyImageRow = {
  id: string;
  url: string;
  originalName: string;
};

function imageIdForApiDelete(image: PropertyImageRow): string {
  const trimmedId = image.id.trim();
  if (trimmedId) return trimmedId;
  const pathOnly = image.url.split("?")[0] ?? image.url;
  const segment = pathOnly.split("/").pop();
  return segment && segment.length > 0 ? segment : image.url;
}

type PropertyDetailsImageGalleryProps = {
  propertyId: string;
  images: PropertyImageRow[];
  apiBaseUrl: string | null;
  canDelete: boolean;
  onDeleted: () => Promise<void>;
};

export function PropertyDetailsImageGallery({
  propertyId,
  images,
  apiBaseUrl,
  canDelete,
  onDeleted,
}: PropertyDetailsImageGalleryProps) {
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleItems = useMemo(() => {
    const list: PreparedItem[] = [];
    for (const img of images) {
      const src = resolveApiMediaUrl(img.url, apiBaseUrl);
      if (!src) continue;
      const label = img.originalName?.trim() || "Listing photo";
      const deleteId = imageIdForApiDelete(img);
      list.push({ img, src, label, deleteId });
    }
    return list;
  }, [images, apiBaseUrl]);

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

  const handleDelete = async (imageIdForDelete: string) => {
    setError(null);
    setDeletingImageId(imageIdForDelete);
    try {
      await deletePropertyImage(propertyId, imageIdForDelete);
      await onDeleted();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not remove this image.";
      setError(message);
    } finally {
      setDeletingImageId(null);
    }
  };

  if (images.length === 0) {
    return (
      <section className="space-y-2" aria-labelledby="gallery-heading">
        <h2
          id="gallery-heading"
          className="text-sm font-semibold text-slate-800"
        >
          Photos
        </h2>
        <p className="text-sm text-slate-500">
          No photos attached to this listing.
        </p>
      </section>
    );
  }

  const lightboxItem =
    lightboxIndex !== null ? visibleItems[lightboxIndex] : null;
  const canNavigateLightbox = visibleItems.length > 1;

  return (
    <section className="space-y-3" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="text-sm font-semibold text-slate-800">
        Photos
      </h2>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visibleItems.map(({ img, src, label, deleteId }, index) => {
          const busy = deletingImageId === deleteId;
          return (
            <li
              key={`${deleteId}-${img.url}`}
              className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200"
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="absolute inset-0 flex h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                aria-label={`Open ${label} fullscreen`}
              >
                <img
                  src={src}
                  alt=""
                  className="pointer-events-none h-full w-full object-cover"
                  draggable={false}
                />
              </button>
              {canDelete && (
                <button
                  type="button"
                  disabled={
                    busy ||
                    Boolean(deletingImageId && deletingImageId !== deleteId)
                  }
                  onClick={(clickEvent) => {
                    clickEvent.stopPropagation();
                    void handleDelete(deleteId);
                  }}
                  className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white shadow-sm backdrop-blur-[2px] transition hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Remove ${label}`}
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {lightboxItem &&
        createPortal(
          <div
            className="fixed inset-0 z-[100]"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
          >
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-md transition-colors"
              aria-label="Close photo viewer"
              onClick={closeLightbox}
            />
            <button
              type="button"
              className="pointer-events-auto fixed right-4 top-4 z-[110] inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/65 sm:right-6 sm:top-6"
              aria-label="Close"
              onClick={closeLightbox}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>

            {canNavigateLightbox && (
              <>
                <button
                  type="button"
                  className="pointer-events-auto fixed left-3 top-1/2 z-[110] inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/65 sm:left-5 md:left-8"
                  aria-label="Previous photo"
                  onClick={(clickEvent) => {
                    clickEvent.stopPropagation();
                    goPrev();
                  }}
                >
                  <ChevronLeft className="h-7 w-7" aria-hidden />
                </button>
                <button
                  type="button"
                  className="pointer-events-auto fixed right-3 top-1/2 z-[110] inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/65 sm:right-5 md:right-8"
                  aria-label="Next photo"
                  onClick={(clickEvent) => {
                    clickEvent.stopPropagation();
                    goNext();
                  }}
                >
                  <ChevronRight className="h-7 w-7" aria-hidden />
                </button>
              </>
            )}

            <div className="pointer-events-none relative flex h-full items-center justify-center p-6 pt-16 sm:p-10 sm:pt-20">
              <div className="pointer-events-auto flex max-h-[min(90vh,900px)] max-w-[min(calc(100vw-4rem),1200px)] w-full items-center justify-center">
                <img
                  src={lightboxItem.src}
                  alt={lightboxItem.label}
                  className="max-h-[min(85vh,860px)] max-w-full rounded-lg object-contain shadow-2xl ring-1 ring-white/20"
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
