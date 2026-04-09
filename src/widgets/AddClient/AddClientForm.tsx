"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateClient } from "@/features/clients/useCreateClient";
import { clientFormSchema } from "@/features/clients/clientFormSchema";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import type { CreateClientDto } from "@/features/clients/types";
import { ClientCoreInfoSection } from "@/widgets/ClientForm/ClientCoreInfoSection";
import { ClientLocationSection } from "@/widgets/ClientForm/ClientLocationSection";
import { ClientBudgetSection } from "@/widgets/ClientForm/ClientBudgetSection";
import { ClientRequirementsSection } from "@/widgets/ClientForm/ClientRequirementsSection";
import { ClientRelatedPersonsSection } from "@/widgets/ClientForm/ClientRelatedPersonsSection";

function buildCreateDto(values: ClientFormValues): CreateClientDto {
  const dto: CreateClientDto = {
    name: values.name,
    phones: values.phones,
    dealType: values.dealType,
    description: values.description,
    districts: values.districts,
    addresses: values.addresses,
  };

  if (values.whatsapp) dto.whatsapp = values.whatsapp;
  if (values.budgetMin !== undefined) dto.budgetMin = values.budgetMin;
  if (values.budgetMax !== undefined) dto.budgetMax = values.budgetMax;
  if (values.pet) dto.pet = values.pet;
  if (values.status) dto.status = values.status;
  if (values.reminderDate) dto.reminderDate = values.reminderDate;

  const validPersons = (values.relatedPersons ?? []).filter(
    (person) => person.name?.trim(),
  );
  if (validPersons.length > 0) dto.relatedPersons = validPersons;

  if (values.minRooms !== undefined) dto.minRooms = values.minRooms;
  if (values.minBedrooms !== undefined) dto.minBedrooms = values.minBedrooms;
  if (values.minFloor !== undefined) dto.minFloor = values.minFloor;
  if (values.maxFloor !== undefined) dto.maxFloor = values.maxFloor;
  if (values.excludeLastFloor !== undefined) dto.excludeLastFloor = values.excludeLastFloor;
  if (values.renovation) dto.renovation = values.renovation;
  if (values.buildingCondition) dto.buildingCondition = values.buildingCondition;
  if (values.projectExclude && values.projectExclude.length > 0)
    dto.projectExclude = values.projectExclude;
  if (values.minArea !== undefined) dto.minArea = values.minArea;
  if (values.hasBalcony !== undefined) dto.hasBalcony = values.hasBalcony;
  if (values.balconyAreaMin !== undefined) dto.balconyAreaMin = values.balconyAreaMin;
  if (values.balconyAreaMax !== undefined) dto.balconyAreaMax = values.balconyAreaMax;
  if (values.goodView !== undefined) dto.goodView = values.goodView;
  if (values.elevator !== undefined) dto.elevator = values.elevator;
  if (values.centralHeating !== undefined) dto.centralHeating = values.centralHeating;
  if (values.airConditioner !== undefined) dto.airConditioner = values.airConditioner;
  if (values.kitchenType) dto.kitchenType = values.kitchenType;
  if (values.furnished !== undefined) dto.furnished = values.furnished;
  if (values.minBathrooms !== undefined) dto.minBathrooms = values.minBathrooms;
  if (values.parking !== undefined) dto.parking = values.parking;
  if (values.minRentalPeriod !== undefined) dto.minRentalPeriod = values.minRentalPeriod;

  return dto;
}

export function AddClientForm() {
  const router = useRouter();
  const { create, isLoading, error } = useCreateClient();

  const {
    register,
    handleSubmit,
    control,
    watch,
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
      relatedPersons: [],
      projectExclude: [],
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

  const selectedDealType = watch("dealType");
  const isRentDeal = selectedDealType === "RENT" || selectedDealType === "DAILY_RENT";

  const onSubmit = async (values: ClientFormValues) => {
    const dto = buildCreateDto(values);
    const created = await create(dto);
    router.push(`/clients/${created.id}`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Add client</h1>
        <p className="text-sm text-slate-600">Fill in the details below to create a new lead.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        <ClientCoreInfoSection
          register={register}
          errors={errors}
          phoneFields={phoneFields}
          appendPhone={appendPhone}
          removePhone={removePhone}
          showDefaultStatusOption
        />

        <ClientLocationSection register={register} />

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
            onClick={() => router.push("/clients")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Saving…" : "Save client"}
          </button>
        </div>
      </form>
    </div>
  );
}
