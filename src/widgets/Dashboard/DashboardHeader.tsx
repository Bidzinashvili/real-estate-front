import { Shield } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { pageSubtitleClassName, pageTitleClassName } from "@/shared/ui/surfaceStyles";

type DashboardHeaderProps = {
  email: string;
  role: "ADMIN" | "AGENT";
  onSignOut: () => void;
};

export function DashboardHeader({ email, role, onSignOut }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className={pageTitleClassName}>კეთილი იყოს თქვენი მობრძანება</h1>
        <p className={pageSubtitleClassName}>
          შესული ხართ როგორც{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
          <Shield className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          {role === "ADMIN" ? "ადმინი" : "აგენტი"}
        </span>
        <Button variant="secondary" size="sm" onClick={onSignOut}>
          გასვლა
        </Button>
      </div>
    </header>
  );
}
