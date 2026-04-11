import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import type { CreateClientDto } from "@/features/clients/types";

export function buildCreateClientDto(values: ClientFormValues): CreateClientDto {
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
