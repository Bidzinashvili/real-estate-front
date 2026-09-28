export const UNARCHIVE_ERROR_BY_HTTP_STATUS: Readonly<Record<number, string>> = {
  400: "ამ სტატუსის ჩანაწერის არქივიდან აღდგენა შეუძლებელია.",
  403: "ამ ჩანაწერის აღდგენის უფლება არ გაქვთ.",
  404: "ჩანაწერი ვერ მოიძებნა.",
};

export const UNARCHIVE_GENERIC_ERROR = "არქივიდან აღდგენა ვერ მოხერხდა.";

export function unarchiveErrorFallback(httpStatus: number): string {
  return UNARCHIVE_ERROR_BY_HTTP_STATUS[httpStatus] ?? UNARCHIVE_GENERIC_ERROR;
}
