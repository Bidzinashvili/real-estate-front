import { z } from "zod";
import {
  DEAL_TYPES,
  CLIENT_STATUSES,
  RENOVATION_VALUES,
  BUILDING_CONDITIONS,
  KITCHEN_TYPES,
} from "@/features/clients/clientEnums";
import type { LockState } from "@/features/clients/clientApi.types";
import { CLIENT_PREFERENCE_VALUES } from "@/features/matching/matchingEnums";

const LOCK_STATES: [LockState, LockState, LockState] = ["none", "locked", "frozen"];

export const lockStateSchema = z.enum(LOCK_STATES);

const lockStateFieldSchema = z.preprocess((candidate): LockState => {
  if (candidate === "frozen") {
    return "frozen";
  }
  if (candidate === "locked") {
    return "locked";
  }
  return "none";
}, lockStateSchema);

const relatedPersonSchema = z.object({
  name: z.string().max(500).optional().default(""),
  phone: z.string().max(64).optional().default(""),
  whatsapp: z.string().max(64).optional().default(""),
  relationship: z.string().max(200).optional().default(""),
  note: z.string().max(2000).optional().default(""),
});

const optionalNumberNaNToUndefined = z.preprocess((input) => {
  if (typeof input === "number" && Number.isNaN(input)) {
    return undefined;
  }
  return input;
}, z.number().optional());

const lockedStringArrayFieldSchema = z.object({
  value: z.array(z.string().max(200)).max(100),
  lock: lockStateFieldSchema,
});

const lockedPartialNumberFieldSchema = z.object({
  value: optionalNumberNaNToUndefined,
  lock: lockStateFieldSchema,
});

const lockedPartialStringFieldSchema = z.object({
  value: z.union([z.string().max(200), z.literal("")]).optional(),
  lock: lockStateFieldSchema,
});

const lockedNumberFieldSchema = z.object({
  value: optionalNumberNaNToUndefined,
  lock: lockStateFieldSchema,
});

const lockedIntNonNegFieldSchema = z.object({
  value: z.preprocess(
    (input) => (typeof input === "number" && Number.isNaN(input) ? undefined : input),
    z.number().int().min(0).optional(),
  ),
  lock: lockStateFieldSchema,
});

const lockedIntFieldSchema = z.object({
  value: z.preprocess(
    (input) => (typeof input === "number" && Number.isNaN(input) ? undefined : input),
    z.number().int().optional(),
  ),
  lock: lockStateFieldSchema,
});

const lockedBooleanFieldSchema = z.object({
  value: z.boolean().optional(),
  lock: lockStateFieldSchema,
});

const lockedPreferenceFieldSchema = z.object({
  value: z.enum(CLIENT_PREFERENCE_VALUES),
  lock: lockStateFieldSchema,
});

const lockedRenovationsFieldSchema = z.object({
  value: z.array(z.enum(RENOVATION_VALUES)).max(20).default([]),
  lock: lockStateFieldSchema,
});

const lockedPartialBuildingConditionFieldSchema = z.object({
  value: z.union([z.enum(BUILDING_CONDITIONS), z.literal("")]).optional(),
  lock: lockStateFieldSchema,
});

const lockedPartialKitchenTypeFieldSchema = z.object({
  value: z.union([z.enum(KITCHEN_TYPES), z.literal("")]).optional(),
  lock: lockStateFieldSchema,
});

const lockedStringArrayListFieldSchema = z.object({
  value: z.array(z.string()).max(100).default([]),
  lock: lockStateFieldSchema,
});

