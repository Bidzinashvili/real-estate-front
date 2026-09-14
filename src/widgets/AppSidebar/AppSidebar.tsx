"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  Bell,
  Building2,
  Handshake,
  Home,
  LayoutGrid,
  Trash2,
  Users,
  UserCircle2,
  X,
  Shield,
} from "lucide-react";
import { useUserStore } from "@/shared/stores";
import { ThemeToggle } from "@/shared/theme/ThemeToggle";
import { useCollaborationInboxCount } from "@/features/collaboration/useCollaborationInboxCount";

type AppSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

type SidebarItem = {
  href: string;
  label: string;
  icon: typeof Home;
  match: (pathname: string | null) => boolean;
  adminOnly?: boolean;
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    href: "/dashboard",
    label: "მთავარი",
    icon: Home,
    match: (pathname) => pathname === "/dashboard",
  },
  {
    href: "/reminders",
    label: "შეხსენებები",
    icon: Bell,
    match: (pathname) => pathname?.startsWith("/reminders") === true,
  },
  {
    href: "/properties",
    label: "განცხადებები",
    icon: LayoutGrid,
    match: (pathname) => pathname?.startsWith("/properties") === true,
  },
  {
    href: "/clients",
    label: "კლიენტები",
    icon: Users,
    match: (pathname) =>
      pathname?.startsWith("/clients") === true &&
      pathname?.startsWith("/client-profiles") !== true,
  },
  {
    href: "/client-profiles",
    label: "პროფილები",
    icon: UserCircle2,
    match: (pathname) => pathname?.startsWith("/client-profiles") === true,
  },
  {
    href: "/property-owners",
    label: "მეპატრონეები",
    icon: Building2,
    match: (pathname) => pathname?.startsWith("/property-owners") === true,
  },
  {
    href: "/collaborations",
    label: "თანამშრომლობა",
    icon: Handshake,
    match: (pathname) => pathname?.startsWith("/collaborations") === true,
  },
  {
    href: "/archive",
    label: "არქივი",
    icon: Archive,
    match: (pathname) => pathname?.startsWith("/archive") === true,
  },
  {
    href: "/account",
    label: "ანგარიში",
    icon: Shield,
    match: (pathname) => pathname?.startsWith("/account") === true,
  },
  {
    href: "/admin/trash",
    label: "ნაგვის ყუთი",
    icon: Trash2,
    match: (pathname) => pathname?.startsWith("/admin/trash") === true,
    adminOnly: true,
  },
  {
    href: "/agents",
    label: "აგენტები",
    icon: Users,
    match: (pathname) => pathname?.startsWith("/agents") === true,
    adminOnly: true,
  },
];

function itemClassName(isActive: boolean): string {
  return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? "bg-primary text-primary-foreground shadow-sm"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  }`;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";
  const { count: inboxCount } = useCollaborationInboxCount({
    enabled: user !== null,
    role: user?.role ?? null,
  });

  const visibleItems = SIDEBAR_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-primary/40 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card/95 px-3 py-4 shadow-lg backdrop-blur-sm transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between gap-2 px-2">
          <Link href="/dashboard" onClick={onClose} className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
              უქ
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                უძრავი ქონება
              </p>
              <p className="truncate text-xs text-muted-foreground">შეხსენებები და ჩანაწერები</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="მენიუს დახურვა"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={itemClassName(isActive)}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.href === "/collaborations" && inboxCount > 0 ? (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {inboxCount > 99 ? "99+" : inboxCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-3 border-t border-border px-2 pt-3 [&_span]:inline">
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
