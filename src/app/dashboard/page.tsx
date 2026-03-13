"use client";

import { useCurrentUser, useSignOut } from "@/shared/hooks";

function DashboardPage() {
  const { user } = useCurrentUser();
  const signOut = useSignOut();

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p className="text-lg">
        Welcome, <span className="font-semibold">{user.email}</span>
      </p>
      <p className="text-lg">
        ID: <span className="font-semibold">{user.id}</span>
      </p>
      <p className="text-lg">
        Role: <span className="font-semibold">{user.role}</span>
      </p>

      <button
        onClick={signOut}
        className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
      >
        Sign Out
      </button>
    </main>
  );
}

export default DashboardPage;
