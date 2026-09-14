"use client";

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { UserBootstrap } from "@/widgets/userBootstrap/UserBootstrap";
import { ReminderAlertCenter } from "@/widgets/ReminderAlertCenter/ReminderAlertCenter";
import { AppSidebar } from "@/widgets/AppSidebar/AppSidebar";
import { UndoSnackbarHost } from "@/widgets/UndoSnackbar/UndoSnackbarHost";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <UserBootstrap />
      <ReminderAlertCenter />
      <UndoSnackbarHost />
      <AppSidebar isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur-sm lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm"
            aria-label="ნავიგაციის გახსნა"
          >
            <Menu className="h-4 w-4" aria-hidden />
          </button>
          <Link href="/dashboard" className="text-sm font-semibold tracking-tight text-foreground">
            უძრავი ქონება
          </Link>
        </header>
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
