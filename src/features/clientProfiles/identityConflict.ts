import { ApiError } from "@/shared/lib/apiError";

export const CLIENT_PROFILE_IDENTITY_CONFLICT = "CLIENT_PROFILE_IDENTITY_CONFLICT";

export const IDENTITY_CONFLICT_MESSAGE =
  "შეყვანილი ნომრები სხვადასხვა კლიენტის პროფილებთან არის დაკავშირებული. საჭიროა ხელით გადამოწმება.";

export function isClientProfileIdentityConflict(error: unknown): boolean {
  if (!(error instanceof ApiError)) {
    return false;
  }
  return (
    error.code === CLIENT_PROFILE_IDENTITY_CONFLICT ||
    error.error === CLIENT_PROFILE_IDENTITY_CONFLICT
  );
}
