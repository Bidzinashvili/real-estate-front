type DashboardActionsProps = {
  isAdmin: boolean;
};

export function DashboardActions({ isAdmin }: DashboardActionsProps) {
  return (
    <section className="mt-2">
      <h2 className="mb-3 text-sm font-semibold text-slate-800">
        What would you like to do?
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          className="group flex flex-col items-start gap-2 rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Properties
          </span>
          <p className="text-sm font-medium text-slate-900">
            See and manage all properties
          </p>
          <p className="text-xs text-slate-600">
            Add new homes, update details, and keep everything tidy in one
            place.
          </p>
        </button>

        {isAdmin && (
          <button
            type="button"
            className="group flex flex-col items-start gap-2 rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              Agents
            </span>
            <p className="text-sm font-medium text-slate-900">
              Look after your team
            </p>
            <p className="text-xs text-slate-600">
              Invite new agents and keep track of who is working on what.
            </p>
          </button>
        )}
      </div>
    </section>
  );
}

