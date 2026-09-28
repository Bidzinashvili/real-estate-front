"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useClientDetails } from "@/features/clients/useClientDetails";
import { useUpdateClient } from "@/features/clients/useUpdateClient";
import { clientFormSchema } from "@/features/clients/clientFormSchema";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import type { ClientDetail } from "@/features/clients/types";
import { buildUpdateClientDto } from "@/features/clients/buildCreateClientDto";
import { mapClientDetailToFormValues } from "@/features/clients/mapClientToFormValues";
import {
  CLIENT_EDIT_STATUSES,
  CLIENT_STATUS_LABELS,
  type ClientStatus,
} from "@/features/clients/clientEnums";
import { ClientCoreInfoSection } from "@/widgets/ClientForm/ClientCoreInfoSection";
import { ClientLocationSection } from "@/widgets/ClientForm/ClientLocationSection";
import { ClientBudgetSection } from "@/widgets/ClientForm/ClientBudgetSection";
import { ClientRequirementsSection } from "@/widgets/ClientForm/ClientRequirementsSection";
import { ClientRelatedPersonsSection } from "@/widgets/ClientForm/ClientRelatedPersonsSection";
import { ClientFormLockHint } from "@/widgets/ClientForm/PreferenceLockButton";
import { MatchPercentActions } from "@/widgets/Matching/MatchPercentActions";
import { collectClientFormTemporaryLocks } from "@/features/matching/collectTemporaryLocks";
import { clientMatchesHref } from "@/features/matching/matchingRoutes";
import { canRunClientMatches } from "@/features/matching/canRunClientMatches";
import { useEffectiveAccessViewer } from "@/features/adminMode/useEffectiveAccessViewer";
import { viewerCanManageRecord } from "@/features/databaseList/viewerOwnership";
import { ui } from "@/shared/i18n/ui";
import { preventImplicitFormSubmitOnEnter } from "@/shared/lib/preventImplicitFormSubmitOnEnter";
import { ClientFormRequiredFieldsSummary } from "@/widgets/ClientForm/ClientFormRequiredFieldsSummary";
import { useClientFormValidationNotice } from "@/widgets/ClientForm/useClientFormValidationNotice";
import { NoteRemindersSection } from "@/widgets/Reminders/NoteRemindersSection";
import {
  archiveRecordBackLabel,
  carryArchiveNavigation,
  isOpenedFromArchiveLocation,
  recordListHref,
} from "@/features/lifecycle/archiveNavigation";
import { useOpenedFromArchive } from "@/features/lifecycle/useOpenedFromArchive";

type EditClientFormProps = {
  clientId: string;
};

function EditClientFormInner({
  client,
  clientId,
}: {
  client: ClientDetail;
  clientId: string;
}) {
  const router = useRouter();
  const accessViewer = useEffectiveAccessViewer();
  const { update, isLoading, error } = useUpdateClient();
  const canRunMatches = canRunClientMatches(accessViewer, client);
  const canEditClient = viewerCanManageRecord(client, accessViewer);

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
    defaultValues: mapClientDetailToFormValues(client),
  });

  useEffect(() => {
    reset(mapClientDetailToFormValues(client));
  }, [client, reset]);

  useEffect(() => {
    if (!canEditClient) {
      router.replace(`/clients/${clientId}`);
    }
  }, [canEditClient, clientId, router]);

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

  const selectedDealType = watch("dealType");
  const watchedFormValues = watch();
  const isRentDeal = selectedDealType === "RENT" || selectedDealType === "DAILY_RENT";
  const temporaryLockedFields = collectClientFormTemporaryLocks(watchedFormValues);
  const {
    showRequiredFieldsSummary,
    onInvalidSubmit,
    clearValidationNotice,
  } = useClientFormValidationNotice();

  const clientDetailHref = () => carryArchiveNavigation(`/clients/${clientId}`);

  const onSubmit = async (values: ClientFormValues) => {
    clearValidationNotice();
    const dto = buildUpdateClientDto(values);
    await update(clientId, dto);
    router.push(clientDetailHref());
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <button
        type="button"
        onClick={() => router.push(clientDetailHref())}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        კლიენტზე დაბრუნება
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">კლიენტის რედაქტირება</h1>
          <p className="text-sm text-muted-foreground">განაახლეთ კლიენტის მონაცემები.</p>
          <ClientFormLockHint />
        </div>
        {canRunMatches ? (
          <MatchPercentActions
            allHref={clientMatchesHref(clientId, "GLOBAL")}
            mineHref={clientMatchesHref(clientId, "MINE")}
            allLabel={`${ui.matchAll}: ${ui.allListings}`}
            mineLabel={`${ui.matchMine}: ${ui.myListings}`}
            sessionKind="client"
            entityId={clientId}
            temporaryLockedFields={temporaryLockedFields}
          />
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
        onKeyDown={preventImplicitFormSubmitOnEnter}
        className="space-y-8"
        noValidate
      >
        <NoteRemindersSection
          targetType="CLIENT"
          clientId={clientId}
          canManage={canEditClient}
        />

        <ClientCoreInfoSection
          control={control}
          register={register}
          setValue={setValue}
          errors={errors}
          phoneFields={phoneFields}
          appendPhone={appendPhone}
          removePhone={removePhone}
          isRentDeal={isRentDeal}
          showReminderHint
          showReminderDateField={false}
          clientStatusSelectOptions={(CLIENT_EDIT_STATUSES.includes(
            client.status as (typeof CLIENT_EDIT_STATUSES)[number],
          )
            ? [...CLIENT_EDIT_STATUSES]
            : [client.status, ...CLIENT_EDIT_STATUSES]
          ).map((clientStatus: ClientStatus) => ({
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
            onClick={() => router.push(clientDetailHref())}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            გაუქმება
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "ინახება…" : "ცვლილებების შენახვა"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function EditClientForm({ clientId }: EditClientFormProps) {
  const router = useRouter();
  const openedFromArchive = useOpenedFromArchive();
  const { client, isLoading, error } = useClientDetails(clientId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">კლიენტი იტვირთება…</p>;
  }

  if (error || !client) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={() =>
            router.push(recordListHref("client", isOpenedFromArchiveLocation()))
          }
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {archiveRecordBackLabel("client", openedFromArchive)}
        </button>
        <p className="text-sm text-destructive" role="alert">
          {error ?? "კლიენტი ვერ მოიძებნა."}
        </p>
      </div>
    );
  }

  return <EditClientFormInner client={client} clientId={clientId} />;
}
