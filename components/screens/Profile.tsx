"use client";

import { useBruno } from "@/lib/BrunoContext";
import { Blueprint } from "@/components/ui/Blueprint";
import { RigTap } from "@/components/ui/RigTap";

export function Profile() {
  const { d, go } = useBruno();

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-[22px] pt-4">
      <div className="font-heading text-[30px] font-semibold leading-none">{d.profile_h}</div>

      <Blueprint className="flex items-center gap-3 p-3.5">
        <div
          className="h-[54px] w-[54px] flex-none border border-ink/16"
          style={{
            background:
              "repeating-linear-gradient(45deg, var(--color-neutral-300) 0 4px, var(--color-neutral-200) 4px 8px)",
          }}
        />
        <div>
          <div className="font-heading text-[21px] font-semibold leading-none">MARCO BELLI</div>
          <div className="mt-[3px] text-[12px] text-neutral-700">{d.profile_meta}</div>
        </div>
      </Blueprint>

      {d.settings.map(([label, value]) => (
        <div key={label} className="flex items-center gap-2.5 border-b border-ink/8 py-3">
          <span className="flex-1 text-[14px]">{label}</span>
          <span className="font-heading text-[13px] font-semibold leading-none tracking-[.06em] text-accent-700">
            {value}
          </span>
        </div>
      ))}

      <RigTap
        onClick={() => go("onboard")}
        className="flex min-h-[48px] w-full items-center justify-center border border-ink/16 font-heading text-[14px] font-semibold leading-none tracking-[.1em]"
      >
        {d.replay_onboard}
      </RigTap>
    </div>
  );
}
