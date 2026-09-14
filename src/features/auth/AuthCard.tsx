import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-center text-2xl font-bold text-foreground">{title}</h1>
        {description ? (
          <p className="mt-2 mb-6 text-center text-sm text-muted-foreground">{description}</p>
        ) : (
          <div className="mb-6" />
        )}
        {children}
      </div>
    </div>
  );
}
