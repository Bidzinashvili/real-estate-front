"use client";

import { useState } from "react";
import { addClientComment, addClientInternalComment } from "@/features/clients/api";
import type { Comment } from "@/features/clients/types";

type UseAddClientCommentResult = {
  addComment: (clientId: string, text: string) => Promise<Comment>;
  addInternalComment: (clientId: string, text: string) => Promise<Comment>;
  isLoading: boolean;
  error: string | null;
};

export function useAddClientComment(): UseAddClientCommentResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = async (clientId: string, text: string): Promise<Comment> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await addClientComment(clientId, text);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not post comment right now.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addInternalComment = async (
    clientId: string,
    text: string,
  ): Promise<Comment> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await addClientInternalComment(clientId, text);
      return result;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not post internal comment right now.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { addComment, addInternalComment, isLoading, error };
}
