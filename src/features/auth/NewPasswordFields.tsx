"use client";

import { AUTH_COPY } from "@/features/auth/authCopy";
import { PasswordField } from "@/features/auth/PasswordField";

type NewPasswordFieldsProps = {
  newPassword: string;
  confirmPassword: string;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  newPasswordError?: string | null;
  confirmPasswordError?: string | null;
  disabled?: boolean;
  newPasswordId?: string;
  confirmPasswordId?: string;
  helperId?: string;
};

export function NewPasswordFields({
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
  newPasswordError = null,
  confirmPasswordError = null,
  disabled = false,
  newPasswordId = "new-password",
  confirmPasswordId = "confirm-password",
  helperId = "password-policy-helper",
}: NewPasswordFieldsProps) {
  return (
    <div className="space-y-4">
      <PasswordField
        id={newPasswordId}
        name="new-password"
        label={AUTH_COPY.newPasswordLabel}
        value={newPassword}
        onChange={onNewPasswordChange}
        autoComplete="new-password"
        error={newPasswordError}
        disabled={disabled}
        describedBy={helperId}
      />
      <PasswordField
        id={confirmPasswordId}
        name="confirm-password"
        label={AUTH_COPY.confirmNewPasswordLabel}
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        autoComplete="new-password"
        error={confirmPasswordError}
        disabled={disabled}
      />
      <p id={helperId} className="text-xs text-muted-foreground">
        {AUTH_COPY.passwordPolicyHelper}
      </p>
    </div>
  );
}
