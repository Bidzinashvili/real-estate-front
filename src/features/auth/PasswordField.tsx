"use client";

import { useId, useState, type ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AUTH_COPY } from "@/features/auth/authCopy";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  error?: string | null;
  disabled?: boolean;
  describedBy?: string;
  name?: string;
};

export function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  error = null,
  disabled = false,
  describedBy,
  name,
}: PasswordFieldProps) {
  const generatedErrorId = useId();
  const [isVisible, setIsVisible] = useState(false);
  const errorId = error ? `${id}-${generatedErrorId}` : undefined;
  const describedByIds = [describedBy, errorId].filter(Boolean).join(" ") || undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name ?? id}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={handleChange}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedByIds}
          className="block w-full min-w-0 rounded-lg border border-border bg-card px-3 py-2 pr-11 text-sm text-foreground shadow-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-70"
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-muted-foreground transition hover:text-foreground"
          aria-label={isVisible ? AUTH_COPY.hidePassword : AUTH_COPY.showPassword}
          aria-pressed={isVisible}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {error ? (
        <p id={errorId} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
