import { ReactNode } from "react";

type InviteLayoutProps = {
  children: ReactNode;
};

export default function InviteLayout({ children }: InviteLayoutProps) {
  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </main>
  );
}
