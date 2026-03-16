"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateAgent } from "@/features/agents/useCreateAgent";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(6, "Please enter a phone number"),
});

type FormValues = z.infer<typeof formSchema>;

export function AddAgentForm() {
  const router = useRouter();
  const { create, isLoading, error } = useCreateAgent();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    await create(values);
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold tracking-tight">Add agent</h1>
        <p className="mt-1 text-sm text-slate-600">
          Fill in the details below to add a new agent.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-slate-800"
            >
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              {...register("fullName")}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900"
            />
            {errors.fullName && (
              <p className="text-xs text-red-600" role="alert">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-800"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900"
            />
            {errors.email && (
              <p className="text-xs text-red-600" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-slate-800"
            >
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900"
            />
            {errors.phone && (
              <p className="text-xs text-red-600" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Saving…" : "Save agent"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

