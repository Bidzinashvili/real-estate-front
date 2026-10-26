import Link from "next/link";
import { UserPlus, Users } from "lucide-react";
import type { Agent } from "@/features/agents/types";
import { PasswordSetBadge } from "@/widgets/Agents/PasswordSetBadge";
import { Button, buttonVariants } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import { EmptyState, ErrorState, LoadingState } from "@/shared/ui/PageState";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { surfaceCardClassName } from "@/shared/ui/surfaceStyles";

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
    return (
      <section>
        <SectionHeader title="ჩემი აგენტები" icon={<Users className="h-4 w-4" aria-hidden />} />
        <LoadingState title="აგენტები იტვირთება…" />
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <SectionHeader title="ჩემი აგენტები" icon={<Users className="h-4 w-4" aria-hidden />} />
        <ErrorState title="აგენტების ჩატვირთვა ვერ მოხერხდა" description={error} />
      </section>
    );
  }

  return (
    <section>
      <SectionHeader
        title="ჩემი აგენტები"
        icon={<Users className="h-4 w-4" aria-hidden />}
        action={
          onAddAgent ? (
            <Button type="button" size="sm" onClick={onAddAgent}>
              <UserPlus className="h-3.5 w-3.5" aria-hidden />
              აგენტის დამატება
            </Button>
          ) : null
        }
      />

      {agents.length === 0 ? (
        <EmptyState title="აგენტები ჯერ არ გაქვთ." icon={Users} />
      ) : (
        <div className={`overflow-x-auto overflow-hidden text-sm ${surfaceCardClassName}`}>
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
                  <td className="px-4 py-3 text-foreground">
                    <div className="flex flex-col gap-1">
                      <span>{agent.fullName}</span>
                      <PasswordSetBadge passwordSet={agent.passwordSet} />
                    </div>
                  </td>
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
                      className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
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
