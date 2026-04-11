import { ReactNode } from "react";

type InviteLayoutProps = {
  children: ReactNode;
};

export default function InviteLayout({ children }: InviteLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </main>
  );
}
