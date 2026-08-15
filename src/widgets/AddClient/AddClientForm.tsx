"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateClient } from "@/features/clients/useCreateClient";
import { clientFormSchema, emptyClientFormDefaults } from "@/features/clients/clientFormSchema";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import { buildCreateClientDto } from "@/features/clients/buildCreateClientDto";
import { useLocalStorageDraft } from "@/shared/hooks/useLocalStorageDraft";
import { ClientCoreInfoSection } from "@/widgets/ClientForm/ClientCoreInfoSection";
import { ClientLocationSection } from "@/widgets/ClientForm/ClientLocationSection";
import { ClientBudgetSection } from "@/widgets/ClientForm/ClientBudgetSection";
import { ClientRequirementsSection } from "@/widgets/ClientForm/ClientRequirementsSection";
import { ClientRelatedPersonsSection } from "@/widgets/ClientForm/ClientRelatedPersonsSection";

const addClientDraftStorageKey = "draft:client:new";

export function AddClientForm() {
  const router = useRouter();
  const { create, isLoading, error } = useCreateClient();
  const { restoredDraft, isDraftReady, saveDraft, clearDraft } =
    useLocalStorageDraft<ClientFormValues>(addClientDraftStorageKey);
  const [isDraftApplied, setIsDraftApplied] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema) as Resolver<ClientFormValues>,
    defaultValues: {
      ...emptyClientFormDefaults,
      relatedPersons: [],
    },
  });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({ control, name: "phones" as never });

  const {
    fields: personFields,
    append: appendPerson,
    remove: removePerson,
  } = useFieldArray({ control, name: "relatedPersons" });

  const watchedFormValues = watch();
  const selectedDealType = watch("dealType");
  const isRentDeal = selectedDealType === "RENT" || selectedDealType === "DAILY_RENT";

  useEffect(() => {
    if (!isDraftReady) {
      return;
    }

    if (restoredDraft) {
      reset({
        ...emptyClientFormDefaults,
        ...restoredDraft,
        relatedPersons: restoredDraft.relatedPersons ?? [],
      });
    }

    setIsDraftApplied(true);
  }, [reset, isDraftReady, restoredDraft]);

  useEffect(() => {
    if (!isDraftReady || !isDraftApplied) {
      return;
    }

    saveDraft(watchedFormValues);
  }, [isDraftApplied, isDraftReady, saveDraft, watchedFormValues]);

  const onSubmit = async (values: ClientFormValues) => {
    try {
      const clientCreatePayload = buildCreateClientDto(values);
      const created = await create(clientCreatePayload);
      clearDraft();
      router.push(`/clients/${created.id}`);
    } catch (error) {
      console.error("Add client submit failed", error);
    }
  };

  const onInvalidSubmit = (formErrors: typeof errors) => {
    console.error("Add client form validation failed", formErrors);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">კლიენტის დამატება</h1>
        <p className="text-sm text-muted-foreground">შეავსეთ ქვემოთ მოცემული ველები ახალი კლიენტის დასამატებლად.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-8" noValidate>
        <ClientCoreInfoSection
          control={control}
          register={register}
          setValue={setValue}
          errors={errors}
          phoneFields={phoneFields}
          appendPhone={appendPhone}
          removePhone={removePhone}
          isRentDeal={isRentDeal}
          showDefaultStatusOption
        />

        <ClientLocationSection control={control} />

        <ClientBudgetSection control={control} errors={errors} />

        <ClientRequirementsSection
          control={control}
          errors={errors}
          setValue={setValue}
          isRentDeal={isRentDeal}
        />

        <ClientRelatedPersonsSection
          register={register}
          personFields={personFields}
          appendPerson={appendPerson}
          removePerson={removePerson}
        />

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              router.push("/clients");
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
            {isLoading ? "ინახება…" : "კლიენტის შენახვა"}
          </button>
        </div>
      </form>
    </div>
  );
}
