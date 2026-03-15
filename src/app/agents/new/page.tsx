import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add agent",
};

function AddAgentPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold tracking-tight">Add agent</h1>
        <p className="mt-2 text-sm text-slate-600">
          This screen will let you add a new agent. For now, it is a simple
          placeholder.
        </p>
      </div>
    </main>
  );
}

export default AddAgentPage;

