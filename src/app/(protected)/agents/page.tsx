import type { Metadata } from "next";
import { AgentsView } from "@/widgets/Agents/AgentsView";

export const metadata: Metadata = {
  title: "აგენტები",
};

export default function AgentsPage() {
  return <AgentsView />;
}

