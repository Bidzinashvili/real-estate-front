import Link from "next/link";
import type { Agent } from "@/features/agents/types";

type AdminAgentsSectionProps = {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  onAddAgent?: () => void;
};

export function AdminAgentsSection({
  agents,
  isLoading,
  error,
  onAddAgent,
}: AdminAgentsSectionProps) {
  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading agents…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <section className="mt-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-800">Your agents</h2>
        {onAddAgent && (
          <button
            type="button"
            onClick={onAddAgent}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Add agent
          </button>
        )}
      </div>

      {agents.length === 0 ? (
        <p className="text-sm text-slate-600">
          You don&apos;t have any agents yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white text-sm shadow-sm ring-1 ring-slate-200">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-50 text-left text-xs font-medium text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="hidden px-4 py-3 md:table-cell">Email</th>
                <th className="hidden px-4 py-3 md:table-cell">Phone</th>
                <th className="hidden px-4 py-3 md:table-cell">Joined</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-900">{agent.fullName}</td>
                  <td className="hidden px-4 py-3 text-slate-700 md:table-cell">
                    {agent.email}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-700 md:table-cell">
                    {agent.phone || "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-700 md:table-cell">
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/agents/${agent.id}`}
                      className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white transition hover:bg-slate-800"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

