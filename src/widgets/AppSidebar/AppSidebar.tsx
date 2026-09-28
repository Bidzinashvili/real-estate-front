"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ARCHIVE_NAVIGATION_QUERY_KEY,
  isArchiveSidebarActive,
  isClientsSidebarActive,
  isPropertiesSidebarActive,
} from "@/features/lifecycle/archiveNavigation";
import {
  Archive,
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  Handshake,
  Home,
  Inbox,
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
import { useNotificationUnreadCount } from "@/features/notifications/useNotificationUnreadCount";

type AppSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  isDesktopCollapsed: boolean;
  onToggleDesktopCollapsed: () => void;
};

type SidebarItem = {
  href: string;
  label: string;
  icon: typeof Home;
  match: (pathname: string | null, archiveFromValue: string | null) => boolean;
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
    href: "/notifications",
    label: "შეტყობინებები",
    icon: Inbox,
    match: (pathname) => pathname?.startsWith("/notifications") === true,
  },
  {
    href: "/properties",
    label: "განცხადებები",
    icon: LayoutGrid,
    match: (pathname, archiveFromValue) =>
      isPropertiesSidebarActive(pathname, archiveFromValue),
  },
  {
    href: "/clients",
    label: "კლიენტები",
    icon: Users,
    match: (pathname, archiveFromValue) =>
      isClientsSidebarActive(pathname, archiveFromValue),
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
    match: (pathname, archiveFromValue) =>
      isArchiveSidebarActive(pathname, archiveFromValue),
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

function itemClassName(isActive: boolean, isDesktopCollapsed: boolean): string {
  return `flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition ${
    isDesktopCollapsed ? "lg:justify-center lg:gap-0 lg:px-2" : "px-3"
  } ${
    isActive
      ? "bg-primary text-primary-foreground shadow-sm"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  }`;
}

type AppSidebarFrameProps = AppSidebarProps & {
  pathname: string | null;
  isAdmin: boolean;
  inboxCount: number;
  notificationCount: number;
  archiveFromValue: string | null;
};

function AppSidebarArchiveSource(
  props: Omit<AppSidebarFrameProps, "archiveFromValue">,
) {
  const searchParams = useSearchParams();
  return (
    <AppSidebarFrame
      {...props}
      archiveFromValue={searchParams.get(ARCHIVE_NAVIGATION_QUERY_KEY)}
    />
  );
}

export function AppSidebar({
  isOpen,
  onClose,
  isDesktopCollapsed,
  onToggleDesktopCollapsed,
}: AppSidebarProps) {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";
  const { count: inboxCount } = useCollaborationInboxCount({
    enabled: user !== null,
    role: user?.role ?? null,
  });
  const { count: notificationCount } = useNotificationUnreadCount({
    enabled: user !== null,
  });
  const frameProps = {
    isOpen,
    onClose,
    isDesktopCollapsed,
    onToggleDesktopCollapsed,
    pathname,
    isAdmin,
    inboxCount,
    notificationCount,
  };

  return (
    <Suspense
      fallback={<AppSidebarFrame {...frameProps} archiveFromValue={null} />}
    >
      <AppSidebarArchiveSource {...frameProps} />
    </Suspense>
  );
}

function AppSidebarFrame({
  isOpen,
  onClose,
  isDesktopCollapsed,
  onToggleDesktopCollapsed,
  pathname,
  isAdmin,
  inboxCount,
  notificationCount,
  archiveFromValue,
}: AppSidebarFrameProps) {

  const visibleItems = SIDEBAR_ITEMS.filter((item) => !item.adminOnly || isAdmin);
  const collapseToggleLabel = isDesktopCollapsed
    ? "გვერდითი პანელის გაშლა"
    : "გვერდითი პანელის ჩაკეცვა";

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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card/95 px-3 py-4 shadow-lg backdrop-blur-sm transition-[transform,width,padding] duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isDesktopCollapsed ? "lg:w-16 lg:px-2" : "lg:w-64 lg:px-3"}`}
      >
        <div
          className={`mb-4 flex items-center gap-2 px-2 ${
            isDesktopCollapsed ? "lg:justify-center" : "justify-between"
          }`}
        >
          <Link
            href="/dashboard"
            onClick={onClose}
            className={`flex min-w-0 items-center gap-2 ${
              isDesktopCollapsed ? "lg:justify-center" : ""
            }`}
            title={isDesktopCollapsed ? "მთავარი" : undefined}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
              უქ
            </div>
            <div className={`min-w-0 ${isDesktopCollapsed ? "lg:hidden" : ""}`}>
              <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                უძრავი ქონება
              </p>
              <p className="truncate text-xs text-muted-foreground">შეხსენებები და ჩანაწერები</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="მენიუს დახურვა"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.match(pathname, archiveFromValue);
            const showCollaborationBadge = item.href === "/collaborations" && inboxCount > 0;
            const showNotificationBadge =
              item.href === "/notifications" && notificationCount > 0;
            const sidebarBadgeCount =
              item.href === "/collaborations"
                ? inboxCount
                : item.href === "/notifications"
                  ? notificationCount
                  : 0;
            const showSidebarBadge = showCollaborationBadge || showNotificationBadge;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={itemClassName(isActive, isDesktopCollapsed)}
                title={isDesktopCollapsed ? item.label : undefined}
              >
                <span className="relative shrink-0">
                  <Icon className="h-4 w-4" aria-hidden />
                  {showSidebarBadge ? (
                    <span
                      className={`absolute -right-1.5 -top-1.5 hidden min-h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-0.5 text-[9px] font-semibold leading-none text-white ${
                        isDesktopCollapsed ? "lg:inline-flex" : ""
                      }`}
                    >
                      {sidebarBadgeCount > 9 ? "9+" : sidebarBadgeCount}
                    </span>
                  ) : null}
                </span>
                <span
                  className={`min-w-0 flex-1 truncate ${
                    isDesktopCollapsed ? "lg:sr-only lg:flex-none" : ""
                  }`}
                >
                  {item.label}
                </span>
                {showSidebarBadge ? (
                  <span
                    className={`inline-flex min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-semibold text-white ${
                      isDesktopCollapsed ? "lg:hidden" : ""
                    }`}
                  >
                    {sidebarBadgeCount > 99 ? "99+" : sidebarBadgeCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div
          className={`mt-3 flex flex-col gap-2 border-t border-border pt-3 ${
            isDesktopCollapsed ? "lg:items-center lg:px-0" : "px-2"
          } [&_span]:inline`}
        >
          <button
            type="button"
            onClick={onToggleDesktopCollapsed}
            className={`hidden h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground lg:inline-flex ${
              isDesktopCollapsed ? "lg:mx-auto" : "lg:ml-auto"
            }`}
            aria-label={collapseToggleLabel}
            aria-expanded={!isDesktopCollapsed}
            title={collapseToggleLabel}
          >
            {isDesktopCollapsed ? (
              <ChevronRight className="h-4 w-4" aria-hidden />
            ) : (
              <ChevronLeft className="h-4 w-4" aria-hidden />
            )}
          </button>
          <ThemeToggle compact={isDesktopCollapsed} />
        </div>
      </aside>
    </>
  );
}
