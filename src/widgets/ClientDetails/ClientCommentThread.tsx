"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { Comment } from "@/features/clients/types";
import { formatClientDetailsDateTime } from "./clientDetailsFormatters";

type ClientCommentThreadProps = {
  title: string;
  comments: Comment[];
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: (text: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  deletingCommentId?: string | null;
  deleteError?: string | null;
};

export function ClientCommentThread({
  title,
  comments,
  isSubmitting,
  submitError,
  onSubmit,
  onDeleteComment,
  deletingCommentId,
  deleteError,
}: ClientCommentThreadProps) {
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await onSubmit(trimmed);
    setText("");
  };

  return (
    <div className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h2 className="mb-4 text-base font-semibold text-foreground">{title}</h2>

      {deleteError && (
        <p className="mb-3 text-xs text-destructive" role="alert">
          {deleteError}
        </p>
      )}

      <div className="mb-4 space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">კომენტარები ჯერ არ არის.</p>
        )}
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex items-start gap-3 rounded-lg border border-border bg-muted px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">{comment.text}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatClientDetailsDateTime(comment.createdAt)}
              </p>
            </div>
            {onDeleteComment && (
              <button
                type="button"
                onClick={() => {
                  void onDeleteComment(comment.id);
                }}
                disabled={deletingCommentId === comment.id}
                className="flex-shrink-0 rounded-lg p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="კომენტარის წაშლა"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
          placeholder="დაწერეთ კომენტარი…"
          className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        {submitError && (
          <p className="text-xs text-destructive" role="alert">
            {submitError}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !text.trim()}
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "იგზავნება…" : "გაგზავნა"}
          </button>
        </div>
      </div>
    </div>
  );
}
