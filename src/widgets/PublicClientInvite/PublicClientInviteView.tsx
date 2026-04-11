"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, type Resolver, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientFormSchema } from "@/features/clients/clientFormSchema";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import { buildCreateClientDto } from "@/features/clients/buildCreateClientDto";
import { usePublicClientInvite } from "@/features/clientInviteLinks/usePublicClientInvite";
import { useSubmitPublicClientInvite } from "@/features/clientInviteLinks/useSubmitPublicClientInvite";
import { buildPublicInviteFormSchemaDerived } from "@/features/clientInviteLinks/formSchemaHints";
import { ClientCoreInfoSection } from "@/widgets/ClientForm/ClientCoreInfoSection";
import { ClientLocationSection } from "@/widgets/ClientForm/ClientLocationSection";
import { ClientBudgetSection } from "@/widgets/ClientForm/ClientBudgetSection";
import { ClientRequirementsSection } from "@/widgets/ClientForm/ClientRequirementsSection";
import type { Client } from "@/features/clients/types";

type PublicClientInviteViewProps = {
  inviteToken: string;
};

export function PublicClientInviteView({ inviteToken }: PublicClientInviteViewProps) {
  const loadState = usePublicClientInvite(inviteToken);
  const { submit, isLoading: isSubmitting, error: submitError } =
    useSubmitPublicClientInvite();
  const [createdClient, setCreatedClient] = useState<Client | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema) as Resolver<ClientFormValues>,
    defaultValues: {
      name: "",
      phones: [""],
      whatsapp: "",
      dealType: "SALE",
      description: "",
      pet: "",
      districts: [],
      addresses: [],
      projectExclude: [],
    },
  });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({ control, name: "phones" as never });

  const selectedDealType = watch("dealType");
  const isRentDeal = selectedDealType === "RENT" || selectedDealType === "DAILY_RENT";

  const formSchemaData = loadState.status === "success" ? loadState.data.formSchema : null;

  const formSchemaDerived = useMemo(
    () => buildPublicInviteFormSchemaDerived(formSchemaData),
    [formSchemaData],
  );

  useEffect(() => {
    if (!submitError || submitError.kind !== "field" || !submitError.fieldErrors) {
      return;
    }
    for (const [fieldKey, messages] of Object.entries(submitError.fieldErrors)) {
      const message = messages[0];
      if (message) {
        setError(fieldKey as Path<ClientFormValues>, { message });
      }
    }
  }, [submitError, setError]);

  const onSubmit = async (values: ClientFormValues) => {
    clearErrors();
    const dto = buildCreateClientDto(values);
    const result = await submit(inviteToken, dto);
    if (result) {
      setCreatedClient(result);
    }
  };

  if (loadState.status === "loading") {
    return (
      <p className="text-center text-sm text-slate-600" role="status">
        Loading form…
      </p>
    );
  }

  if (loadState.status === "not_found") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-700 shadow-sm">
        This invite link was not found.
      </div>
    );
  }

  if (loadState.status === "gone") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-700 shadow-sm">
        This link has expired or has already been used.
      </div>
    );
  }

  if (loadState.status === "rate_limited") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-900">
        Too many requests. Please wait a few minutes and try again.
      </div>
    );
  }

  if (loadState.status === "error") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-800">
        {loadState.message}
      </div>
    );
  }

  if (createdClient) {
    return (
      <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-emerald-900">Thank you</h1>
        <p className="text-sm text-emerald-800">
          Your details were submitted successfully. Reference:{" "}
          <span className="font-mono font-medium">{createdClient.id}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 space-y-1 text-center sm:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Property requirements</h1>
        <p className="text-sm text-slate-600">
          Share what you are looking for. Fields marked with * are required.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        <ClientCoreInfoSection
          register={register}
          errors={errors}
          phoneFields={phoneFields}
          appendPhone={appendPhone}
          removePhone={removePhone}
          showClientStatusField={false}
          showReminderDateField={false}
          fieldDescriptions={formSchemaDerived.fieldDescriptions}
          dealTypeSelectOptions={formSchemaDerived.dealTypeSelectOptions}
        />

        <ClientLocationSection
          register={register}
          fieldDescriptions={formSchemaDerived.fieldDescriptions}
        />

        <ClientBudgetSection
          register={register}
          errors={errors}
          fieldDescriptions={formSchemaDerived.fieldDescriptions}
        />

        <ClientRequirementsSection
          register={register}
          errors={errors}
          isRentDeal={isRentDeal}
          fieldDescriptions={formSchemaDerived.fieldDescriptions}
          renovationSelectOptions={formSchemaDerived.renovationSelectOptions}
          buildingConditionSelectOptions={formSchemaDerived.buildingConditionSelectOptions}
          kitchenTypeSelectOptions={formSchemaDerived.kitchenTypeSelectOptions}
        />

        {submitError && submitError.kind !== "field" && (
          <p className="text-sm text-red-600" role="alert">
            {submitError.message}
          </p>
        )}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
