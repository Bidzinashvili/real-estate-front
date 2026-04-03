"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import type { Agent } from "@/features/agents/types";

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
};

type AgentDetailsCardProps = {
  agent: Agent;
  isSaving: boolean;
  saveError: string | null;
  onSubmit: (values: FormValues) => void;
  onDeleteClick: () => void;
};

export function AgentDetailsCard({
  agent,
  isSaving,
  saveError,
  onSubmit,
  onDeleteClick,
}: AgentDetailsCardProps) {
  const [values, setValues] = useState<FormValues>({
    fullName: agent.fullName,
    email: agent.email,
    phone: agent.phone ?? "",
  });

  useEffect(() => {
    setValues({
      fullName: agent.fullName,
      email: agent.email,
      phone: agent.phone ?? "",
    });
  }, [agent.fullName, agent.email, agent.phone]);

  const handleChange =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-2xl font-semibold tracking-tight">Agent details</h1>
      <p className="mt-1 text-sm text-slate-600">
        Update your agent&apos;s information or remove them from your list.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-800">
            Full name
          </label>
          <input
            type="text"
            value={values.fullName}
            onChange={handleChange("fullName")}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-800">
            Email
          </label>
          <input
            type="email"
            value={values.email}
            onChange={handleChange("email")}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-800">
            Phone
          </label>
          <input
            type="tel"
            value={values.phone}
            onChange={handleChange("phone")}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900"
          />
        </div>

        {saveError && (
          <p className="text-sm text-red-600" role="alert">
            {saveError}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onDeleteClick}
            className="rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 shadow-sm transition hover:bg-red-100"
          >
            Delete agent
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

