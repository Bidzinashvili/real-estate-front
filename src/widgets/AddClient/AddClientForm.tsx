"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateClient } from "@/features/clients/useCreateClient";
import { clientFormSchema, emptyClientFormDefaults } from "@/features/clients/clientFormSchema";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import type { Client } from "@/features/clients/types";
import { buildCreateClientDto } from "@/features/clients/buildCreateClientDto";
import {
  CLIENT_CREATE_STATUSES,
  CLIENT_STATUS_LABELS,
} from "@/features/clients/clientEnums";
import { useLocalStorageDraft } from "@/shared/hooks/useLocalStorageDraft";
import { normalizeGeorgianPhone } from "@/shared/lib/normalizeGeorgianPhone";
import { ClientCoreInfoSection } from "@/widgets/ClientForm/ClientCoreInfoSection";
import { ClientLocationSection } from "@/widgets/ClientForm/ClientLocationSection";
import { ClientBudgetSection } from "@/widgets/ClientForm/ClientBudgetSection";
import { ClientRequirementsSection } from "@/widgets/ClientForm/ClientRequirementsSection";
import { ClientRelatedPersonsSection } from "@/widgets/ClientForm/ClientRelatedPersonsSection";
import { ClientFormLockHint } from "@/widgets/ClientForm/PreferenceLockButton";
import { stripTemporaryLocksFromClientForm } from "@/features/matching/collectTemporaryLocks";
import { preventImplicitFormSubmitOnEnter } from "@/shared/lib/preventImplicitFormSubmitOnEnter";
import { ClientFormRequiredFieldsSummary } from "@/widgets/ClientForm/ClientFormRequiredFieldsSummary";
import { useClientFormValidationNotice } from "@/widgets/ClientForm/useClientFormValidationNotice";

const addClientDraftStorageKey = "draft:client:new";

type AddClientFormProps = {
  embedded?: boolean;
  onClientCreated?: (client: Client) => void;
  onCancelEmbedded?: () => void;
};

export function AddClientForm({
  embedded = false,
  onClientCreated,
  onCancelEmbedded,
}: AddClientFormProps) {
  const router = useRouter();
  const { create, isLoading, error } = useCreateClient();
  const { restoredDraft, isDraftReady, saveDraft, clearDraft } =
    useLocalStorageDraft<ClientFormValues>(addClientDraftStorageKey);
  const [isDraftApplied, setIsDraftApplied] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const hasCommittedSubmitRef = useRef(false);
  const {
    showRequiredFieldsSummary,
    onInvalidSubmit,
    clearValidationNotice,
  } = useClientFormValidationNotice();

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
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!isDraftReady) {
      return;
    }

    if (!embedded && restoredDraft) {
      reset(
        stripTemporaryLocksFromClientForm({
          ...emptyClientFormDefaults,
          ...restoredDraft,
          relatedPersons: restoredDraft.relatedPersons ?? [],
          phones: restoredDraft.phones?.length
            ? restoredDraft.phones
            : emptyClientFormDefaults.phones,
          whatsapp: normalizeGeorgianPhone(restoredDraft.whatsapp ?? ""),
        }),
      );
    }

    setIsDraftApplied(true);
  }, [embedded, reset, isDraftReady, restoredDraft]);

  useEffect(() => {
    if (embedded || hasCommittedSubmitRef.current) {
      return;
    }

    if (!isDraftReady || !isDraftApplied) {
      return;
    }

    saveDraft(stripTemporaryLocksFromClientForm(watchedFormValues));
  }, [embedded, isDraftApplied, isDraftReady, saveDraft, watchedFormValues]);

  const onSubmit = async (values: ClientFormValues) => {
    clearValidationNotice();
    try {
      const clientCreatePayload = buildCreateClientDto(values);
      const created = await create(clientCreatePayload);
      hasCommittedSubmitRef.current = true;
      clearDraft();
      if (embedded && onClientCreated) {
        onClientCreated(created);
        return;
      }
      router.push(`/clients/${created.id}`);
    } catch {
      // API error is surfaced via `error` from useCreateClient.
    }
  };

  const isFormReady = hasMounted && isDraftReady && isDraftApplied;

  return (
    <div className={embedded ? "w-full" : "mx-auto w-full max-w-3xl"}>
      <div className="mb-6 space-y-1">
        <h1 className={embedded ? "text-base font-semibold" : "text-2xl font-semibold tracking-tight"}>
          კლიენტის დამატება
        </h1>
        {!embedded ? (
          <p className="text-sm text-muted-foreground">
            შეავსეთ ქვემოთ მოცემული ველები ახალი კლიენტის დასამატებლად.
          </p>
        ) : null}
        {!embedded ? <ClientFormLockHint /> : null}
      </div>

      {!isFormReady ? (
        <p className="text-sm text-muted-foreground">იტვირთება…</p>
      ) : null}

      {isFormReady ? (
      <form
        onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
        onKeyDown={preventImplicitFormSubmitOnEnter}
        className="space-y-8"
        noValidate
      >
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
          clientStatusSelectOptions={CLIENT_CREATE_STATUSES.map((clientStatus) => ({
            value: clientStatus,
            label: CLIENT_STATUS_LABELS[clientStatus],
          }))}
        />

        <ClientLocationSection control={control} setValue={setValue} />

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

        <ClientFormRequiredFieldsSummary visible={showRequiredFieldsSummary} />

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              if (embedded && onCancelEmbedded) {
                onCancelEmbedded();
                return;
              }
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
      ) : null}
    </div>
  );
}
