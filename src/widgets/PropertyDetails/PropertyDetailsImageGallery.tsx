"use client";

import { FieldVisibilityIcon } from "@/shared/ui/VisibilityHint";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ImagePlus, Loader2, X } from "lucide-react";
import { addPropertyImages, deletePropertyImage } from "@/features/properties/api";
import { validateAddPropertyImages } from "@/features/properties/addPropertyFormValidation";
import { resolveApiMediaUrl } from "@/features/properties/resolveApiMediaUrl";

type PreparedItem = {
  img: PropertyImageRow;
  src: string;
  label: string;
  deleteId: string;
};

type PropertyImageRow = {
  id?: string;
  url: string;
  originalName: string;
};

function imageIdForApiDelete(image: PropertyImageRow): string {
  const trimmedId = image.id?.trim() ?? "";
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
  /** Owner / admin in edit mode may add photos. Defaults to `canDelete`. */
  canUpload?: boolean;
  /** Called after a photo was added or deleted (refetch the property). */
  onChanged: () => Promise<void>;
};

const MAX_PROPERTY_IMAGES = 50;
const ACCEPTED_IMAGE_TYPES = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";

export function PropertyDetailsImageGallery({
  propertyId,
  images,
  apiBaseUrl,
  canDelete,
  canUpload = canDelete,
  onChanged,
}: PropertyDetailsImageGalleryProps) {
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleItems = useMemo(() => {
    const list: PreparedItem[] = [];
    for (const img of images) {
      const src = resolveApiMediaUrl(img.url, apiBaseUrl);
      if (!src) continue;
      const label = img.originalName?.trim() || "განცხადების ფოტო";
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
      await onChanged();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "ფოტოს წაშლა ვერ მოხერხდა.";
      setError(message);
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleFilesSelected = async (fileList: FileList | null) => {
    const files = fileList ? Array.from(fileList) : [];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (files.length === 0) return;
    setError(null);

    if (images.length + files.length > MAX_PROPERTY_IMAGES) {
      setError(
        `შეგიძლიათ ატვირთოთ მაქსიმუმ ${MAX_PROPERTY_IMAGES} ფოტო (ახლა არის ${images.length}).`,
      );
      return;
    }
    const validationError = validateAddPropertyImages(files);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    try {
      await addPropertyImages(propertyId, files);
      await onChanged();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "ფოტოს დამატება ვერ მოხერხდა.",
      );
    } finally {
      setUploading(false);
    }
  };

  const uploadControl = canUpload ? (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPTED_IMAGE_TYPES}
        className="hidden"
        onChange={(changeEvent) => void handleFilesSelected(changeEvent.target.files)}
      />
      <button
        type="button"
        disabled={uploading || images.length >= MAX_PROPERTY_IMAGES}
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <ImagePlus className="h-4 w-4" aria-hidden />
        )}
        ფოტოს დამატება
      </button>
    </>
  ) : null;

  const header = (
    <div className="flex items-center justify-between gap-3">
      <h2 id="gallery-heading" className="text-sm font-semibold text-foreground">
        ფოტოები
        <FieldVisibilityIcon visibility="public" />
      </h2>
      {uploadControl}
    </div>
  );

  if (images.length === 0) {
    return (
      <section className="space-y-2" aria-labelledby="gallery-heading">
        {header}
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          ამ განცხადებას ფოტოები არ აქვს.
        </p>
      </section>
    );
  }

  const lightboxItem =
    lightboxIndex !== null ? visibleItems[lightboxIndex] : null;
  const canNavigateLightbox = visibleItems.length > 1;

  return (
    <section className="space-y-3" aria-labelledby="gallery-heading">
      {header}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visibleItems.map(({ img, src, label, deleteId }, index) => {
          const busy = deletingImageId === deleteId;
          return (
            <li
              key={`${deleteId}-${img.url}`}
              className="relative aspect-square overflow-hidden rounded-xl bg-muted ring-1 ring-border"
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="absolute inset-0 flex h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                aria-label={`${label} სრულ ეკრანზე`}
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
                  aria-label={`${label}-ის წაშლა`}
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
            aria-label="ფოტოების ნახვა"
          >
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-md transition-colors"
              aria-label="ფოტოების დახურვა"
              onClick={closeLightbox}
            />
            <button
              type="button"
              className="pointer-events-auto fixed right-4 top-4 z-[110] inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/65 sm:right-6 sm:top-6"
              aria-label="დახურვა"
              onClick={closeLightbox}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>

            {canNavigateLightbox && (
              <>
                <button
                  type="button"
                  className="pointer-events-auto fixed left-3 top-1/2 z-[110] inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/65 sm:left-5 md:left-8"
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
                  className="pointer-events-auto fixed right-3 top-1/2 z-[110] inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/65 sm:right-5 md:right-8"
                  aria-label="შემდეგი ფოტო"
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
