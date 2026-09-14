"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/shared/theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const nextLabel = isDark ? "ღია რეჟიმი" : "მუქი რეჟიმი";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={nextLabel}
      title={nextLabel}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-accent"
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
      ) : (
        <Moon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
      )}
      <span className="hidden min-[820px]:inline">{nextLabel}</span>
    </button>
  );
}
