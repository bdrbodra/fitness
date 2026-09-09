"use client";

import { BrunoProvider, useBruno } from "@/lib/BrunoContext";
import { Header } from "@/components/Header";
import { TabBar } from "@/components/TabBar";
import { Today } from "@/components/screens/Today";
import { Momentum } from "@/components/screens/Momentum";
import { Plan } from "@/components/screens/Plan";
import { Session } from "@/components/screens/Session";
import { Meals } from "@/components/screens/Meals";
import { Capture } from "@/components/screens/Capture";
import { Progress } from "@/components/screens/Progress";
import { Chat } from "@/components/screens/Chat";
import { Profile } from "@/components/screens/Profile";
import { Onboard } from "@/components/screens/Onboard";
import { Clients } from "@/components/screens/Clients";
import { BuildPlan } from "@/components/screens/BuildPlan";
import { Review } from "@/components/screens/Review";

function Screen() {
  const { s } = useBruno();
  switch (s.view) {
    case "today":
      return <Today />;
    case "momentum":
      return <Momentum />;
    case "plan":
      return <Plan />;
    case "session":
      return <Session />;
    case "meals":
      return <Meals />;
    case "capture":
      return <Capture />;
    case "progress":
      return <Progress />;
    case "chat":
      return <Chat />;
    case "profile":
      return <Profile />;
    case "onboard":
      return <Onboard />;
    case "clients":
      return <Clients />;
    case "build":
      return <BuildPlan />;
    case "review":
      return <Review />;
    default:
      return null;
  }
}

function Shell() {
  const { loading } = useBruno();

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-paper">
        <div className="flex h-[26px] w-[26px] animate-pulse items-center justify-center bg-accent font-heading text-[15px] font-semibold leading-none text-paper">
          B
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto flex h-dvh max-w-[560px] flex-col border-x border-ink/12 bg-paper text-ink"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <Header />
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
        <Screen />
      </div>
      <TabBar />
    </div>
  );
}

export function BrunoApp({ brandName = "Bruno" }: { brandName?: string }) {
  return (
    <BrunoProvider brandName={brandName}>
      <Shell />
    </BrunoProvider>
  );
}
