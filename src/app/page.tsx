"use client";

import { useStore } from "@/shared/lib/store";
import { ExampleForm } from "@/features/example-form";
import { GoogleLoginButton } from "@/features/auth";

function Home() {
  const { count, increment, decrement, reset } = useStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-4">
          Welcome to Real Estate App
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Built with Next.js, FSD Architecture, Zustand, React Hook Form, and shadcn/ui
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <GoogleLoginButton />

          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Zustand Store Example</h2>
            <div className="space-y-4">
              <p className="text-lg">Count: {count}</p>
              <div className="flex gap-2">
                <button
                  onClick={increment}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Increment
                </button>
                <button
                  onClick={decrement}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
                >
                  Decrement
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/90"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">
              React Hook Form Example
            </h2>
            <ExampleForm />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
