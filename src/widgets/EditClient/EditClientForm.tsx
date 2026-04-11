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
import type { ClientDetail, UpdateClientDto } from "@/features/clients/types";
import { ClientCoreInfoSection } from "@/widgets/ClientForm/ClientCoreInfoSection";
import { ClientLocationSection } from "@/widgets/ClientForm/ClientLocationSection";
import { ClientBudgetSection } from "@/widgets/ClientForm/ClientBudgetSection";
import { ClientRequirementsSection } from "@/widgets/ClientForm/ClientRequirementsSection";
import { ClientRelatedPersonsSection } from "@/widgets/ClientForm/ClientRelatedPersonsSection";

type EditClientFormProps = {
  clientId: string;
};

function buildDefaultValues(client: ClientDetail): ClientFormValues {
  const req = client.requirements;
  return {
    name: client.name,
    phones: client.phones.length > 0 ? client.phones : [""],
    whatsapp: client.whatsapp ?? "",
    budgetMin: client.budgetMin ?? undefined,
    budgetMax: client.budgetMax ?? undefined,
    dealType: client.dealType,
    description: client.description,
    pet: client.pet ?? "",
    districts: client.districts,
    addresses: client.addresses,
    status: client.status,
    reminderDate: client.reminderDate ?? "",
    relatedPersons: client.relatedPersons.map((person) => ({
      name: person.name,
      phone: person.phone ?? "",
      whatsapp: person.whatsapp ?? "",
      relationship: person.relationship ?? "",
      note: person.note ?? "",
    })),
    minRooms: req?.minRooms ?? undefined,
    minBedrooms: req?.minBedrooms ?? undefined,
    minFloor: req?.minFloor ?? undefined,
    maxFloor: req?.maxFloor ?? undefined,
    excludeLastFloor: req?.excludeLastFloor ?? undefined,
    renovation: req?.renovation ?? undefined,
    buildingCondition: req?.buildingCondition ?? undefined,
    projectExclude: req?.projectExclude ?? [],
    minArea: req?.minArea ?? undefined,
    hasBalcony: req?.hasBalcony ?? undefined,
    balconyAreaMin: req?.balconyAreaMin ?? undefined,
    balconyAreaMax: req?.balconyAreaMax ?? undefined,
    goodView: req?.goodView ?? undefined,
    elevator: req?.elevator ?? undefined,
    centralHeating: req?.centralHeating ?? undefined,
    airConditioner: req?.airConditioner ?? undefined,
    kitchenType: req?.kitchenType ?? undefined,
    furnished: req?.furnished ?? undefined,
    minBathrooms: req?.minBathrooms ?? undefined,
    parking: req?.parking ?? undefined,
    minRentalPeriod: req?.minRentalPeriod ?? undefined,
  };
}

function buildUpdateDto(values: ClientFormValues): UpdateClientDto {
  const dto: UpdateClientDto = {
    name: values.name,
    phones: values.phones,
    dealType: values.dealType,
    description: values.description,
    districts: values.districts,
    addresses: values.addresses,
    status: values.status === "" ? undefined : values.status,
  };

  dto.whatsapp = values.whatsapp || undefined;
  dto.budgetMin = values.budgetMin;
  dto.budgetMax = values.budgetMax;
  dto.pet = values.pet || undefined;
  dto.reminderDate = values.reminderDate || null;

  const validPersons = (values.relatedPersons ?? []).filter(
    (person) => person.name?.trim(),
  );
  dto.relatedPersons = validPersons;

  dto.minRooms = values.minRooms;
  dto.minBedrooms = values.minBedrooms;
  dto.minFloor = values.minFloor;
  dto.maxFloor = values.maxFloor;
  dto.excludeLastFloor = values.excludeLastFloor;
  dto.renovation = values.renovation;
  dto.buildingCondition = values.buildingCondition;
  dto.projectExclude = values.projectExclude ?? [];
  dto.minArea = values.minArea;
  dto.hasBalcony = values.hasBalcony;
  dto.balconyAreaMin = values.balconyAreaMin;
  dto.balconyAreaMax = values.balconyAreaMax;
  dto.goodView = values.goodView;
  dto.elevator = values.elevator;
  dto.centralHeating = values.centralHeating;
  dto.airConditioner = values.airConditioner;
  dto.kitchenType = values.kitchenType;
  dto.furnished = values.furnished;
  dto.minBathrooms = values.minBathrooms;
  dto.parking = values.parking;
  dto.minRentalPeriod = values.minRentalPeriod;

  return dto;
}

function EditClientFormInner({
  client,
  clientId,
}: {
  client: ClientDetail;
  clientId: string;
}) {
  const router = useRouter();
  const { update, isLoading, error } = useUpdateClient();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema) as Resolver<ClientFormValues>,
    defaultValues: buildDefaultValues(client),
  });

  useEffect(() => {
    reset(buildDefaultValues(client));
  }, [client, reset]);

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
  const isRentDeal = selectedDealType === "RENT" || selectedDealType === "DAILY_RENT";

  const onSubmit = async (values: ClientFormValues) => {
    const dto = buildUpdateDto(values);
    await update(clientId, dto);
    router.push(`/clients/${clientId}`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <button
        type="button"
        onClick={() => router.push(`/clients/${clientId}`)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to client
      </button>

      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Edit client</h1>
        <p className="text-sm text-slate-600">Update the client&apos;s details below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        <ClientCoreInfoSection
          register={register}
          errors={errors}
          phoneFields={phoneFields}
          appendPhone={appendPhone}
          removePhone={removePhone}
          showReminderHint
        />

        <ClientLocationSection
          register={register}
          defaultDistrictsText={client.districts.join("\n")}
          defaultAddressesText={client.addresses.join("\n")}
        />

        <ClientBudgetSection register={register} errors={errors} />

        <ClientRequirementsSection register={register} errors={errors} isRentDeal={isRentDeal} />

        <ClientRelatedPersonsSection
          register={register}
          personFields={personFields}
          appendPerson={appendPerson}
          removePerson={removePerson}
        />

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push(`/clients/${clientId}`)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function EditClientForm({ clientId }: EditClientFormProps) {
  const router = useRouter();
  const { client, isLoading, error } = useClientDetails(clientId);

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading client…</p>;
  }

  if (error || !client) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => router.push("/clients")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to clients
        </button>
        <p className="text-sm text-red-600" role="alert">
          {error ?? "Client not found."}
        </p>
      </div>
    );
  }

  return <EditClientFormInner client={client} clientId={clientId} />;
}
