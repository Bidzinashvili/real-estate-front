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
    return <p className="text-sm text-muted-foreground">აგენტები იტვირთება…</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <section className="mt-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">ჩემი აგენტები</h2>
        {onAddAgent && (
          <button
            type="button"
            onClick={onAddAgent}
            className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-primary/90"
          >
            აგენტის დამატება
          </button>
        )}
      </div>

      {agents.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          აგენტები ჯერ არ გაქვთ.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl bg-card text-sm shadow-sm ring-1 ring-border">
          <table className="min-w-full border-collapse">
            <thead className="bg-muted text-left text-xs font-medium text-muted-foreground">
              <tr>
                <th className="px-4 py-3">სახელი</th>
                <th className="hidden px-4 py-3 md:table-cell">ელფოსტა</th>
                <th className="hidden px-4 py-3 md:table-cell">ტელეფონი</th>
                <th className="hidden px-4 py-3 md:table-cell">შემოუერთდა</th>
                <th className="px-4 py-3 text-right">დეტალები</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">{agent.fullName}</td>
                  <td className="hidden px-4 py-3 text-foreground md:table-cell">
                    {agent.email}
                  </td>
                  <td className="hidden px-4 py-3 text-foreground md:table-cell">
                    {agent.phone || "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-foreground md:table-cell">
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/agents/${agent.id}`}
                      className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-white transition hover:bg-primary/90"
                    >
                      ნახვა
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

