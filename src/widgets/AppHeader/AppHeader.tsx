"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/shared/stores";
import { ThemeToggle } from "@/shared/theme/ThemeToggle";

export function AppHeader() {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-card/80 px-3 py-3 shadow-sm backdrop-blur-sm sm:gap-4 sm:px-6 max-[675px]:justify-center min-[676px]:justify-between">
      <div className="hidden items-center gap-2 min-[676px]:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
          უქ
        </div>
        <div className="flex flex-col">
          <Link
            href="/dashboard"
            className="text-sm font-semibold tracking-tight text-foreground sm:text-base"
          >
            უძრავი ქონება
          </Link>
          <span className="text-xs text-muted-foreground">
            აგენტებისა და განცხადებების მართვა
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <nav className="flex items-center gap-1 overflow-x-auto rounded-full bg-muted/80 p-1 text-xs font-medium text-muted-foreground">
          <Link
            href="/dashboard"
            className={`inline-flex items-center rounded-full px-3 py-1 transition ${
              pathname === "/dashboard"
                ? "bg-card text-foreground shadow-sm"
                : "hover:text-foreground"
            }`}
          >
            მთავარი
          </Link>
          {isAdmin && (
            <Link
              href="/agents"
              className={`inline-flex items-center rounded-full px-3 py-1 transition ${
                pathname?.startsWith("/agents")
                  ? "bg-card text-foreground shadow-sm"
                  : "hover:text-foreground"
              }`}
            >
              აგენტები
            </Link>
          )}
          <Link
            href="/clients"
            className={`inline-flex items-center rounded-full px-3 py-1 transition ${
              pathname?.startsWith("/clients")
                ? "bg-card text-foreground shadow-sm"
                : "hover:text-foreground"
            }`}
          >
            კლიენტები
          </Link>
          <Link
            href="/properties"
            className={`inline-flex items-center rounded-full px-3 py-1 transition ${
              pathname?.startsWith("/properties")
                ? "bg-card text-foreground shadow-sm"
                : "hover:text-foreground"
            }`}
          >
            განცხადებები
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
