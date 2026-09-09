"use client";

import { useBruno } from "@/lib/BrunoContext";
import type { View } from "@/lib/types";

const USER_TABS: View[] = ["today", "plan", "meals", "momentum", "progress", "chat"];
const TRAINER_TABS: View[] = ["clients", "build", "review", "chat", "profile"];

const VIEW_ALIAS: Partial<Record<View, View>> = {
  session: "plan",
  capture: "meals",
  onboard: "profile",
};

export function TabBar() {
  const { s, d, go } = useBruno();
  const trainer = s.role === "trainer";
  const tabs = trainer ? TRAINER_TABS : USER_TABS;
  const labels = trainer ? d.tabs_trainer : d.tabs_user;
  const active = VIEW_ALIAS[s.view] ?? s.view;

  return (
    <div
      className="flex flex-none border-t border-ink/16 bg-paper px-1"
      style={{ paddingBottom: "calc(6px + env(safe-area-inset-bottom))" }}
    >
      {tabs.map((view, i) => (
        <button
          key={view}
          type="button"
          onClick={() => go(view)}
          className={`rig-tap flex min-h-[50px] flex-1 items-center justify-center border-t-2 font-heading text-[11px] font-semibold leading-none tracking-[.08em] ${
            active === view ? "border-accent text-accent" : "border-transparent text-neutral-700"
          }`}
        >
          {labels[i]}
        </button>
      ))}
    </div>
  );
}
