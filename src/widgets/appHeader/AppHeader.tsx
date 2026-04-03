"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/shared/stores";

export function AppHeader() {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";

  return (
    <header
      className="mb-6 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-6 max-[675px]:justify-center min-[676px]:justify-between"
    >
      <div className="hidden items-center gap-2 min-[676px]:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm">
          RE
        </div>
        <div className="flex flex-col">
          <Link
            href="/dashboard"
            className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base"
          >
            Real Estate Admin
          </Link>
          <span className="text-xs text-slate-500">
            Manage agents and performance in one place
          </span>
        </div>
      </div>

      <nav className="flex items-center gap-1 rounded-full bg-slate-100/80 p-1 text-xs font-medium text-slate-600">
        <Link
          href="/dashboard"
          className={`inline-flex items-center rounded-full px-3 py-1 transition ${
            pathname === "/dashboard"
              ? "bg-white text-slate-900 shadow-sm"
              : "hover:text-slate-900"
          }`}
        >
          Dashboard
        </Link>
        {isAdmin && (
          <Link
            href="/agents"
            className={`inline-flex items-center rounded-full px-3 py-1 transition ${
              pathname?.startsWith("/agents")
                ? "bg-white text-slate-900 shadow-sm"
                : "hover:text-slate-900"
            }`}
          >
            Agents
          </Link>
        )}
        <Link
          href="/properties"
          className={`inline-flex items-center rounded-full px-3 py-1 transition ${
            pathname?.startsWith("/properties")
              ? "bg-white text-slate-900 shadow-sm"
              : "hover:text-slate-900"
          }`}
        >
          Properties
        </Link>
      </nav>
    </header>
  );
}

