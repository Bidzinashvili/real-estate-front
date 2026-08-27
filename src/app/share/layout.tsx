import type { ReactNode } from "react";
import { ui } from "@/shared/i18n/ui";

type ShareLayoutProps = {
  children: ReactNode;
};

export default function ShareLayout({ children }: ShareLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/90 px-4 py-3 backdrop-blur-sm sm:px-6">
        <p className="text-sm font-semibold tracking-tight">{ui.appName}</p>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
