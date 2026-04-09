import { z } from "zod";
import {
  DEAL_TYPES,
  CLIENT_STATUSES,
  RENOVATION_VALUES,
  BUILDING_CONDITIONS,
  KITCHEN_TYPES,
} from "@/features/clients/clientEnums";

const relatedPersonSchema = z.object({
  name: z.string().max(500).optional().default(""),
  phone: z.string().max(64).optional().default(""),
  whatsapp: z.string().max(64).optional().default(""),
  relationship: z.string().max(200).optional().default(""),
  note: z.string().max(2000).optional().default(""),
});

export const clientFormSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(500),
    phones: z
      .array(z.string().min(1, "Phone cannot be empty"))
      .min(1, "At least one phone is required")
      .max(50),
    whatsapp: z.string().max(64).optional().or(z.literal("")),
    budgetMin: z.number().optional(),
    budgetMax: z.number().optional(),
    dealType: z.enum(DEAL_TYPES),
    description: z.string().min(1, "Description is required").max(20000),
    pet: z.string().max(200).optional().or(z.literal("")),
    districts: z.array(z.string().min(1)).max(100).default([]),
    addresses: z.array(z.string().min(1)).max(200).default([]),
    status: z.enum(CLIENT_STATUSES).optional(),
    reminderDate: z.string().optional().or(z.literal("")),
    relatedPersons: z.array(relatedPersonSchema).max(100).optional().default([]),
    minRooms: z.number().int().min(0).optional(),
    minBedrooms: z.number().int().min(0).optional(),
    minFloor: z.number().int().optional(),
    maxFloor: z.number().int().optional(),
    excludeLastFloor: z.boolean().optional(),
    renovation: z.enum(RENOVATION_VALUES).optional(),
    buildingCondition: z.enum(BUILDING_CONDITIONS).optional(),
    projectExclude: z.array(z.string()).max(100).optional().default([]),
    minArea: z.number().min(0).optional(),
    hasBalcony: z.boolean().optional(),
    balconyAreaMin: z.number().min(0).optional(),
    balconyAreaMax: z.number().min(0).optional(),
    goodView: z.boolean().optional(),
    elevator: z.boolean().optional(),
    centralHeating: z.boolean().optional(),
    airConditioner: z.boolean().optional(),
    kitchenType: z.enum(KITCHEN_TYPES).optional(),
    furnished: z.boolean().optional(),
    minBathrooms: z.number().int().min(0).optional(),
    parking: z.boolean().optional(),
    minRentalPeriod: z.number().int().min(1).optional(),
  })
  .superRefine((data, context) => {
    if (
      data.budgetMin !== undefined &&
      data.budgetMax !== undefined &&
      data.budgetMin > data.budgetMax
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Budget min must be less than or equal to budget max",
        path: ["budgetMin"],
      });
    }

    if (
      data.minFloor !== undefined &&
      data.maxFloor !== undefined &&
      data.minFloor > data.maxFloor
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Min floor must be less than or equal to max floor",
        path: ["minFloor"],
      });
    }

    if (
      data.balconyAreaMin !== undefined &&
      data.balconyAreaMax !== undefined &&
      data.balconyAreaMin > data.balconyAreaMax
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Balcony area min must be less than or equal to max",
        path: ["balconyAreaMin"],
      });
    }

    if (
      data.minRentalPeriod !== undefined &&
      data.dealType !== "RENT" &&
      data.dealType !== "DAILY_RENT"
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Min rental period is only valid for Rent or Daily rent",
        path: ["minRentalPeriod"],
      });
    }
  });

export type ClientFormValues = z.infer<typeof clientFormSchema>;
