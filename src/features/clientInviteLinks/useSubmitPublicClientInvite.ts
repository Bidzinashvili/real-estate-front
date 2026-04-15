"use client";

import { useState } from "react";
import { submitPublicClientInvite } from "@/features/clientInviteLinks/api";
import type { CreateClientPayload, Client } from "@/features/clients/types";
import { ClientInviteLinkRequestError } from "@/features/clientInviteLinks/clientInviteLinkRequestError";
import { ApiError } from "@/shared/lib/apiError";

type SubmitErrorKind = "field" | "gone" | "not_found" | "conflict" | "rate_limited" | "generic";

export type SubmitPublicInviteError = {
  kind: SubmitErrorKind;
  message: string;
  fieldErrors?: ApiError["fieldErrors"];
};

const INVITE_LINK_ERROR_KIND_BY_STATUS: Partial<
  Record<number, Exclude<SubmitErrorKind, "field" | "generic">>
> = {
  404: "not_found",
  410: "gone",
  409: "conflict",
  429: "rate_limited",
};

type UseSubmitPublicClientInviteResult = {
  submit: (inviteToken: string, dto: CreateClientPayload) => Promise<Client | null>;
  isLoading: boolean;
  error: SubmitPublicInviteError | null;
};

export function useSubmitPublicClientInvite(): UseSubmitPublicClientInviteResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SubmitPublicInviteError | null>(null);

  const submit = async (
    inviteToken: string,
    dto: CreateClientPayload,
  ): Promise<Client | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const created = await submitPublicClientInvite(inviteToken, dto);
      return created;
    } catch (err) {
      if (err instanceof ClientInviteLinkRequestError) {
        const kind = INVITE_LINK_ERROR_KIND_BY_STATUS[err.statusCode];
        if (kind) {
          setError({ kind, message: err.message });
          return null;
        }
        setError({ kind: "generic", message: err.message });
        return null;
      }

      if (err instanceof ApiError) {
        setError({
          kind: "field",
          message: err.message,
          fieldErrors: err.fieldErrors,
        });
        return null;
      }

      setError({
        kind: "generic",
        message:
          err instanceof Error ? err.message : "Could not submit your details right now.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading, error };
}
