"use client";

import { useBruno } from "@/lib/BrunoContext";
import { RigTap } from "@/components/ui/RigTap";

export function Header() {
  const { d, brand, brandInitial, toggleLang, go } = useBruno();

  return (
    <div
      className="sticky top-0 z-10 flex flex-none items-center gap-2 border-b border-ink/16 bg-paper px-3.5 pb-2.5"
      style={{ paddingTop: "calc(8px + env(safe-area-inset-top))" }}
    >
      <div className="flex items-center gap-1.5">
        <div className="flex h-[22px] w-[22px] items-center justify-center bg-accent font-heading text-[15px] font-semibold leading-none text-paper">
          {brandInitial}
        </div>
        <span className="font-heading text-[19px] font-semibold leading-none tracking-[.14em]">
          {brand}
        </span>
      </div>

      <RigTap
        onClick={toggleLang}
        className="ml-auto flex h-11 min-w-11 items-center justify-center border border-accent px-2 font-heading text-[11px] font-semibold leading-none tracking-[.1em] text-accent-700"
      >
        {d.lang_next}
      </RigTap>
      <RigTap
        onClick={() => go("profile")}
        className="flex h-11 min-w-11 items-center justify-center border border-ink/16 px-2 font-heading text-[11px] font-semibold leading-none tracking-[.1em]"
      >
        {d.me}
      </RigTap>
    </div>
  );
}
