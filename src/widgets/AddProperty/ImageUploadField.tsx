"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Plus } from "lucide-react";
import { ImageThumbnailCard } from "@/widgets/AddProperty/ImageThumbnailCard";

type ImageUploadFieldProps = {
  images: File[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
  onReorder: (sourceIndex: number, targetIndex: number) => void;
  error?: string | null;
  maxImages?: number;
};

const acceptedImageTypes = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";
const defaultMaxImages = 50;
const imageKeyMap = new WeakMap<File, string>();
let imageKeySequence = 0;

function getImageKey(file: File) {
  const existingKey = imageKeyMap.get(file);
  if (existingKey) return existingKey;

  imageKeySequence += 1;
  const nextKey = `image-${imageKeySequence}`;
  imageKeyMap.set(file, nextKey);
  return nextKey;
}

export function ImageUploadField({
  images,
  onAdd,
  onRemove,
  onReorder,
  error,
  maxImages = defaultMaxImages,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragDepthRef = useRef(0);
  const [isDropActive, setIsDropActive] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  const handleSelectedFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    onAdd(selectedFiles);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.currentTarget.files
      ? Array.from(event.currentTarget.files)
      : [];
    handleSelectedFiles(selectedFiles);
    event.currentTarget.value = "";
  };

  const handleDropzoneDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepthRef.current += 1;
    setIsDropActive(true);
  };

  const handleDropzoneDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDropActive(true);
  };

  const handleDropzoneDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) {
      setIsDropActive(false);
    }
  };

  const handleDropzoneDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepthRef.current = 0;
    setIsDropActive(false);
    const droppedFiles = Array.from(event.dataTransfer.files ?? []);
    handleSelectedFiles(droppedFiles);
  };

  const handleCardDragStart = (imageIndex: number, event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(imageIndex));
    setDraggedImageIndex(imageIndex);
    setDropTargetIndex(imageIndex);
  };

  const handleCardDragEnd = () => {
    setDraggedImageIndex(null);
    setDropTargetIndex(null);
  };

  const handleCardDragOver = (imageIndex: number) => {
    setDropTargetIndex(imageIndex);
  };

  const handleCardDrop = (imageIndex: number, event: DragEvent<HTMLDivElement>) => {
    const sourceIndex =
      draggedImageIndex ?? Number.parseInt(event.dataTransfer.getData("text/plain"), 10);
    if (!Number.isFinite(sourceIndex)) {
      return;
    }
    onReorder(sourceIndex, imageIndex);
    setDraggedImageIndex(null);
    setDropTargetIndex(null);
  };

  const handleCardDragLeave = (imageIndex: number) => {
    if (dropTargetIndex === imageIndex) {
      setDropTargetIndex(null);
    }
  };

  const handleAddMoreDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files ?? []);
    if (droppedFiles.length > 0) {
      handleSelectedFiles(droppedFiles);
      return;
    }
    const parsedSourceIndex = Number.parseInt(event.dataTransfer.getData("text/plain"), 10);
    const sourceIndex = draggedImageIndex ?? parsedSourceIndex;
    if (Number.isFinite(sourceIndex)) {
      onReorder(sourceIndex, images.length);
      setDraggedImageIndex(null);
      setDropTargetIndex(null);
    }
  };

  const handleAddMoreDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDropTargetIndex(images.length);
  };

  const handleAddMoreDragLeave = () => {
    if (dropTargetIndex === images.length) {
      setDropTargetIndex(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <p className="block text-sm font-medium text-slate-800">
          Images (optional, up to {maxImages})
        </p>
        <div
          onClick={handleBrowseClick}
          onDragEnter={handleDropzoneDragEnter}
          onDragOver={handleDropzoneDragOver}
          onDragLeave={handleDropzoneDragLeave}
          onDrop={handleDropzoneDrop}
          className={`cursor-pointer rounded-2xl border-2 border-dashed px-4 py-5 transition ${isDropActive ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-slate-50/60 hover:border-slate-300"}`}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleBrowseClick();
            }
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                Drop images here or click to browse
              </p>
              <p className="text-xs text-slate-500">
                Drag files from your computer, WhatsApp, or folders. PNG, JPG, and WebP images are
                supported.
              </p>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleBrowseClick();
              }}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              Choose files
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={acceptedImageTypes}
            onChange={handleInputChange}
            className="sr-only"
          />
        </div>
      </div>

      {images.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((file, imageIndex) => (
            <ImageThumbnailCard
              key={getImageKey(file)}
              file={file}
              imageIndex={imageIndex}
              onRemove={onRemove}
              isDragging={draggedImageIndex === imageIndex}
              isDropTarget={dropTargetIndex === imageIndex}
              onDragStart={handleCardDragStart}
              onDragEnd={handleCardDragEnd}
              onDragOver={handleCardDragOver}
              onDrop={handleCardDrop}
              onDragLeave={handleCardDragLeave}
            />
          ))}
          <button
            type="button"
            onClick={handleBrowseClick}
            onDragOver={handleAddMoreDragOver}
            onDragLeave={handleAddMoreDragLeave}
            onDrop={handleAddMoreDrop}
            className={`flex min-h-[14rem] flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 text-center transition ${dropTargetIndex === images.length ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-slate-50/60 hover:border-slate-300"}`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm">
              <Plus className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="mt-3 text-sm font-semibold text-slate-900">Add more images</span>
            <span className="mt-1 text-xs text-slate-500">
              Drop files here to add them after the current sequence
            </span>
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
