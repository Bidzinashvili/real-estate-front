type DashboardHeaderProps = {
  email: string;
  role: "ADMIN" | "AGENT";
  onSignOut: () => void;
};

export function DashboardHeader({ email, role, onSignOut }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          კეთილი იყოს თქვენი მობრძანება
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          შესული ხართ როგორც{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
          როლი: {role === "ADMIN" ? "ადმინი" : "აგენტი"}
        </span>
        <button
          onClick={onSignOut}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
        >
          გასვლა
        </button>
      </div>
    </header>
  );
}