export const clientFormSchema = z
  .object({
    name: z.string().min(1, "სახელი სავალდებულოა").max(500),
    phones: z
      .array(z.string().min(1, "ტელეფონი არ შეიძლება იყოს ცარიელი"))
      .min(1, "საჭიროა მინიმუმ ერთი ტელეფონი")
      .max(50),
    whatsapp: z.string().max(64).optional().or(z.literal("")),
    budgetMin: lockedPartialNumberFieldSchema,
    budgetMax: lockedPartialNumberFieldSchema,
    dealType: z.enum(DEAL_TYPES),
    description: z.string().min(1, "აღწერა სავალდებულოა").max(20000),
    pet: lockedPartialStringFieldSchema,
    districts: lockedStringArrayFieldSchema,
    addresses: lockedStringArrayFieldSchema,
    labels: lockedStringArrayFieldSchema,
    status: z.union([z.enum(CLIENT_STATUSES), z.literal("")]).optional(),
    reminderDate: z.string().optional().or(z.literal("")),
    relatedPersons: z.array(relatedPersonSchema).max(100).optional().default([]),
    minRooms: lockedIntNonNegFieldSchema,
    maxRooms: lockedIntNonNegFieldSchema,
    minBedrooms: lockedIntNonNegFieldSchema,
    maxBedrooms: lockedIntNonNegFieldSchema,
    minFloor: lockedIntFieldSchema,
    maxFloor: lockedIntFieldSchema,
    excludeLastFloor: lockedBooleanFieldSchema,
    renovations: lockedRenovationsFieldSchema,
    buildingCondition: lockedPartialBuildingConditionFieldSchema,
    projectExclude: lockedStringArrayListFieldSchema,
    minArea: lockedNumberFieldSchema,
    maxArea: lockedNumberFieldSchema,
    hasBalcony: lockedPreferenceFieldSchema,
    balconyAreaMin: lockedNumberFieldSchema,
    balconyAreaMax: lockedNumberFieldSchema,
    goodView: lockedPreferenceFieldSchema,
    elevator: lockedPreferenceFieldSchema,
    centralHeating: lockedPreferenceFieldSchema,
    airConditioner: lockedPreferenceFieldSchema,
    kitchenType: lockedPartialKitchenTypeFieldSchema,
    furnished: lockedPreferenceFieldSchema,
    minBathrooms: lockedIntNonNegFieldSchema,
    maxBathrooms: lockedIntNonNegFieldSchema,
    parking: lockedPreferenceFieldSchema,
    minRentalPeriod: lockedPartialNumberFieldSchema,
  })
  .superRefine((data, context) => {
    const budgetMinVal = data.budgetMin.value;
    const budgetMaxVal = data.budgetMax.value;
    if (
      budgetMinVal !== undefined &&
      budgetMaxVal !== undefined &&
      budgetMinVal > budgetMaxVal
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "მინიმალური ბიუჯეტი არ უნდა აღემატებოდეს მაქსიმალურს",
        path: ["budgetMin", "value"],
      });
    }

    const roomsMinVal = data.minRooms.value;
    const roomsMaxVal = data.maxRooms?.value;
    if (roomsMinVal !== undefined && roomsMaxVal !== undefined && roomsMinVal > roomsMaxVal) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ოთახების მინიმუმი არ უნდა აღემატებოდეს მაქსიმუმს",
        path: ["minRooms", "value"],
      });
    }

    const bedroomsMinVal = data.minBedrooms.value;
    const bedroomsMaxVal = data.maxBedrooms?.value;
    if (
      bedroomsMinVal !== undefined &&
      bedroomsMaxVal !== undefined &&
      bedroomsMinVal > bedroomsMaxVal
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "საძინებლების მინიმუმი არ უნდა აღემატებოდეს მაქსიმუმს",
        path: ["minBedrooms", "value"],
      });
    }

    const minFloorVal = data.minFloor.value;
    const maxFloorVal = data.maxFloor.value;
    if (
      minFloorVal !== undefined &&
      maxFloorVal !== undefined &&
      minFloorVal > maxFloorVal
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "მინიმალური სართული არ უნდა აღემატებოდეს მაქსიმალურს",
        path: ["minFloor", "value"],
      });
    }

    const bathroomsMinVal = data.minBathrooms.value;
    const bathroomsMaxVal = data.maxBathrooms?.value;
    if (
      bathroomsMinVal !== undefined &&
      bathroomsMaxVal !== undefined &&
      bathroomsMinVal > bathroomsMaxVal
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "სველი წერტილების მინიმუმი არ უნდა აღემატებოდეს მაქსიმუმს",
        path: ["minBathrooms", "value"],
      });
    }

    const areaMinVal = data.minArea.value;
    const areaMaxVal = data.maxArea?.value;
    if (areaMinVal !== undefined && areaMaxVal !== undefined && areaMinVal > areaMaxVal) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ფართობის მინიმუმი არ უნდა აღემატებოდეს მაქსიმუმს",
        path: ["minArea", "value"],
      });
    }

    const balconyMinVal = data.balconyAreaMin.value;
    const balconyMaxVal = data.balconyAreaMax.value;
    if (
      balconyMinVal !== undefined &&
      balconyMaxVal !== undefined &&
      balconyMinVal > balconyMaxVal
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "აივნის ფართობის მინიმუმი არ უნდა აღემატებოდეს მაქსიმუმს",
        path: ["balconyAreaMin", "value"],
      });
    }

    const minRentalVal = data.minRentalPeriod.value;
    if (
      minRentalVal !== undefined &&
      data.dealType !== "RENT" &&
      data.dealType !== "DAILY_RENT"
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "მინიმალური ქირის ვადა მხოლოდ ქირავნობისთვისაა",
        path: ["minRentalPeriod", "value"],
      });
    }
  });

export type ClientFormValues = z.infer<typeof clientFormSchema>;

export const emptyClientFormDefaults: ClientFormValues = {
  name: "",
  phones: ["+995"],
  whatsapp: "+995",
  status: "",
  reminderDate: "",
  budgetMin: { value: undefined, lock: "none" },
  budgetMax: { value: undefined, lock: "none" },
  dealType: "SALE",
  description: "",
  pet: { value: "", lock: "none" },
  districts: { value: [], lock: "none" },
  addresses: { value: [], lock: "none" },
  labels: { value: [], lock: "none" },
  relatedPersons: [],
  minRooms: { value: undefined, lock: "none" },
  maxRooms: { value: undefined, lock: "none" },
  minBedrooms: { value: undefined, lock: "none" },
  maxBedrooms: { value: undefined, lock: "none" },
  minFloor: { value: undefined, lock: "none" },
  maxFloor: { value: undefined, lock: "none" },
  excludeLastFloor: { value: false, lock: "none" },
  renovations: { value: [], lock: "none" },
  buildingCondition: { value: "", lock: "none" },
  projectExclude: { value: [], lock: "none" },
  minArea: { value: undefined, lock: "none" },
  maxArea: { value: undefined, lock: "none" },
  hasBalcony: { value: "NOT_SET", lock: "none" },
  balconyAreaMin: { value: undefined, lock: "none" },
  balconyAreaMax: { value: undefined, lock: "none" },
  goodView: { value: "NOT_SET", lock: "none" },
  elevator: { value: "NOT_SET", lock: "none" },
  centralHeating: { value: "NOT_SET", lock: "none" },
  airConditioner: { value: "NOT_SET", lock: "none" },
  kitchenType: { value: "", lock: "none" },
  furnished: { value: "NOT_SET", lock: "none" },
  minBathrooms: { value: undefined, lock: "none" },
  maxBathrooms: { value: undefined, lock: "none" },
  parking: { value: "NOT_SET", lock: "none" },
  minRentalPeriod: { value: undefined, lock: "none" },
};
