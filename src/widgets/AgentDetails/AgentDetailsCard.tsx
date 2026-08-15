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
    <div className="w-full max-w-xl rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h1 className="text-2xl font-semibold tracking-tight">აგენტის დეტალები</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        განაახლეთ აგენტის ინფორმაცია ან წაშალეთ სიიდან.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            სრული სახელი
          </label>
          <input
            type="text"
            value={values.fullName}
            onChange={handleChange("fullName")}
            className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            ელფოსტა
          </label>
          <input
            type="email"
            value={values.email}
            onChange={handleChange("email")}
            className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            ტელეფონი
          </label>
          <input
            type="tel"
            value={values.phone}
            onChange={handleChange("phone")}
            className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        {saveError && (
          <p className="text-sm text-destructive" role="alert">
            {saveError}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onDeleteClick}
            className="rounded-full border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive shadow-sm transition hover:bg-destructive/15"
          >
            აგენტის წაშლა
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? "ინახება…" : "ცვლილებების შენახვა"}
          </button>
        </div>
      </form>
    </div>
  );
}

