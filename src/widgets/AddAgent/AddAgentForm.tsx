"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateAgent } from "@/features/agents/useCreateAgent";
import { normalizeGeorgianAgentPhone } from "@/features/agents/normalizeAgentPhone";
import { useSessionDraft } from "@/shared/hooks/useSessionDraft";
import { AgentPhoneInput } from "@/widgets/Agents/AgentPhoneInput";

const formSchema = z.object({
  fullName: z.string().min(2, "სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"),
  email: z.string().email("შეიყვანეთ სწორი ელფოსტა"),
  phone: z.string().min(6, "შეიყვანეთ ტელეფონის ნომერი"),
});

type FormValues = z.infer<typeof formSchema>;

const addAgentDraftStorageKey = "draft:agent:new";

export function AddAgentForm() {
  const router = useRouter();
  const { create, isLoading, error } = useCreateAgent();
  const { restoredDraft, saveDraft, clearDraft } = useSessionDraft<FormValues>(
    addAgentDraftStorageKey,
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: restoredDraft
      ? {
          ...restoredDraft,
          phone: normalizeGeorgianAgentPhone(restoredDraft.phone),
        }
      : {
          fullName: "",
          email: "",
          phone: normalizeGeorgianAgentPhone(""),
        },
  });

  const watchedFormValues = watch();

  useEffect(() => {
    if (restoredDraft) {
      reset({
        ...restoredDraft,
        phone: normalizeGeorgianAgentPhone(restoredDraft.phone),
      });
    }
  }, [reset, restoredDraft]);

  useEffect(() => {
    saveDraft(watchedFormValues);
  }, [saveDraft, watchedFormValues]);

  const onSubmit = async (values: FormValues) => {
    await create({
      ...values,
      phone: normalizeGeorgianAgentPhone(values.phone),
    });
    clearDraft();
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted text-foreground">
      <div className="w-full max-w-xl rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
        <h1 className="text-2xl font-semibold tracking-tight">აგენტის დამატება</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          შეავსეთ ქვემოთ მოცემული ველები ახალი აგენტის დასამატებლად.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-foreground"
            >
              სრული სახელი
            </label>
            <input
              id="fullName"
              type="text"
              {...register("fullName")}
              className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-primary"
            />
            {errors.fullName && (
              <p className="text-xs text-destructive" role="alert">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              ელფოსტა
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-primary"
            />
            {errors.email && (
              <p className="text-xs text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-foreground"
            >
              ტელეფონი
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <AgentPhoneInput
                  id="phone"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.phone && (
              <p className="text-xs text-destructive" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                clearDraft();
                router.push("/dashboard");
              }}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
            >
              გაუქმება
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "ინახება…" : "აგენტის შენახვა"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

