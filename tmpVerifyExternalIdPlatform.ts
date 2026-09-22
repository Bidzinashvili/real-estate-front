import { initialFormState } from "@/features/properties/addPropertyFormState";
import { buildCreatePropertyPayload } from "@/features/properties/addPropertyFormPayload";
import { parseExternalIdPlatform } from "@/features/properties/propertyModelTypes";
import { normalizeProperty } from "@/features/properties/propertyRecordNormalizer";
import { getApiErrorMessage, parseStandardApiError } from "@/shared/lib/apiError";
import { INVALID_EXTERNAL_ID_PLATFORM_MESSAGE } from "@/shared/i18n/ui";
import { EXTERNAL_ID_PLATFORM_LABELS, lookupEnumLabel } from "@/shared/i18n/enumLabels";

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  const actualText = JSON.stringify(actual);
  const expectedText = JSON.stringify(expected);
  if (actualText !== expectedText) {
    throw new Error(`${label}: expected ${expectedText}, got ${actualText}`);
  }
}

const parsedBackendPlatform = parseExternalIdPlatform("SS_GE");
const parsedLegacyPlatform = parseExternalIdPlatform("SSGE");
assertEqual(parsedBackendPlatform, "SS_GE", "parse SS_GE");
assertEqual(parsedLegacyPlatform, "SS_GE", "parse legacy SSGE");
assertEqual(parseExternalIdPlatform("MYHOME"), "MYHOME", "parse MYHOME");

const form = initialFormState();
form.address = "რუსთაველის 1";
form.pricePublic = "1000";
form.apartment.totalArea = "50";
form.apartment.rooms = "2";
form.apartment.bedrooms = "1";
form.apartment.floor = "3";
form.apartment.totalFloors = "10";
form.apartment.minRentalPeriod = "1";
form.externalIds = [
  {
    localId: "local-ssge",
    platform: "SS_GE",
    value: "123456",
    enteredAt: "2026-09-22T00:00:00.000Z",
    archivedAt: null,
  },
];

const { payload, errors } = buildCreatePropertyPayload(form, "apartment");
if (errors.length > 0 || !payload) {
  throw new Error(`payload failed: ${errors.join("; ")}`);
}

assertEqual(payload.ssGeId, "123456", "payload ssGeId");
assertEqual(payload.externalIds?.[0]?.platform, "SS_GE", "payload platform");
assertEqual(payload.externalIds?.[0]?.value, "123456", "payload value");

const loaded = normalizeProperty({
  id: "property-1",
  propertyType: "APARTMENT",
  dealType: "RENT",
  status: "FOR_RENT",
  city: "თბილისი",
  district: "",
  address: "რუსთაველის 1",
  pricePublic: 1000,
  currency: "USD",
  ourSiteId: null,
  description: null,
  commentDate: null,
  archivedAt: null,
  images: [],
  createdAt: "2026-09-22T00:00:00.000Z",
  updatedAt: "2026-09-22T00:00:00.000Z",
  deletedAt: null,
  externalIds: [
    {
      id: "ext-1",
      platform: "SS_GE",
      value: "123456",
      enteredAt: "2026-09-22T00:00:00.000Z",
      archivedAt: null,
    },
  ],
});

if (!loaded) {
  throw new Error("normalizeProperty returned null");
}

assertEqual(loaded.externalIds?.[0]?.platform, "SS_GE", "GET platform");
assertEqual(loaded.externalIds?.[0]?.value, "123456", "GET value");
assertEqual(
  lookupEnumLabel(EXTERNAL_ID_PLATFORM_LABELS, loaded.externalIds?.[0]?.platform ?? ""),
  "SS.ge",
  "UI label",
);

const friendlyMessage = getApiErrorMessage(
  {
    message: "platform must be one of the following values: MYHOME, SS_GE",
    error: "Bad Request",
    statusCode: 400,
  },
  "fallback",
);
assertEqual(friendlyMessage, INVALID_EXTERNAL_ID_PLATFORM_MESSAGE, "error rewrite");

const nestedFriendlyMessage = getApiErrorMessage(
  {
    message: [
      "externalIds.0.platform must be one of the following values: MYHOME, SS_GE",
    ],
    error: "Bad Request",
    statusCode: 400,
  },
  "fallback",
);
assertEqual(
  nestedFriendlyMessage,
  INVALID_EXTERNAL_ID_PLATFORM_MESSAGE,
  "nested error rewrite",
);

const parsedError = parseStandardApiError(
  {
    message: "platform must be one of the following values: MYHOME, SS_GE",
    error: "Bad Request",
    statusCode: 400,
    fieldErrors: {
      platform: ["platform must be one of the following values: MYHOME, SS_GE"],
    },
  },
  400,
  "fallback",
);
assertEqual(parsedError.message, INVALID_EXTERNAL_ID_PLATFORM_MESSAGE, "parsed message");
assertEqual(
  parsedError.fieldErrors?.platform?.[0],
  INVALID_EXTERNAL_ID_PLATFORM_MESSAGE,
  "parsed field error",
);

console.log("external id platform checks passed");
console.log(JSON.stringify({ payloadPlatform: payload.externalIds?.[0]?.platform, loadedPlatform: loaded.externalIds?.[0]?.platform, label: "SS.ge" }));
