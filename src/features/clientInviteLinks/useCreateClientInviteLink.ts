"use client";

import { useState } from "react";
import { createClientInviteLink } from "@/features/clientInviteLinks/api";
import type {
  ClientInviteCreatedResponse,
  CreateClientInviteLinkDto,
} from "@/features/clientInviteLinks/types";

type UseCreateClientInviteLinkResult = {
  create: (dto: CreateClientInviteLinkDto) => Promise<ClientInviteCreatedResponse>;
  isLoading: boolean;
  error: string | null;
};

export function useCreateClientInviteLink(): UseCreateClientInviteLinkResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (
    dto: CreateClientInviteLinkDto,
  ): Promise<ClientInviteCreatedResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      return await createClientInviteLink(dto);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not create this invite link right now.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}
