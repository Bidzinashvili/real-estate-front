import { ReactNode } from "react";
import { AppHeader } from "@/widgets/AppHeader/AppHeader";
import { UserBootstrap } from "@/widgets/userBootstrap/UserBootstrap";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <UserBootstrap />
        <AppHeader />
        {children}
      </div>
    </main>
  );
}

