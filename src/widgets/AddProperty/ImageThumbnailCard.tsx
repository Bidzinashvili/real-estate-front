"use client";

import { useEffect, useState, type DragEvent } from "react";
import { GripVertical, Trash2 } from "lucide-react";

export type ImageThumbnailCardProps = {
  file: File;
  imageIndex: number;
  onRemove: (index: number) => void;
  isDragging: boolean;
  isDropTarget: boolean;
  onDragStart: (index: number, event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onDragOver: (index: number) => void;
  onDrop: (index: number, event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (index: number) => void;
};

export function ImageThumbnailCard({
  file,
  imageIndex,
  onRemove,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onDragLeave,
}: ImageThumbnailCardProps) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(imageIndex, event)}
      onDragEnd={onDragEnd}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOver(imageIndex);
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(imageIndex, event);
      }}
      onDragLeave={() => onDragLeave(imageIndex)}
      className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition ${isDragging ? "opacity-60" : ""} ${isDropTarget ? "border-slate-900 ring-2 ring-slate-900/10" : "border-slate-200 hover:border-slate-300"}`}
    >
      <div className="absolute left-2 top-2 z-10 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-slate-700 shadow-sm backdrop-blur">
        {imageIndex + 1}
      </div>
      <button
        type="button"
        onClick={() => onRemove(imageIndex)}
        className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm backdrop-blur transition hover:text-red-600"
        aria-label={`Delete image ${imageIndex + 1}`}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
        <GripVertical className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        <span className="truncate">{file.name}</span>
      </div>
      <div className="relative aspect-[4/3] bg-slate-100">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={file.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : null}
      </div>
    </div>
  );
}
