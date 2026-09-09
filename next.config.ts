import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This repo ships its own README/CLAUDE guidance; skip Next's generated
  // AGENTS.md/CLAUDE.md scaffolding on every `next dev` run.
  agentRules: false,
};

export default nextConfig;
