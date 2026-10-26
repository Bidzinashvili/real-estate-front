"use client";

import { useRouter } from "next/navigation";
import { Handshake, LayoutGrid, Users } from "lucide-react";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";

type DashboardActionsProps = {
  isAdmin: boolean;
};

type QuickAction = {
  href: string;
  badge: string;
  title: string;
  description: string;
  icon: typeof LayoutGrid;
  badgeClassName: string;
};

export function DashboardActions({ isAdmin }: DashboardActionsProps) {
  const router = useRouter();

  const actions: QuickAction[] = [
    {
      href: "/properties",
      badge: "განცხადებები",
      title: "განცხადებების ნახვა და მართვა",
      description: "დაამატეთ ახალი განცხადებები და განაახლეთ დეტალები ერთ სივრცეში.",
      icon: LayoutGrid,
      badgeClassName: "bg-success-muted text-success-foreground",
    },
    ...(isAdmin
      ? [
          {
            href: "/agents",
            badge: "აგენტები",
            title: "გუნდის მართვა",
            description: "მოიწვიეთ ახალი აგენტები და აკონტროლეთ სამუშაო.",
            icon: Users,
            badgeClassName: "bg-primary/10 text-primary",
          } satisfies QuickAction,
        ]
      : []),
    {
      href: "/collaborations",
      badge: "თანამშრომლობა",
      title: isAdmin ? "მოთხოვნების დამტკიცება" : "თანამშრომლობის მოთხოვნები",
      description: isAdmin
        ? "დაამტკიცეთ მიღებული მოთხოვნები და აკონტროლეთ განცხადებები."
        : "ნახეთ შემოსული და გაგზავნილი თანამშრომლობის მოთხოვნები.",
      icon: Handshake,
      badgeClassName: "bg-warning-muted text-warning-foreground",
    },
  ];

  return (
    <section>
      <SectionHeader
        title="სწრაფი მოქმედებები"
        description="ხშირად გამოყენებული განყოფილებები"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.href}
              type="button"
              onClick={() => router.push(action.href)}
              className="text-left"
            >
              <SurfaceCard interactive padding="sm" className="h-full">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 space-y-1.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${action.badgeClassName}`}
                    >
                      {action.badge}
                    </span>
                    <p className="text-sm font-medium text-foreground">{action.title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </SurfaceCard>
            </button>
          );
        })}
      </div>
    </section>
  );
}
