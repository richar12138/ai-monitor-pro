import type { Metadata } from "next";
import ResourcesClient from "./ResourcesClient";

export const metadata: Metadata = {
  title: "Community Resources — AI Monitor Pro",
  description:
    "Curated guides, MCP servers, Claude Code hooks, skills, and workflow patterns for people building with AI coding agents.",
  alternates: { canonical: "https://github.com/richar12138/ai-monitor-pro/resources" },
  robots: { index: true, follow: true },
};

export default function ResourcesPage() {
  return <ResourcesClient />;
}
