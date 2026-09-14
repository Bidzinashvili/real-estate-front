import { ReactNode } from "react";
import { AppShell } from "@/widgets/AppShell/AppShell";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return <AppShell>{children}</AppShell>;
}
