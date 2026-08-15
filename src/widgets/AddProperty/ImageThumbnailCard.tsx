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
      className={`group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition ${isDragging ? "opacity-60" : ""} ${isDropTarget ? "border-slate-900 ring-2 ring-slate-900/10" : "border-border hover:border-border"}`}
    >
      <div className="absolute left-2 top-2 z-10 rounded-full bg-card/90 px-2 py-0.5 text-[11px] font-medium text-foreground shadow-sm backdrop-blur">
        {imageIndex + 1}
      </div>
      <button
        type="button"
        onClick={() => onRemove(imageIndex)}
        className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-sm backdrop-blur transition hover:text-destructive"
        aria-label={`ფოტოს წაშლა ${imageIndex + 1}`}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="flex items-center gap-2 border-b border-border bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="truncate">{file.name}</span>
      </div>
      <div className="relative aspect-[4/3] bg-muted">
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
