"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useCreateClientInviteLink } from "@/features/clientInviteLinks/useCreateClientInviteLink";
import { useClientInviteLinksList } from "@/features/clientInviteLinks/useClientInviteLinksList";
import { CLIENT_INVITE_LINK_STATUS_LABELS } from "@/features/clientInviteLinks/clientInviteEnums";
import type { ClientInviteCreatedResponse } from "@/features/clientInviteLinks/types";

const LIST_LIMIT = 20;

function resolveInviteUrl(token: string, inviteUrlFromApi: string | null): string {
  if (inviteUrlFromApi) {
    return inviteUrlFromApi;
  }
  if (typeof window !== "undefined") {
    return `${window.location.origin}/invite/${token}`;
  }
  return `/invite/${token}`;
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function ClientInviteLinksView() {
  const [page, setPage] = useState(1);
  const { links, total, limit, isLoading, error } = useClientInviteLinksList({
    page,
    limit: LIST_LIMIT,
  });

  const { create, isLoading: isCreating, error: createError } = useCreateClientInviteLink();

  const [expiresAtLocal, setExpiresAtLocal] = useState("");
  const [maxUsesInput, setMaxUsesInput] = useState("1");
  const [lastCreated, setLastCreated] = useState<ClientInviteCreatedResponse | null>(null);
  const [copyFeedbackToken, setCopyFeedbackToken] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleCreate = async () => {
    setLastCreated(null);
    const maxUsesParsed = Number.parseInt(maxUsesInput, 10);
    const maxUses =
      Number.isFinite(maxUsesParsed) && maxUsesParsed >= 1 && maxUsesParsed <= 10000
        ? maxUsesParsed
        : 1;

    const payload: { expiresAt?: string; maxUses: number } = { maxUses };
    if (expiresAtLocal.trim()) {
      const parsed = new Date(expiresAtLocal);
      if (!Number.isNaN(parsed.getTime())) {
        payload.expiresAt = parsed.toISOString();
      }
    }

    try {
      const created = await create(payload);
      setLastCreated(created);
    } catch {
      return;
    }
  };

  const copyInviteUrl = useCallback(async (token: string, inviteUrlFromApi: string | null) => {
    const url = resolveInviteUrl(token, inviteUrlFromApi);
    try {
      await navigator.clipboard.writeText(url);
      setCopyFeedbackToken(token);
      window.setTimeout(() => setCopyFeedbackToken(null), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }, []);

  const createdDisplayUrl = useMemo(() => {
    if (!lastCreated) return null;
    return resolveInviteUrl(lastCreated.token, lastCreated.inviteUrl);
  }, [lastCreated]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Client invite links</h1>
          <p className="max-w-lg text-sm text-slate-600">
            Create shareable links so clients can submit property requirements without signing in.
          </p>
        </div>
        <Link
          href="/clients"
          className="inline-flex items-center justify-center self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:self-auto"
        >
          Back to clients
        </Link>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-base font-semibold text-slate-800">Create link</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">Expires (optional)</label>
            <input
              type="datetime-local"
              value={expiresAtLocal}
              onChange={(event) => setExpiresAtLocal(event.target.value)}
              className="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-800">Max uses</label>
            <input
              type="number"
              min={1}
              max={10000}
              value={maxUsesInput}
              onChange={(event) => setMaxUsesInput(event.target.value)}
              className="block w-28 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
          </div>
          <button
            type="button"
            onClick={() => void handleCreate()}
            disabled={isCreating}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isCreating ? "Creating…" : "Create link"}
          </button>
        </div>
        {createError && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {createError}
          </p>
        )}
        {lastCreated && createdDisplayUrl && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <p className="font-medium">Link created</p>
            <p className="mt-1 break-all font-mono text-xs text-emerald-800">{createdDisplayUrl}</p>
            <button
              type="button"
              onClick={() => void copyInviteUrl(lastCreated.token, lastCreated.inviteUrl)}
              className="mt-2 text-sm font-medium text-emerald-950 underline-offset-2 hover:underline"
            >
              {copyFeedbackToken === lastCreated.token ? "Copied" : "Copy link"}
            </button>
          </div>
        )}
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-base font-semibold text-slate-800">Your links</h2>
        {isLoading && <p className="text-sm text-slate-600">Loading…</p>}
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {!isLoading && !error && links.length === 0 && (
          <p className="text-sm text-slate-600">No invite links yet.</p>
        )}
        {!isLoading && !error && links.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-4">Created</th>
                  <th className="py-2 pr-4">Expires</th>
                  <th className="py-2 pr-4">Uses</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Effective</th>
                  <th className="py-2 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-slate-800">{formatDateTime(row.createdAt)}</td>
                    <td className="py-3 pr-4 text-slate-700">{formatDateTime(row.expiresAt)}</td>
                    <td className="py-3 pr-4 text-slate-700">
                      {row.useCount} / {row.maxUses}
                    </td>
                    <td className="py-3 pr-4 text-slate-700">
                      {CLIENT_INVITE_LINK_STATUS_LABELS[row.status]}
                    </td>
                    <td className="py-3 pr-4 text-slate-700">
                      {CLIENT_INVITE_LINK_STATUS_LABELS[row.effectiveStatus]}
                    </td>
                    <td className="py-3 pr-0 text-right">
                      <button
                        type="button"
                        onClick={() => void copyInviteUrl(row.token, row.inviteUrl)}
                        className="text-sm font-medium text-slate-900 underline-offset-2 hover:underline"
                      >
                        {copyFeedbackToken === row.token ? "Copied" : "Copy"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-700">
            <span>
              Page {page} of {totalPages} ({total} total)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
