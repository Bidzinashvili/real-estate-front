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
          Good to see you again
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          You&apos;re signed in as{" "}
          <span className="font-medium text-slate-900">{email}</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          Role: {role === "ADMIN" ? "Admin" : "Agent"}
        </span>
        <button
          onClick={onSignOut}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
        >
          Log out
        </button>
      </div>
    </header>
  );
}

