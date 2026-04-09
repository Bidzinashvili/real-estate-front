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
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-base font-semibold text-slate-800">{title}</h2>

      {deleteError && (
        <p className="mb-3 text-xs text-red-600" role="alert">
          {deleteError}
        </p>
      )}

      <div className="mb-4 space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-slate-500">No comments yet.</p>
        )}
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-800">{comment.text}</p>
              <p className="mt-1 text-xs text-slate-400">
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
                className="flex-shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Delete comment"
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
          placeholder="Write a comment…"
          className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
        />
        {submitError && (
          <p className="text-xs text-red-600" role="alert">
            {submitError}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !text.trim()}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
