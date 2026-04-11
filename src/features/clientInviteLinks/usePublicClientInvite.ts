"use client";

import { useEffect, useState } from "react";
import { getPublicClientInvite } from "@/features/clientInviteLinks/api";
import type { PublicClientInviteGetResponse } from "@/features/clientInviteLinks/types";
import { ClientInviteLinkRequestError } from "@/features/clientInviteLinks/clientInviteLinkRequestError";
import { ApiError } from "@/shared/lib/apiError";

export type PublicInviteLoadState =
  | { status: "loading" }
  | { status: "success"; data: PublicClientInviteGetResponse }
  | { status: "not_found" }
  | { status: "gone" }
  | { status: "rate_limited" }
  | { status: "error"; message: string };

export function usePublicClientInvite(inviteToken: string): PublicInviteLoadState {
  const [state, setState] = useState<PublicInviteLoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setState({ status: "loading" });

      try {
        const data = await getPublicClientInvite(inviteToken);
        if (!cancelled) {
          setState({ status: "success", data });
        }
      } catch (err) {
        if (cancelled) return;

        if (err instanceof ClientInviteLinkRequestError) {
          if (err.statusCode === 404) {
            setState({ status: "not_found" });
            return;
          }
          if (err.statusCode === 410) {
            setState({ status: "gone" });
            return;
          }
          if (err.statusCode === 429) {
            setState({ status: "rate_limited" });
            return;
          }
          setState({ status: "error", message: err.message });
          return;
        }

        if (err instanceof ApiError) {
          setState({ status: "error", message: err.message });
          return;
        }

        setState({
          status: "error",
          message:
            err instanceof Error ? err.message : "Could not load this invite form right now.",
        });
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [inviteToken]);

  return state;
}
